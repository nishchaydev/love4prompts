import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.json();
    
    // Validate and sanitize body
    if (
      typeof rawBody !== 'object' ||
      rawBody === null ||
      typeof rawBody.prompt !== 'string' ||
      rawBody.prompt.trim() === '' ||
      typeof rawBody.model !== 'string' ||
      rawBody.model.trim() === '' ||
      typeof rawBody.intent !== 'string' ||
      rawBody.intent.trim() === ''
    ) {
      return new Response(JSON.stringify({ success: false, error: 'Validation failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitizedBody = {
      prompt: rawBody.prompt,
      model: rawBody.model,
      intent: rawBody.intent,
    };

    const webhookUrl = import.meta.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('Google Sheet Webhook URL is missing');
      return new Response(JSON.stringify({ success: false, message: 'Webhook URL not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response;
    try {
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedBody),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
         return new Response(JSON.stringify({ success: false, error: 'Request to webhook timed out' }), {
           status: 504,
           headers: { 'Content-Type': 'application/json' },
         });
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(`Google Sheet Webhook returned status ${response.status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving prompt to Google Sheet:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to save prompt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
