import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { topic, tone, hookStyle, includeCTA } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 10) {
      return new Response(JSON.stringify({ error: 'Please describe your topic in a bit more detail.' }), {
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

    const systemPrompt = `You are an expert LinkedIn content writer who has helped thousands of professionals build their personal brand. You write posts that feel authentic, get high engagement, and don't sound like AI wrote them.

Write a LinkedIn post with these requirements:
- Topic: ${topic}
- Tone: ${tone}
- Hook style: ${hookStyle}
- Include CTA: ${includeCTA}

Rules:
- Start with a strong hook (first line must stop the scroll)
- Use short paragraphs (1-3 lines max)
- Add line breaks between paragraphs
- Sound like a real human wrote this
- If includeCTA is true, end with one clear call to action
- No hashtags unless they're genuinely relevant (max 3)
- Max 1500 characters for best engagement
- Never start with 'I am excited to' or 'Thrilled to share'

Return ONLY the post text, nothing else.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: `Write the LinkedIn post based on topic: ${topic.trim()}`,
    });

    if (!result.content || typeof result.content !== 'string' || result.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Model returned an empty response. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ post: result.content.trim() }), {
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
