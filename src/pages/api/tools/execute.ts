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

    if (prompt.length > 15000) {
      return new Response(JSON.stringify({ error: 'Prompt exceeds 15,000 character limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tool = (typeof targetTool === 'string' && (AI_TOOLS as readonly string[]).includes(targetTool))
      ? targetTool
      : 'ChatGPT';

    const systemPrompt = `You are a helpful and intelligent AI assistant. Execute the user's prompt optimized for the target tool: ${tool}. Provide only the direct final answer, output, or content requested. Do not include any meta-commentary, introductory phrases (like "Sure, here is the..."), or conversational preambles unless specifically requested by the prompt. Just output the content.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: prompt.trim(),
    });

    return new Response(JSON.stringify({ output: result.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('Execute API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
