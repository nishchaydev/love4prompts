import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight, Copy, Check, RotateCcw, X,
  Wand2, Image, ArrowRightLeft, Code2, Megaphone, Sparkles,
  ChevronDown, Clock, Command, Zap, Bot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── BRAND LOGO PATHS (ChatGPT/OpenAI, Midjourney, Claude, DALL-E, Gemini) ───
const OpenAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 320 320" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z" />
  </svg>
);

const MidjourneyLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L12 18V20zm0-7.24L7.8 7.8A5.92 5.92 0 0 1 12 6c1.62 0 3.1.64 4.2 1.8L12 12.76zM18 14c0 3.31-2.69 6-6 6v-2l5.3-6.8c.45.83.7 1.79.7 2.8z" />
  </svg>
);

const ClaudeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
  </svg>
);

const DalleLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 85 24" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="M8.147 2c1.438 0 2.75.225 3.937.676 1.186.45 2.21 1.099 3.074 1.946a8.625 8.625 0 011.927 3.094c.44 1.198.66 2.527.66 3.987s-.22 2.788-.66 3.986a8.625 8.625 0 01-1.927 3.095 8.778 8.778 0 01-3.074 1.946c-1.187.45-2.499.675-3.937.675H2V2h6.147zm19.898 0l7.469 19.405h-2.615l-1.969-5.108H22.25l-1.942 5.108H17.72L25.187 2h2.858zM8.12 4.243H4.534v14.92h3.613c2.175 0 3.896-.672 5.164-2.014 1.267-1.343 1.9-3.158 1.9-5.446 0-2.289-.633-4.104-1.9-5.446-1.268-1.343-2.998-2.014-5.19-2.014zm18.442.676l-3.45 9.108h6.956l-3.506-9.108zm23.215 16.486H37.536V2h2.588v17.135h9.653v2.27M54.414 2v17.135h9.653v2.27H51.826V2h2.588zm12.619 9.946v3.19h-3.074v-3.19h3.074zm2.965 9.46V2h12.646v2.27H72.56v5.973h8.547v2.27H72.56v6.622h10.084v2.27H69.998z" />
  </svg>
);

const GeminiLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10-0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z" />
  </svg>
);

// ─── AI Model targets ────────────────────────────────────────────────
const AI_MODELS = [
  { id: 'ChatGPT', label: 'ChatGPT', icon: OpenAILogo },
  { id: 'Midjourney', label: 'Midjourney', icon: MidjourneyLogo },
  { id: 'DALL-E', label: 'DALL·E', icon: DalleLogo },
  { id: 'Claude', label: 'Claude', icon: ClaudeLogo },
  { id: 'Gemini', label: 'Gemini', icon: GeminiLogo },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__ilp_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch { return false; }
}

// ─── Types ───────────────────────────────────────────────────────────
interface Intent {
  mode: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  apiEndpoint: string;
  buildPayload: (input: string, model: string) => Record<string, unknown>;
  extractResult: (data: unknown) => string;
}

// ─── Placeholder strings ─────────────────────────────────────────────
const PLACEHOLDERS = [
  'A cinematic portrait of a samurai in rain...',
  'Enhance my ChatGPT prompt for better results...',
  'Plan my Instagram content for next week...',
  'Convert this Midjourney prompt to DALL-E...',
  'Write a system prompt for a coding assistant...',
  'Generate a product description for my store...',
];

// ─── Quick action chips ──────────────────────────────────────────────
const QUICK_ACTIONS = [
  { icon: Image, label: 'Image Prompt', starter: 'Generate an image of ' },
  { icon: Wand2, label: 'Enhance', starter: 'Enhance this prompt: ' },
  { icon: Megaphone, label: 'LinkedIn Post', starter: 'Write a LinkedIn post about ' },
  { icon: ArrowRightLeft, label: 'Translate', starter: 'Convert this Midjourney prompt to DALL-E: ' },
  { icon: Code2, label: 'System Prompt', starter: 'Build a system prompt for an AI assistant that ' },
  { icon: Sparkles, label: 'Library', starter: '__LIBRARY__' },
];

