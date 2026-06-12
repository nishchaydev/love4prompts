import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count += 1;
  return true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedToken = import.meta.env.API_SECRET_TOKEN; 
    
    if (expectedToken) {
      if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const body = await request.json();
    const { topic, keyPoints, tone, niche, goal } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 5) {
      return new Response(JSON.stringify({ error: 'Please describe the topic in a bit more detail.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const MAX_TOPIC_LENGTH = 1000;
    if (topic.length > MAX_TOPIC_LENGTH) {
      return new Response(JSON.stringify({ error: 'Topic exceeds limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeTopic = sanitize(topic);
    const safePoints = keyPoints ? sanitize(keyPoints) : '';
    const safeTone = tone ? sanitize(tone) : 'Professional';
    const safeNiche = niche ? sanitize(niche) : 'Professionals';
    const safeGoal = goal ? sanitize(goal) : 'Educate';

    const systemPrompt = `You are a top-tier LinkedIn ghostwriter optimizing for Dwell Time and Comments.
LinkedIn weights: Comments > Shares > Likes.

POST DETAILS:
- Topic: ${safeTopic}
- Key Points: ${safePoints}
- Tone: ${safeTone}
- Niche/Audience: ${safeNiche}
- Goal: ${safeGoal}

RULES:
1. HOOK (Lines 1-3): Line 1 must be a contrarian take, a personal vulnerability, or a massive insight. Line 2 and 3 must build tension so they click "See more...".
2. STRUCTURE: 150-300 words. Short sentences. Lots of white space (1-2 line paragraphs max).
3. NO EXTERNAL LINKS: Do not include "link in comments" or any URLs in the body text. The algo penalizes it.
4. HASHTAGS: Max 3 at the very bottom.
5. CTA: The final line MUST ask a question that invites disagreement or shared experience to drive comments.

Return ONLY the post text. No preamble. No meta-text.`;

    const result = await callGroq({
      model: 'openai/gpt-oss-120b',
      systemPrompt,
      userMessage: `Write the LinkedIn post based on topic: ${topic.trim()}`,
    });

    if (!result.content || typeof result.content !== 'string' || result.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Model returned an empty response. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const post = result.content.trim();

    // ─── Share Score Pass ──────────────────────────────────────────────
    const scoringPrompt = `You are a social media algorithm expert. Score this caption strictly and honestly.

Platform: LinkedIn
Goal: ${safeGoal}
Post:
---
${post}
---

Score on exactly 4 dimensions (0–25 each):
1. Hook Strength: Do the first 3 lines build enough tension to make someone click "See more..."?
2. Shareability/Comments: Does it invite meaningful discussion or disagreement?
3. CTA Quality: Is the call to action specific and comment-focused?
4. Algo Alignment: Are there zero external links? Is the formatting readable (lots of whitespace)?

Return ONLY this JSON, nothing else:
{
  "score": <total 0-100>,
  "hook": <0-25>,
  "shareability": <0-25>,
  "cta": <0-25>,
  "algo": <0-25>,
  "topFix": "<one sentence: the single most important improvement>"
}`;

    let scoreData = { score: 0, topFix: "" };
    try {
      const scoreResult = await callGroq({
        model: 'llama-3.1-8b-instant',
        systemPrompt: scoringPrompt,
        userMessage: 'Score the post.',
        responseFormat: { type: 'json_object' }
      });
      scoreData = JSON.parse(scoreResult.content);
    } catch (e) {
      console.error('Error getting Share Score:', e);
      scoreData = { score: -1, topFix: "Failed to generate score." };
    }

    return new Response(JSON.stringify({ 
      post, 
      score: scoreData.score, 
      topFix: scoreData.topFix 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('LinkedIn Post API error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
