import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt, fromTool, toTool } = body;

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

    if (!fromTool || !AI_TOOLS.includes(fromTool)) {
      return new Response(JSON.stringify({ error: `Invalid "from" tool. Must be one of: ${AI_TOOLS.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!toTool || !AI_TOOLS.includes(toTool)) {
      return new Response(JSON.stringify({ error: `Invalid "to" tool. Must be one of: ${AI_TOOLS.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a prompt translation expert. The user will give you a prompt written for ${fromTool}. Rewrite and reformat it so it works optimally for ${toTool}. Adapt the syntax, modifiers, parameters, and structure to match ${toTool}'s expected format and best practices. Return only the translated prompt, no explanation, no preamble.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: prompt.trim(),
    });

    return new Response(JSON.stringify({ translatedPrompt: result.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Translate API error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
