import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight, Copy, Check, RotateCcw, X,
  Wand2, Image, ArrowRightLeft, Code2, Megaphone, Sparkles,
  ChevronDown, Clock, Command, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── BRAND LOGO PATHS (ChatGPT/OpenAI, Midjourney, Claude, Flux, DALL-E, Gemini) ───
const OpenAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="M21.729 9.176c.123-.807-.052-1.637-.495-2.337a4.26 4.26 0 00-2.029-1.631c-.13-.396-.347-.753-.637-1.049a2.766 2.766 0 00-3.328-.316c-.579-.472-1.307-.732-2.06-.736a3.197 3.197 0 00-2.73 1.51c-.694-.287-1.468-.285-2.161.004a3.194 3.194 0 00-2.001 2.213 2.756 2.756 0 00-1.745.892c-.822.846-1.066 2.103-.615 3.19a3.21 3.21 0 00-.73 2.063c.004.887.368 1.733 1.011 2.348a2.768 2.768 0 00.316 3.328 2.768 2.768 0 003.328.316c.582.476 1.312.739 2.069.742a3.197 3.197 0 002.73-1.51c.691.285 1.463.283 2.152-.005a3.197 3.197 0 002.002-2.212c.621.13 1.258.013 1.802-.332a2.766 2.766 0 001.077-3.155 3.208 3.208 0 00.73-2.063c-.004-.888-.369-1.734-1.012-2.35zm-9.729 9.387c-.779 0-1.468-.387-1.89-1.026l3.359-1.938v-2.09l-3.359 1.938c-.378-.22-.684-.543-.888-.93a2.637 2.637 0 01-.252-1.926l3.359-1.94 1.81 1.045v2.09l-1.81-1.045a1.218 1.218 0 00-1.214.001l-1.545.892c.328.536.911.854 1.545.845h.005l3.359-1.939v2.091l-3.359 1.938c.633.009 1.217-.308 1.545-.845l1.81-1.045v2.09c0 .779-.387 1.468-1.026 1.89zm-1.89-7.306l-1.81-1.045c.422-.64 1.111-1.026 1.89-1.026.779 0 1.468.387 1.89 1.026l-3.359 1.938zm-4.385-1.026c0-.779.387-1.468 1.026-1.89.421.639 1.11 1.026 1.89 1.026.779 0 1.468-.387 1.89-1.026l-3.359 1.938v2.09L5.725 10.231zm2.348 6.556c-.633-.009-1.217.309-1.545.846L4.718 16.581c-.422-.64-.616-1.403-.548-2.164a2.64 2.64 0 011.027-1.74l3.359-1.938 1.81 1.045v2.09l-1.81-1.045a1.218 1.218 0 00-1.214-.001zm6.98 2.051l-1.81-1.045 1.81-1.045a1.218 1.218 0 001.214.001l1.545-.892c-.328-.536-.911-.854-1.545-.845h-.005l-3.359 1.939v-2.091l3.359-1.938c-.633-.009-1.217.308-1.545.845l-1.81 1.045v-2.09c0-.779.387-1.468 1.026-1.89.422.64 1.111 1.026 1.89 1.026.779 0 1.468-.387 1.89-1.026l-3.359 1.938v2.09z" />
  </svg>
);

const MidjourneyLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L12 18V20zm0-7.24L7.8 7.8A5.92 5.92 0 0 1 12 6c1.62 0 3.1.64 4.2 1.8L12 12.76zM18 14c0 3.31-2.69 6-6 6v-2l5.3-6.8c.45.83.7 1.79.7 2.8z" />
  </svg>
);

const ClaudeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="M19.1 5.9c-.3-.8-.9-1.4-1.7-1.7-1.1-.5-2.4-.2-3.1.6L8.8 10.3c-.6.6-1.4.9-2.2.9h-.8c-1.3 0-2.4-1.1-2.4-2.4s1.1-2.4 2.4-2.4c1 0 1.9-.6 2.2-1.6s-.1-2-1-2.6c-1.1-.7-2.6-.5-3.5.4C1.9 4.3 1.2 6.1 1.2 8c0 3.7 3 6.8 6.8 6.8h.4c.5 0 .9.2 1.3.5l5.5 5.5c.6.6 1.4.9 2.2.9.8 0 1.6-.3 2.2-.9.6-.6.9-1.4.9-2.2 0-.8-.3-1.6-.9-2.2L14 10.9c-.3-.3-.5-.7-.5-1.1s.2-.8.5-1.1l5.1-2.8z" />
  </svg>
);

const GeminiLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10-0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z" />
  </svg>
);

const FluxLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" {...props}>
    <path d="M12 2L2 13h9v9l10-11h-9V2z" />
  </svg>
);

// ─── AI Model targets ────────────────────────────────────────────────
const AI_MODELS = [
  { id: 'ChatGPT', label: 'ChatGPT', icon: OpenAILogo },
  { id: 'Midjourney', label: 'Midjourney', icon: MidjourneyLogo },
  { id: 'DALL-E', label: 'DALL·E', icon: OpenAILogo },
  { id: 'Claude', label: 'Claude', icon: ClaudeLogo },
  { id: 'Gemini', label: 'Gemini', icon: GeminiLogo },
  { id: 'Flux', label: 'Flux', icon: FluxLogo },
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
  { icon: Megaphone, label: 'Marketing', starter: 'Create a marketing plan for ' },
  { icon: ArrowRightLeft, label: 'Translate', starter: 'Convert this Midjourney prompt to DALL-E: ' },
  { icon: Code2, label: 'Code', starter: 'Write a system prompt for ' },
  { icon: Sparkles, label: 'Library', starter: '__LIBRARY__' },
];

// ─── Intent detection ────────────────────────────────────────────────
const detectIntent = (text: string): Intent => {
  const t = text.toLowerCase();

  if (/enhance|improve|better|optimize|fix|rewrite|upgrade|polish/i.test(t))
    return {
      mode: 'enhance', label: 'Enhancer', icon: Wand2, color: '#713DFF',
      apiEndpoint: '/api/tools/enhance',
      buildPayload: (input, model) => ({ prompt: input, targetTool: model }),
      extractResult: (d) => isRecord(d) && typeof d.enhancedPrompt === 'string' ? d.enhancedPrompt : '',
    };

  if (/translate|convert|midjourney to|dalle to|from .* to/i.test(t))
    return {
      mode: 'translate', label: 'Translator', icon: ArrowRightLeft, color: '#ff9f43',
      apiEndpoint: '/api/tools/translate',
      buildPayload: (input, model) => ({ prompt: input, fromTool: 'Midjourney', toTool: model }),
      extractResult: (d) => isRecord(d) && typeof d.translatedPrompt === 'string' ? d.translatedPrompt : '',
    };

  if (/image|photo|picture|portrait|scenery|render|flux|midjourney|dall|stable|draw|visual|cinematic/i.test(t))
    return {
      mode: 'image', label: 'Image Gen', icon: Image, color: '#ea2261',
      apiEndpoint: '/api/tools/generate',
      buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Image Generation' }),
      extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
    };

  if (/instagram|social|post|calendar|content|reel|tiktok|linkedin|twitter|marketing|ad|copy/i.test(t))
    return {
      mode: 'social', label: 'Marketing', icon: Megaphone, color: '#b9b9f9',
      apiEndpoint: '/api/tools/generate',
      buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Marketing' }),
      extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
    };

  if (/code|developer|programming|debug|system prompt|api|function|script/i.test(t))
    return {
      mode: 'code', label: 'Code', icon: Code2, color: '#faf0e6',
      apiEndpoint: '/api/tools/generate',
      buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Code' }),
      extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
    };

  return {
    mode: 'make', label: 'Prompt Maker', icon: Sparkles, color: '#713DFF',
    apiEndpoint: '/api/tools/generate',
    buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Text' }),
    extractResult: (d) => isRecord(d) && typeof d.generatedPrompt === 'string' ? d.generatedPrompt : '',
  };
};