// ─── Intent map (replaces old regex detectIntent) ───────────────────
const INTENT_MAP: Record<string, Intent> = {
  ENHANCE: {
    mode: 'enhance', label: 'Enhancer', icon: Wand2, color: '#713DFF',
    apiEndpoint: '/api/tools/enhance',
    buildPayload: (input, mdl) => ({ prompt: input, targetTool: mdl }),
    extractResult: (d) => isRecord(d) && typeof d.enhancedPrompt === 'string' ? d.enhancedPrompt : '',
  },
  TRANSLATE: {
    mode: 'translate', label: 'Translator', icon: ArrowRightLeft, color: '#ff9f43',
    apiEndpoint: '/api/tools/translate',
    buildPayload: (input, mdl) => ({ prompt: input, fromTool: 'Midjourney', toTool: mdl }),
    extractResult: (d) => isRecord(d) && typeof d.translatedPrompt === 'string' ? d.translatedPrompt : '',
  },
  IMAGE: {
    mode: 'image', label: 'Image Gen', icon: Image, color: '#ea2261',
    apiEndpoint: '/api/tools/generate',
    buildPayload: (input, mdl) => ({ description: input, targetTool: mdl, useCase: 'Image Generation' }),
    extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
  },
  SOCIAL: {
    mode: 'social', label: 'Social', icon: Megaphone, color: '#0a66c2',
    apiEndpoint: '/api/tools/generate',
    buildPayload: (input, mdl) => ({ description: input, targetTool: mdl, useCase: 'Marketing' }),
    extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
  },
  CODE: {
    mode: 'code', label: 'Code Prompt', icon: Code2, color: '#10b981',
    apiEndpoint: '/api/tools/generate',
    buildPayload: (input, mdl) => ({ description: input, targetTool: mdl, useCase: 'Code' }),
    extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
  },
  EXECUTE: {
    mode: 'execute', label: 'Execute', icon: Zap, color: '#ff9f43',
    apiEndpoint: '/api/tools/execute',
    buildPayload: (input, mdl) => ({ prompt: input, targetTool: mdl }),
    extractResult: (d) => isRecord(d) && typeof d.output === 'string' ? d.output : '',
  },
  GENERATE: {
    mode: 'generate', label: 'Generate', icon: Sparkles, color: '#713DFF',
    apiEndpoint: '/api/tools/generate',
    buildPayload: (input, mdl) => ({ description: input, targetTool: mdl, useCase: 'Text' }),
    extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
  },
};

// ─── Refinement placeholders (intent-aware) ─────────────────────────
const REFINEMENT_PLACEHOLDERS: Record<string, string> = {
  enhance: 'Make it shorter, more formal, add examples...',
  translate: 'Try a different target tool...',
  image: 'More cinematic, different lighting, change style...',
  social: 'Make it shorter, more engaging, add hashtags...',
  generate: 'Adjust tone, add constraints, change format...',
  execute: 'Ask a follow-up question...',
  code: 'Change language, add error handling, explain step...',
};

// ─── History persistence ─────────────────────────────────────────────
const HISTORY_KEY = 'ilp_bar_history';
const MAX_HISTORY = 5;

function getHistory(): string[] {
  if (!isLocalStorageAvailable()) return [];
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}
function pushHistory(q: string) {
  if (!isLocalStorageAvailable()) return;
  try {
    const h = getHistory().filter(i => i !== q);
    h.unshift(q);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)));
  } catch { /* storage full or restricted — silently degrade */ }
}

