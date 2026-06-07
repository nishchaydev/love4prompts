import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const webhookUrl = import.meta.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('Google Sheet Webhook URL is missing');
      return new Response(JSON.stringify({ success: false, message: 'Webhook URL not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fire and forget, or await to confirm
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

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
