import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux', 'Stable Diffusion'] as const;

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

    const systemPrompt = `You are a prompt translation expert. The user will give you a prompt written for ${fromTool}. Rewrite and reformat it so it works optimally for ${toTool}. Adapt the syntax, modifiers, parameters, and structure to match ${toTool}'s expected format and best practices.

You MUST respond with valid JSON in this exact format:
{
  "translatedPrompt": "the fully translated prompt text",
  "adaptations": [
    "Brief explanation of adaptation 1",
    "Brief explanation of adaptation 2",
    "Brief explanation of adaptation 3"
  ]
}

The "adaptations" array should contain 3-5 short bullet points explaining the key changes you made during translation (e.g., "Converted Midjourney aspect ratio flags to DALL-E sizing parameters", "Restructured from comma-separated tags to natural language sentences for Claude").

Return ONLY valid JSON. No markdown, no explanation outside the JSON.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: prompt.trim(),
      responseFormat: { type: 'json_object' },
    });

    let translatedPrompt = '';
    let adaptations: string[] = [];

    try {
      const parsed = JSON.parse(result.content);
      translatedPrompt = parsed.translatedPrompt || '';
      adaptations = Array.isArray(parsed.adaptations) ? parsed.adaptations : [];
    } catch {
      translatedPrompt = result.content;
      adaptations = [];
    }

    return new Response(JSON.stringify({ translatedPrompt, adaptations }), {
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
