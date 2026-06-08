import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { prompt, targetTool, modes } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (prompt.length > 2000) {
      return new Response(JSON.stringify({ error: 'Prompt exceeds 2,000 character limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const modelName = targetTool || 'ChatGPT';
    const selectedModes = Array.isArray(modes) ? modes : [];

    const systemPrompt = `You are Love4Prompts' Enhancement Engine — a specialist in upgrading existing prompts to professional quality.

Your task is to take the user's existing prompt and transform it into an elite-tier version optimized for ${modelName}.

You must optimize the prompt specifically for ${modelName} and apply the following enhancement strategies:
${selectedModes.length > 0 ? selectedModes.map((m: string) => `- ${m}`).join('\n') : '- General prompt enhancement, structure, and detail expansion'}

Rules for the enhanced prompt:
- Expand details and specificity
- Set a clear role/persona
- Specify output format and constraints
- Do not add meta-commentary inside the enhanced prompt

You must respond with a JSON object containing two fields:
1. "enhancedPrompt": The fully enhanced, ready-to-paste prompt string.
2. "improvements": An array of 3-5 short, punchy bullet point strings (each starting with a verb, e.g., "Added a clear persona...", "Structured with markdown headers...") explaining what was improved and why.

Return ONLY the raw JSON object. Do not include markdown code block wrappers (\`\`\`json ... \`\`\`), no text before or after the JSON.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: `Enhance the following prompt:\n\n${prompt.trim()}`,
      responseFormat: { type: 'json_object' }
    });

    if (!result.content || typeof result.content !== 'string' || result.content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Model returned an empty response. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const parsed = JSON.parse(result.content);
      if (!parsed.enhancedPrompt) {
        throw new Error("Missing enhancedPrompt field in LLM response");
      }
      return new Response(JSON.stringify({
        enhancedPrompt: parsed.enhancedPrompt,
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['Improved prompt clarity and structure.']
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (parseErr) {
      console.error('Failed to parse Groq JSON output:', result.content, parseErr);
      return new Response(JSON.stringify({
        enhancedPrompt: result.content,
        improvements: ['Enhanced prompt clarity and structure.']
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err: unknown) {
    console.error('Enhance API error:', err);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
