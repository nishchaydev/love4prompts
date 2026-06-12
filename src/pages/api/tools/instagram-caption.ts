import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';
import { checkServerRateLimit, recordServerUsage } from '../../../lib/server-rate-limit';

// Simple in-memory rate limit store (Use Redis for production/serverless environments)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
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
    const rateLimitResult = await checkServerRateLimit(request, 'instagram-caption');
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ error: rateLimitResult.error }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await recordServerUsage(rateLimitResult.userId, 'instagram-caption', rateLimitResult.clientIp);
    // 1. Optional Authentication Check
    const authHeader = request.headers.get('Authorization');
    const expectedToken = import.meta.env.API_SECRET_TOKEN; 
    
    if (expectedToken) {
      if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
        console.warn('Unauthorized API access attempt rejected.');
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 2. Rate Limiting Check
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const body = await request.json();
    const { description, tone, styles, extraContext, niche, goal, postType } = body;

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      return new Response(JSON.stringify({ error: 'Please describe your post in a bit more detail.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const MAX_DESC_LENGTH = 1000;
    if (description.length > MAX_DESC_LENGTH) {
      return new Response(JSON.stringify({ error: 'Description exceeds limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitize = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeDesc = sanitize(description);
    const safeTone = tone ? sanitize(tone) : 'Casual';
    const safeNiche = niche ? sanitize(niche) : 'General Audience';
    const safeGoal = goal ? sanitize(goal) : 'Get Engagement';
    const safePostType = postType ? sanitize(postType) : 'Static';
    
    const includesEmojis = styles && styles.includes('Lots of Emojis');
    const emojiRule = includesEmojis ? 'Use them strategically to draw the eye' : 'NO emojis at all';
    const includesHashtags = styles && styles.includes('Include Hashtags');
    const hashtagRule = includesHashtags ? 'Include 3-5 niche-specific tags' : 'NO hashtags';

    const systemPrompt = `You are an elite Instagram growth strategist who understands the 2026 algorithm deeply.
Instagram weights: Saves > Shares > Comments > Likes.

POST DETAILS:
- Content: ${safeDesc}
- Post Type: ${safePostType}
- Tone: ${safeTone}
- Niche/Audience: ${safeNiche}
- Goal: ${safeGoal}

RULES:
1. LINE 1 (Hook, MUST be ≤125 chars): Curiosity gap, bold claim, number hook, or identity trigger.
   Examples: "Nobody talks about this but..." / "3 things killing your reach" / "POV: you finally figured it out"
2. BODY: One idea per line. Hard line breaks. No paragraph walls.
3. CTA (last line): 
   - For saves: "Save this before you forget."
   - For shares: "Send this to someone who needs it."
   - For comments: Ask ONE specific question. Not "thoughts?" — something people can actually answer.
4. EMOJIS: ${emojiRule}. Max 4. Only at line breaks. Never mid-sentence.
5. HASHTAGS: ${hashtagRule}. 3–5 niche-specific only. No mega-tags (#love, #instagood).
6. LENGTH: Reel = 50–150 chars. Static/Carousel = 150–300 chars. Hard limits.

Return ONLY the caption. No preamble. No meta-text.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: `Write the caption based on description: ${description.trim()}`,
    });

    if (!result.content || typeof result.content !== 'string' || result.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Model returned an empty response. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const caption = result.content.trim();

    // ─── Share Score Pass ──────────────────────────────────────────────
    const scoringPrompt = `You are a social media algorithm expert. Score this caption strictly and honestly.

Platform: Instagram
Goal: ${safeGoal}
Caption:
---
${caption}
---

Score on exactly 4 dimensions (0–25 each):
1. Hook Strength: Does line 1 stop the scroll? Does it fit within 125 chars?
2. Shareability: Does it make someone think "I need to send this to someone specific"?
3. CTA Quality: Is the call to action specific and platform-appropriate?
4. Algo Alignment: Correct length, format, hashtag count for this platform?

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
        userMessage: 'Score the caption.',
        responseFormat: { type: 'json_object' }
      });
      scoreData = JSON.parse(scoreResult.content);
    } catch (e) {
      console.error('Error getting Share Score:', e);
      // Fallback if scoring fails
      scoreData = { score: -1, topFix: "Failed to generate score." };
    }

    return new Response(JSON.stringify({ 
      caption, 
      score: scoreData.score, 
      topFix: scoreData.topFix 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('Instagram Caption API error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
