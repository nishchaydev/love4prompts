import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';
import { buildGenerateSystemPrompt, buildExecutionSystemPrompt } from '../../../lib/promptSkills';

const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;
const USE_CASES = ['Image Generation', 'Text', 'Code', 'Marketing', 'Study'] as const;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { description, targetTool, useCase } = body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Description is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (description.length > 10000) {
      return new Response(JSON.stringify({ error: 'Description exceeds 10,000 character limit.' }), {
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

    if (!useCase || !USE_CASES.includes(useCase)) {
      return new Response(JSON.stringify({ error: `Invalid use case. Must be one of: ${USE_CASES.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build the professional system prompt using COSTAR + CoT + Few-Shot framework
    const systemPrompt = buildGenerateSystemPrompt(
      targetTool as any,
      useCase as any
    );

    const firstResult = await callGroq({
      systemPrompt,
      userMessage: description.trim(),
    });

    let isDirectChat = false;
    let generatedPrompt = '';
    let directResponse = '';

    try {
      let cleaned = firstResult.content.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.substring(7);
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);
      isDirectChat = typeof parsed.isDirectChat === 'boolean' ? parsed.isDirectChat : false;
      generatedPrompt = parsed.output || '';
    } catch (e) {
      console.warn('JSON parse failed in generate.ts, using fallback:', e);
      isDirectChat = false;
      generatedPrompt = firstResult.content;
    }

    const isImageGen = useCase === 'Image Generation';

    // Second LLM call: If it's prompt engineering (not direct chat) AND not an image generator prompt, execute it
    if (!isDirectChat && !isImageGen && generatedPrompt.trim().length > 0) {
      const executionSystemPrompt = buildExecutionSystemPrompt(targetTool as any);
      
      const secondResult = await callGroq({
        systemPrompt: executionSystemPrompt,
        userMessage: generatedPrompt,
      });
      directResponse = secondResult.content;
    } else {
      // For direct chat or image gen, the prompt itself is the final response
      directResponse = generatedPrompt;
    }

    return new Response(JSON.stringify({
      generatedPrompt,
      directResponse,
      isDirectChat
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Generate API error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

