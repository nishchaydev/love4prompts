import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

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
    const { description, tone, styles, extraContext } = body;

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      return new Response(JSON.stringify({ error: 'Please describe your photo or video in a bit more detail.' }), {
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
    const safeStyles = styles ? styles.map(sanitize).join(', ') : 'None';
    const safeExtra = extraContext ? sanitize(extraContext) : 'None';

    const systemPrompt = `You are an elite Instagram and TikTok social media manager who understands the algorithms deeply. You write captions that maximize engagement, stop the scroll, and trigger algorithmic viral reach.

Write an engaging caption for this photo/video:
- Description: ${safeDesc}
- Tone: ${safeTone}
- Requested Styles: ${safeStyles}
- Extra Context: ${safeExtra}

Algorithm optimization rules:
- Start with a powerful, scroll-stopping hook on the first line.
- Use natural, conversational language that encourages saves and shares.
- Format with clear line breaks for readability (no giant walls of text).
- If emojis are requested or allowed, use them strategically to draw the eye, not to clutter.
- End with a strong Call to Action (CTA) or a question that drives comments (comments boost the algorithm).
- If hashtags are requested, include 3-5 highly relevant hashtags at the bottom.
- Ensure the tone matches the user's request perfectly.

Return ONLY the caption text, nothing else. No preamble or meta-text.`;

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

    return new Response(JSON.stringify({ caption: result.content.trim() }), {
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
