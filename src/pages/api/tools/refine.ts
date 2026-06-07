import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';
import { AI_TOOLS } from '../../../lib/constants';
import { buildRefineSystemPrompt } from '../../../lib/promptSkills';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { currentPrompt, instruction, targetTool } = body;

    if (!currentPrompt || typeof currentPrompt !== 'string' || currentPrompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Current prompt is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!instruction || typeof instruction !== 'string' || instruction.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Instruction is required.' }), {
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

    const systemPrompt = buildRefineSystemPrompt(
      targetTool as any,
      currentPrompt.trim(),
      instruction.trim()
    );

    const result = await callGroq({
      systemPrompt,
      userMessage: "Refine the prompt based on the instruction.",
    });

    if (!result.content || typeof result.content !== 'string' || result.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Model returned an empty response. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ refinedPrompt: result.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('Refine API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
