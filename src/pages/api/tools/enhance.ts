import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt, targetTool } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (prompt.length > 10000) {
      return new Response(JSON.stringify({ error: 'Prompt exceeds 10,000 character limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!targetTool || !AI_TOOLS.includes(targetTool)) {
      return new Response(JSON.stringify({ error: `Invalid target tool. Must be one of: ${AI_TOOLS.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a prompt engineering expert. Take the user's basic prompt and enhance it for ${targetTool}. Return only the enhanced prompt, no explanation, no preamble, no markdown formatting — just the raw enhanced prompt text.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: prompt.trim(),
    });

    return new Response(JSON.stringify({ enhancedPrompt: result.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Enhance API error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
