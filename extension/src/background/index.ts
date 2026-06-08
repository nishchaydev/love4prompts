// Background script for Love4Prompts Extension

interface BackgroundMessage {
  action: string;
  text: string;
  mode: string;
  url?: string;
  chatContext?: string;
  pageContext?: string;
  tone?: number;
  length?: number;
  memory?: string;
  deepThink?: boolean;
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request: BackgroundMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (request.action === 'ENHANCE_PROMPT') {
    handleEnhancePrompt(request.text, request.mode, request.url, request.chatContext, request.pageContext, request.tone, request.length, request.memory, request.deepThink)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }));
    
    // Return true to indicate we wish to send a response asynchronously
    return true;
  }
});

async function handleEnhancePrompt(text: string, mode: string, url?: string, chatContext?: string, pageContext?: string, tone?: number, length?: number, memory?: string, deepThink?: boolean) {
  // Use our deployed/local Love4Prompts backend
  // For local development, change this to http://localhost:4321
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4321/api/tools/enhance';
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: text,
        modes: mode === 'Auto' ? ['Auto'] : [mode],
        url: url,
        chatContext: chatContext,
        pageContext: pageContext,
        tone: tone,
        length: length,
        memory: memory,
        deepThink: deepThink
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('API request timed out after 15s');
      throw new Error('Enhancement request timed out. Please try again.');
    }
    console.error('Failed to enhance prompt:', error);
    throw error;
  }
}

// Setup context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'reverse_prompt',
    title: 'Reverse Engineer Prompt',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'reverse_prompt' && info.selectionText && tab?.id) {
    // We send a message to the content script of that tab to handle the UI display
    chrome.tabs.sendMessage(tab.id, {
      action: 'REVERSE_PROMPT',
      text: info.selectionText
    });
  }
});
