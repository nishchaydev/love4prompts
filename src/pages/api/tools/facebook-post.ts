import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';
import { checkServerRateLimit, recordServerUsage } from '../../../lib/server-rate-limit';

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
    const rateLimitResult = await checkServerRateLimit(request, 'facebook-post');
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ error: rateLimitResult.error }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await recordServerUsage(rateLimitResult.userId, 'facebook-post', rateLimitResult.clientIp);
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
    const { topic, tone, niche, goal } = body;

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
    const safeTone = tone ? sanitize(tone) : 'Casual';
    const safeNiche = niche ? sanitize(niche) : 'General';
    const safeGoal = goal ? sanitize(goal) : 'Entertain';

    const systemPrompt = `You are a Facebook engagement expert optimizing for "Meaningful Social Interactions" (MSI).
Facebook weights: Shares > Long Comments > Reactions > Likes.

POST DETAILS:
- Topic: ${safeTopic}
- Tone: ${safeTone}
- Niche/Audience: ${safeNiche}
- Goal: ${safeGoal}

RULES:
1. HOOK: Line 1 must hit an emotional trigger (nostalgia, strong agreement, or outrage/debate). Make them nod their head immediately.
2. FORMAT: 100-250 words. Conversational. Feels like a text to a friend, not a marketing broadcast.
3. ALGORITHM PENALTIES: Do NOT use engagement bait ("Tag a friend who", "Like if you agree"). The algorithm will suppress the post.
4. CTA: End with an open-ended question that requires a real answer, not a yes/no.
5. HASHTAGS: Zero or max 1. Facebook suppresses heavy hashtag use.

Return ONLY the post text. No preamble. No meta-text.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: `Write the Facebook post based on topic: ${topic.trim()}`,
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

Platform: Facebook
Goal: ${safeGoal}
Post:
---
${post}
---

Score on exactly 4 dimensions (0–25 each):
1. Hook Strength: Does line 1 hit an emotional trigger (nostalgia/agreement)?
2. Shareability: Does it feel like a text to a friend rather than a broadcast? Is it highly relatable?
3. CTA Quality: Is the call to action a real, open-ended question (not engagement bait)?
4. Algo Alignment: Are there zero/minimal hashtags and zero engagement bait words?

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
    console.error('Facebook Post API error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