const DEFAULT_INTENT = detectIntent('');

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
  const [intent, setIntent] = useState<Intent>(DEFAULT_INTENT);
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
  const [result, setResult] = useState('');
  const [resultIntent, setResultIntent] = useState<Intent | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
    if (isLoading || result || isFocused) return;
    const timer = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIdx(p => (p + 1) % PLACEHOLDERS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(timer);
  }, [isLoading, result, isFocused]);

  // ── Intent detection ─────────────────────────────────────────────
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInput(v);
    setIntent(v.trim().length >= 3 ? detectIntent(v) : DEFAULT_INTENT);
  }, []);

  // ── Execute inline ───────────────────────────────────────────────
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setResult('');
    setResultIntent(intent);
    pushHistory(input.trim());
    setLocalHistory(getHistory());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(intent.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intent.buildPayload(input.trim(), selectedModel)),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      const output = intent.extractResult(data);
      if (!output) throw new Error('No result returned.');
      setResult(output);
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

  // ── Copy / Reset ─────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    const onSuccess = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(result).then(onSuccess).catch(() => {
        fallbackCopy(result) && onSuccess();
      });
    } else {
      fallbackCopy(result) && onSuccess();
    }
  }, [result]);

  /** Textarea-based clipboard fallback for non-HTTPS / older browsers */
  function fallbackCopy(text: string): boolean {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* ignore */ }
    document.body.removeChild(ta);
    return ok;
  }

  const handleReset = useCallback(() => {
    setResult(''); setError(''); setResultIntent(null);
    setInput(''); setIntent(DEFAULT_INTENT);
    inputRef.current?.focus();
  }, []);

  // ── Chip click ───────────────────────────────────────────────────
  const handleChipClick = useCallback((starter: string) => {
    if (starter === '__LIBRARY__') {
      const el = document.getElementById('library') ?? document.querySelector('[data-section="library"]');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setResult(''); setError(''); setResultIntent(null);
    setInput(starter); setIntent(detectIntent(starter));
    inputRef.current?.focus();
  }, []);

  // ── History item click ───────────────────────────────────────────
  const handleHistoryClick = useCallback((q: string) => {
    setInput(q); setIntent(detectIntent(q));
    setHistoryOpen(false);
    inputRef.current?.focus();
  }, []);

  const showPill = input.trim().length >= 3;
  const ac = resultIntent?.color ?? intent.color;

  return (
    <div className="w-full max-w-[780px] mx-auto flex flex-col items-center gap-4">
      {/* ── Main bar ───────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className="relative flex items-center w-full h-[56px] md:h-[64px] rounded-2xl px-3 md:px-4 transition-all duration-300"
          style={{
            background: 'rgba(18, 10, 36, 0.75)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: `1px solid ${isFocused || showPill || isLoading ? `${ac}35` : 'rgba(255,255,255,0.04)'}`,
            boxShadow: isFocused || showPill || isLoading
              ? `0 8px 32px ${ac}10, inset 0 0 24px rgba(113, 61, 255, 0.04)`
              : '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {/* Model selector */}
          <div ref={modelRef} className="relative flex-shrink-0 mr-2">
            <button
              type="button"
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
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium transition-colors ${
                        selectedModel === m.id
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

          {/* Divider */}
          <div className="w-px h-6 bg-white/[0.08] mr-3 flex-shrink-0" />

          {/* Input */}
          <div className="relative flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleChange}
              onFocus={() => { setIsFocused(true); if (history.length > 0 && !input) setHistoryOpen(true); }}
              onBlur={() => { setIsFocused(false); setTimeout(() => setHistoryOpen(false), 200); }}
              disabled={isLoading}
              className="w-full bg-transparent text-white text-[14px] md:text-[15px] font-medium outline-none placeholder:text-transparent disabled:opacity-50"
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Universal prompt bar"
              id="universal-bar-input"
            />
            {/* Animated placeholder */}
            {!input && !isLoading && (
              <div className="absolute inset-0 flex items-center pointer-events-none" style={{ opacity: placeholderVisible ? 0.35 : 0, transition: 'opacity 300ms' }}>
                <span className="text-[14px] md:text-[15px] font-medium text-white/40 truncate">{PLACEHOLDERS[placeholderIdx]}</span>
              </div>
            )}

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
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {/* Intent pill */}
            {showPill && !isLoading && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap"
                style={{
                  backgroundColor: `${intent.color}15`,
                  color: intent.color,
                  border: `1px solid ${intent.color}30`,
                }}
              >
                <intent.icon className="w-3 h-3" />
                {intent.label}
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
        {(result || error) && (
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
                  {result && (
                    <span className="text-[10px] text-white/20 font-medium">{result.split(/\s+/).length} words · {result.length} chars</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {result && (
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

              {/* Body */}
              {error ? (
                <p className="text-red-400/80 text-[13px] leading-relaxed">{error}</p>
              ) : (
                <pre className="text-white/85 text-[13px] md:text-[14px] leading-[1.8] font-[inherit] whitespace-pre-wrap break-words max-h-[350px] overflow-y-auto scrollbar-hide pr-4">
                  {result}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quick actions (hidden during result) ───────────────────── */}
      {!result && !error && !isLoading && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide w-full pb-1 px-1">
          {QUICK_ACTIONS.map((a) => {
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
