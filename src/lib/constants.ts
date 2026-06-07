export const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;

export const INTENT_LABELS = ['ENHANCE', 'GENERATE', 'TRANSLATE', 'IMAGE', 'SOCIAL', 'EXECUTE', 'CODE'] as const;
export type IntentLabel = typeof INTENT_LABELS[number];

// Models that should bias toward image intent
export const IMAGE_MODELS = ['Midjourney', 'DALL-E', 'Flux'] as const;

// Social media keywords for client-side pre-filter (optional fast-path)
export const SOCIAL_KEYWORDS = ['linkedin', 'instagram', 'caption', 'tweet', 'twitter', 'facebook', 'reel', 'social'];