// ─── Component ───────────────────────────────────────────────────────
export const UniversalBar: React.FC = () => {
  const [input, setInput] = useState('');
  const [intent, setIntent] = useState<Intent>(INTENT_MAP['GENERATE']);
  const [isClassifying, setIsClassifying] = useState(false);
  const classifyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Model selector
  const [selectedModel, setSelectedModel] = useState('ChatGPT');
  const [modelOpen, setModelOpen] = useState(false);
  const modelRef = useRef<HTMLDivElement>(null);

  // History dropdown
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setLocalHistory] = useState<string[]>([]);

  // Result state
  const [isLoading, setIsLoading] = useState(false);
  const [resultPrompt, setResultPrompt] = useState('');
  const [resultOutput, setResultOutput] = useState('');
  const [isDirectChat, setIsDirectChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'output'>('prompt');
  const [editedPrompt, setEditedPrompt] = useState('');
  const [resultIntent, setResultIntent] = useState<Intent | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Refinement state
  const [refinementInput, setRefinementInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Basic handler
  }, []);

  // Helper to construct alpha colors
  const getHexWithOpacity = (hex: string, opacity: number): string => {
    const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${cleanHex}${alpha}`;
  };

  // Load history on mount
  useEffect(() => { setLocalHistory(getHistory()); }, []);

  // ── Cmd+K global shortcut ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Close dropdowns on outside click ─────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setModelOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Placeholder cycling ──────────────────────────────────────────
  useEffect(() => {
    if (isLoading || resultPrompt || isFocused) return;
    const timer = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIdx(p => (p + 1) % PLACEHOLDERS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(timer);
  }, [isLoading, resultPrompt, isFocused]);

  // ── Async intent classifier (replaces old regex) ─────────────────
  const classifyIntent = useCallback(async (text: string, model: string): Promise<Intent> => {
    const t = text.toLowerCase();

    // Fast client-side shortcuts before hitting the API
    if (/from\s+\w+\s+to\s+\w+|midjourney to|dalle to|convert.*prompt/i.test(t)) {
      return INTENT_MAP['TRANSLATE'];
    }
    if (/linkedin|instagram|caption|tweet|twitter|facebook|social media/i.test(t)) {
      return INTENT_MAP['SOCIAL'];
    }
    if (['Midjourney', 'DALL-E', 'Flux'].includes(model) && text.length < 200) {
      return INTENT_MAP['IMAGE'];
    }

    // Call the classifier for everything else
    try {
      const res = await fetch('/api/tools/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text, model, charCount: text.length }),
      });
      const data = await res.json();
      return INTENT_MAP[data.intent as keyof typeof INTENT_MAP] ?? INTENT_MAP['GENERATE'];
    } catch {
      return INTENT_MAP['GENERATE'];
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    if (classifyTimeoutRef.current) clearTimeout(classifyTimeoutRef.current);

    if (val.trim().length < 3) {
      setIntent(INTENT_MAP['GENERATE']);
      return;
    }

    classifyTimeoutRef.current = setTimeout(async () => {
      setIsClassifying(true);
      const classified = await classifyIntent(val.trim(), selectedModel);
      setIntent(classified);
      setIsClassifying(false);
    }, 400);
  }, [classifyIntent, selectedModel]);

  // ── Execute inline ───────────────────────────────────────────────
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setResultPrompt('');
    setResultOutput('');
    setEditedPrompt('');
    setRefinementInput('');
    setIsDirectChat(false);
    setResultIntent(intent);
    pushHistory(input.trim());
    setLocalHistory(getHistory());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);
    try {
      // Background save to Google Sheets webhook
      fetch('/api/save-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input.trim(),
          model: selectedModel,
          intent: intent.label
        })
      }).catch(err => console.error('Failed to save prompt:', err));

      const res = await fetch(intent.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intent.buildPayload(input.trim(), selectedModel)),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      const genPrompt = intent.extractResult(data) || '';
      const dirResponse = (isRecord(data) && typeof data.directResponse === 'string') ? data.directResponse : '';
      const direct = isRecord(data) && !!data.isDirectChat;

      setResultPrompt(genPrompt);
      setResultOutput(dirResponse);
      setEditedPrompt(genPrompt);
      setIsDirectChat(direct);
      setActiveTab(direct ? 'output' : 'prompt');
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out — please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, intent, isLoading, selectedModel]);

  /** Textarea-based clipboard fallback for non-HTTPS / older browsers */
  const fallbackCopy = useCallback((text: string): boolean => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* ignore */ }
    document.body.removeChild(ta);
    return ok;
  }, []);

  const handleRefine = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!refinementInput.trim() || isRefining) return;

    setIsRefining(true);
    setError('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);
    try {
      const currentText = (isDirectChat || activeTab === 'output') ? resultOutput || resultPrompt : editedPrompt;
      const res = await fetch('/api/tools/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPrompt: currentText, instruction: refinementInput.trim(), targetTool: selectedModel }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

      const newText = data.refinedPrompt || '';
      setEditedPrompt(newText);
      if (isDirectChat || activeTab === 'output') {
        setResultOutput(newText);
        setResultPrompt(newText);
      }
      setRefinementInput('');
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      setError(err instanceof Error ? err.message : 'Something went wrong during refinement.');
    } finally {
      setIsRefining(false);
    }
  }, [editedPrompt, resultOutput, resultPrompt, isDirectChat, activeTab, refinementInput, isRefining, selectedModel]);

  const handleReset = useCallback(() => {
    setResultPrompt('');
    setResultOutput('');
    setEditedPrompt('');
    setRefinementInput('');
    setIsDirectChat(false);
    setActiveTab('prompt');
    setError('');
    setResultIntent(null);
    setInput('');
    setIntent(INTENT_MAP['GENERATE']);
    inputRef.current?.focus();
  }, []);

  // ── Custom execution (Option B) ──────────────────────────────────
  const handleExecute = useCallback(() => {
    const prompt = editedPrompt.trim();
    if (!prompt) return;

    // Auto-copy optimized prompt to clipboard
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(prompt).catch(() => {
        fallbackCopy(prompt);
      });
    } else {
      fallbackCopy(prompt);
    }

    // Determine target URL based on selected model
    const encoded = encodeURIComponent(prompt);
    let targetUrl = '';

    switch (selectedModel) {
      case 'Gemini':
        targetUrl = `https://gemini.google.com/app?prompt=${encoded}`;
        break;
      case 'Claude':
        targetUrl = `https://claude.ai/new?q=${encoded}`;
        break;
      case 'DALL-E':
      case 'ChatGPT':
        targetUrl = `https://chatgpt.com/?q=${encoded}`;
        break;
      case 'Midjourney':
        targetUrl = 'https://alpha.midjourney.com/';
        break;
      default:
        targetUrl = `https://chatgpt.com/?q=${encoded}`;
    }

    // Open target AI tool page in a new window/tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    // Reset bar focus and clear/initialize input to type again
    handleReset();
  }, [editedPrompt, selectedModel, handleReset, fallbackCopy]);

  // ── Copy / Reset ─────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    const textToCopy = activeTab === 'prompt' ? editedPrompt : resultOutput;
    const onSuccess = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(() => {
        fallbackCopy(textToCopy) && onSuccess();
      });
    } else {
      fallbackCopy(textToCopy) && onSuccess();
    }
  }, [activeTab, editedPrompt, resultOutput, fallbackCopy]);

  // ── Chip click ───────────────────────────────────────────────────
  const handleChipClick = useCallback((starter: string) => {
    if (starter === '__LIBRARY__') {
      const el = document.getElementById('library') ?? document.querySelector('[data-section="library"]');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setResultPrompt(''); setResultOutput(''); setEditedPrompt(''); setIsDirectChat(false); setError(''); setResultIntent(null);
    setInput(starter);
    // Trigger async classification for the chip starter text
    setIsClassifying(true);
    classifyIntent(starter, selectedModel).then((classified) => {
      setIntent(classified);
      setIsClassifying(false);
    });
    inputRef.current?.focus();
  }, [classifyIntent, selectedModel]);

  // ── History item click ───────────────────────────────────────────
  const handleHistoryClick = useCallback((q: string) => {
    setInput(q);
    setHistoryOpen(false);
    // Trigger async classification for the history item
    setIsClassifying(true);
    classifyIntent(q, selectedModel).then((classified) => {
      setIntent(classified);
      setIsClassifying(false);
    });
    inputRef.current?.focus();
  }, [classifyIntent, selectedModel]);

  const showPill = input.trim().length >= 3;
  const ac = resultIntent?.color ?? intent.color;

  return (
    <div className="w-full max-w-[780px] mx-auto flex flex-col items-center gap-4">
      {/* ── Main bar ───────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="relative w-full z-50">
        {/* Living glow backing */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${ac}40 0%, ${ac}10 60%, transparent 100%)`,
            filter: 'blur(20px)',
          }}
          initial={{ opacity: 0.15, scale: 0.99 }}
          animate={isFocused || showPill || isLoading ? {
            opacity: 0.55,
            scale: 1.02,
          } : {
            opacity: [0.12, 0.24, 0.12],
            scale: [0.99, 1.01, 0.99]
          }}
          transition={{
            opacity: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          }}
        />
        <div
          className="relative flex items-center w-full h-[56px] md:h-[64px] rounded-2xl px-3 md:px-4"
          style={{
            background: 'rgba(18, 10, 36, 0.75)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: `1px solid ${isFocused || showPill || isLoading ? getHexWithOpacity(ac, 0.35) : getHexWithOpacity(ac, 0.15)}`,
            boxShadow: isFocused || showPill || isLoading
              ? `0 0 20px ${getHexWithOpacity(ac, 0.15)}, inset 0 0 12px ${getHexWithOpacity(ac, 0.05)}`
              : `0 8px 32px rgba(0,0,0,0.6), 0 0 15px ${getHexWithOpacity(ac, 0.08)}`,
            transition: 'border-color 100ms ease-out, box-shadow 100ms ease-out',
          }}
        >
          {/* Model selector */}
          <div ref={modelRef} className="relative flex-shrink-0 mr-2">
            <button
              type="button"
              title="Choose your target AI tool"
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-semibold text-white/60 hover:text-white/90 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
            >
              {(() => {
                const ModelIcon = AI_MODELS.find(m => m.id === selectedModel)?.icon || Bot;
                return <ModelIcon className="w-3.5 h-3.5 text-white/40" />;
              })()}
              <span className="hidden sm:inline">{AI_MODELS.find(m => m.id === selectedModel)?.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {modelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-44 bg-[#120A24] border border-white/[0.04] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden py-1.5 z-50"
                >
                  {AI_MODELS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => { setSelectedModel(m.id); setModelOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors ${selectedModel === m.id
                        ? 'text-white bg-[var(--color-primary)]/15'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                        }`}
                    >
                      {(() => {
                        const ModelIcon = m.icon;
                        return <ModelIcon className="w-3.5 h-3.5 text-white/30" />;
                      })()}
                      {m.label}
                      {selectedModel === m.id && <Check className="w-3.5 h-3.5 ml-auto text-[var(--color-primary)]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* "for" label (desktop) + Divider */}
          <span className="hidden lg:inline text-[10px] font-mono text-white/20 uppercase tracking-wider mr-1 whitespace-nowrap">for</span>
          <div className="w-px h-6 bg-white/[0.08] mr-3 flex-shrink-0" />

          {/* Input */}
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => { setIsFocused(true); if (history.length > 0 && !input) setHistoryOpen(true); }}
              onBlur={() => { setIsFocused(false); setTimeout(() => setHistoryOpen(false), 200); }}
              disabled={isLoading}
              className="w-full bg-transparent text-white text-[14px] md:text-[15px] font-medium outline-none placeholder:text-transparent disabled:opacity-50 relative z-10"
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Universal prompt bar"
              id="universal-bar-input"
            />
            {/* Animated placeholder */}
            {!input && !isLoading && (
              <div className="absolute inset-0 flex items-center pointer-events-none z-0" style={{ opacity: placeholderVisible ? 0.85 : 0, transition: 'opacity 300ms' }}>
                <span className="text-[14px] md:text-[15px] font-medium text-white/70 truncate">{PLACEHOLDERS[placeholderIdx]}</span>
              </div>
            )}
            {/* Ghost text removed */}

            {/* History dropdown */}
            <AnimatePresence>
              {historyOpen && history.length > 0 && !input && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-[#120A24] border border-white/[0.04] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden py-1.5 z-50"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-white/30 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> Recent
                  </div>
                  {history.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleHistoryClick(q); }}
                      className="w-full text-left px-3 py-2 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors truncate"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right section: intent pill + kbd hint + submit */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-2 relative z-10">
            {/* Score Pill removed */}

            {/* Intent pill */}
            {showPill && !isLoading && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap"
                style={{
                  backgroundColor: `${intent.color}15`,
                  color: isClassifying ? 'rgba(255,255,255,0.3)' : intent.color,
                  border: `1px solid ${intent.color}30`,
                  transition: 'color 200ms ease',
                }}
              >
                {isClassifying
                  ? <span className="w-3 h-3 rounded-full border border-white/20 border-t-white/60 animate-spin" />
                  : <intent.icon className="w-3 h-3" />
                }
                {isClassifying ? 'Routing...' : intent.label}
              </motion.span>
            )}

            {/* Cmd+K hint */}
            {!input && !isLoading && (
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold text-white/20 bg-white/[0.04] border border-white/[0.06]">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center gap-2 mr-1">
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${ac} transparent ${ac} ${ac}` }} />
                <span className="hidden sm:inline text-[11px] font-semibold text-white/40">Thinking...</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:cursor-default"
              style={{
                background: `linear-gradient(135deg, ${ac}, ${ac}cc)`,
                boxShadow: input.trim() ? `0 0 20px ${ac}30` : 'none',
              }}
              aria-label="Execute"
            >
              {isLoading ? <Zap className="w-4 h-4 animate-pulse" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </form>

      {/* ── Result Panel ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {(resultPrompt || error) && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <div
              className="relative w-full rounded-2xl p-5"
              style={{
                background: 'rgba(18, 10, 36, 0.85)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.15)' : `${ac}15`}`,
                boxShadow: `0 16px 48px ${error ? 'rgba(239,68,68,0.05)' : `${ac}04`}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {resultIntent && !error && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ backgroundColor: `${resultIntent.color}15`, color: resultIntent.color, border: `1px solid ${resultIntent.color}25` }}>
                      <resultIntent.icon className="w-3 h-3" />
                      {resultIntent.label} · {selectedModel}
                    </span>
                  )}
                  {error && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">Error</span>
                  )}
                  {!error && (activeTab === 'prompt' ? editedPrompt : resultOutput) && (
                    <span className="text-[10px] text-white/20 font-medium">
                      {activeTab === 'prompt'
                        ? `${editedPrompt.match(/\S+/g)?.length || 0} words · ${editedPrompt.length} chars`
                        : `${resultOutput.match(/\S+/g)?.length || 0} words · ${resultOutput.length} chars`
                      }
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {!error && (activeTab === 'prompt' ? editedPrompt : resultOutput) && (
                    <button onClick={handleCopy} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] border border-white/[0.06] text-white/50 hover:bg-white/[0.08] hover:text-white transition-all">
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                  <button onClick={handleReset} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] border border-white/[0.06] text-white/50 hover:bg-white/[0.08] hover:text-white transition-all">
                    <RotateCcw className="w-3 h-3" /> New
                  </button>
                </div>
              </div>

              {/* Tabs (Option A & C) */}
              {!error && !isDirectChat && resultOutput && (
                <div className="flex border-b border-white/[0.08] mb-4 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('prompt')}
                    className={`pb-2 text-[12px] md:text-[13px] font-semibold transition-all border-b-2 ${activeTab === 'prompt'
                        ? 'text-white border-[var(--color-primary)]'
                        : 'text-white/40 hover:text-white/70 border-transparent'
                      }`}
                  >
                    ✨ The Prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('output')}
                    className={`pb-2 text-[12px] md:text-[13px] font-semibold transition-all border-b-2 ${activeTab === 'output'
                        ? 'text-white border-[var(--color-primary)]'
                        : 'text-white/40 hover:text-white/70 border-transparent'
                      }`}
                  >
                    ⚡ What It Generates
                  </button>
                </div>
              )}

              {/* Body */}
              {error ? (
                <p className="text-red-400/80 text-[13px] leading-relaxed">{error}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeTab === 'prompt' && !isDirectChat ? (
                    <textarea
                      value={editedPrompt}
                      onChange={(e) => setEditedPrompt(e.target.value)}
                      className="w-full min-h-[140px] max-h-[350px] bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-white/90 text-[13px] md:text-[14px] leading-[1.6] outline-none focus:border-white/[0.12] transition-all scrollbar-hide resize-y font-medium"
                      placeholder="Edit your prompt here..."
                    />
                  ) : (
                    <pre className="text-white/85 text-[13px] md:text-[14px] leading-[1.8] font-[inherit] whitespace-pre-wrap break-words max-h-[350px] overflow-y-auto scrollbar-hide pr-4">
                      {resultOutput || resultPrompt}
                    </pre>
                  )}

                  {/* Refinement Chat Input - Talk More */}
                  <form onSubmit={handleRefine} className="relative flex items-center w-full mt-1">
                    <input
                      type="text"
                      value={refinementInput}
                      onChange={(e) => setRefinementInput(e.target.value)}
                      placeholder={REFINEMENT_PLACEHOLDERS[resultIntent?.mode ?? 'generate'] || 'Talk to AI to refine this result...'}
                      disabled={isRefining}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-3 pr-10 py-2.5 text-white/90 text-[13px] outline-none focus:border-white/[0.15] focus:bg-white/[0.05] transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!refinementInput.trim() || isRefining}
                      className="absolute right-2 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.1] disabled:opacity-30 transition-all"
                      aria-label="Refine Prompt"
                    >
                      {isRefining ? <Zap className="w-4 h-4 animate-pulse text-[var(--color-primary)]" /> : <Sparkles className="w-4 h-4" />}
                    </button>
                  </form>

                  {resultIntent?.mode !== 'image' && activeTab === 'prompt' && !isDirectChat && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleExecute}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold text-white hover:scale-105 active:scale-95 transition-all"
                        style={{
                          background: `linear-gradient(135deg, ${ac}, ${ac}cc)`,
                        }}
                      >
                        <Zap className="w-3.5 h-3.5" /> Run Prompt
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quick actions (visible always, filtered during result) ──── */}
      {!isLoading && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide w-full pb-1 px-1">
          {(resultPrompt
            ? QUICK_ACTIONS.filter(a => a.starter !== '__LIBRARY__')
            : QUICK_ACTIONS
          ).map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={() => handleChipClick(a.starter)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-white/40 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:text-white/70 hover:border-white/[0.1] transition-all duration-200 whitespace-nowrap"
              >
                <Icon className="w-3 h-3" />
                {a.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};