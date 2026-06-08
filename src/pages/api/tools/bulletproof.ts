import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { enhancedPrompt, targetModel, answers } = body;

    if (!enhancedPrompt || typeof enhancedPrompt !== 'string' || enhancedPrompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'enhancedPrompt is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const modelName = targetModel || 'ChatGPT';

    // MODE 2 — Merge answers into final prompt
    if (answers && Array.isArray(answers)) {
      const answersText = answers
        .map((a: any) => (a && a.question && a.answer) ? `Question: ${a.question}\nAnswer: ${a.answer}` : undefined)
        .filter(Boolean)
        .join('\n\n');

      const systemPrompt = `You are a prompt completion expert. Take the enhanced prompt and the user's answers to anticipated follow-up questions, and merge them into one single comprehensive prompt that needs no follow-up. The final prompt should be natural, complete, and ready to paste directly into an AI model. Return ONLY the final prompt text, no explanation. Do not wrap the response in code blocks, just return plain text.`;

      const userMessage = `Enhanced Prompt:
"""
${enhancedPrompt.trim()}
"""

User Q&A:
${answersText}

Target AI Model: ${modelName}`;

      const result = await callGroq({
        systemPrompt,
        userMessage,
      });

      if (!result.content || typeof result.content !== 'string' || result.content.trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Model returned an empty response. Please try again.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ mergedPrompt: result.content.trim() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // MODE 1 — Generate anticipated questions
    const systemPrompt = `You are a prompt quality analyzer. Given an enhanced AI prompt, identify the 3 most likely follow-up questions the AI model would ask the user, and provide a smart default answer for each.
Return ONLY valid JSON in this exact format, with no markdown code block formatting, no extra whitespace, and no introductory or concluding text:
{
  "questions": [
    { "id": 1, "question": "question string", "defaultAnswer": "smart default answer string" },
    { "id": 2, "question": "question string", "defaultAnswer": "smart default answer string" },
    { "id": 3, "question": "question string", "defaultAnswer": "smart default answer string" }
  ]
}`;

    const userMessage = `Enhanced Prompt:
"""
${enhancedPrompt.trim()}
"""

Target AI Model: ${modelName}`;

    const result = await callGroq({
      systemPrompt,
      userMessage,
      responseFormat: { type: 'json_object' },
    });

    let content = result.content.trim();
    
    // Clean up potential markdown code block packaging if present
    if (content.startsWith('```')) {
      content = content.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(content);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid JSON structure returned by the model.');
      }
      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (parseErr) {
      console.error('Failed to parse Groq response as JSON:', content);
      return new Response(JSON.stringify({ error: 'Failed to generate questions. Model returned invalid JSON. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (err: unknown) {
    console.error('Bulletproof API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
