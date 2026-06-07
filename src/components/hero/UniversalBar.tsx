import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight, Copy, Check, RotateCcw, X,
  Wand2, Image, ArrowRightLeft, Code2, Megaphone, Sparkles,
  ChevronDown, Clock, Command, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── AI Model targets ────────────────────────────────────────────────
const AI_MODELS = [
  { id: 'ChatGPT', label: 'ChatGPT', icon: '🤖' },
  { id: 'Midjourney', label: 'Midjourney', icon: '🎨' },
  { id: 'DALL-E', label: 'DALL·E', icon: '🖼️' },
  { id: 'Claude', label: 'Claude', icon: '🧠' },
  { id: 'Gemini', label: 'Gemini', icon: '✨' },
  { id: 'Flux', label: 'Flux', icon: '⚡' },
] as const;

// ─── Types ───────────────────────────────────────────────────────────
interface Intent {
  mode: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  apiEndpoint: string;
  buildPayload: (input: string, model: string) => Record<string, unknown>;
  extractResult: (data: Record<string, unknown>) => string;
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
      mode: 'enhance', label: 'Enhancer', icon: Wand2, color: '#8B5CF6',
      apiEndpoint: '/api/tools/enhance',
      buildPayload: (input, model) => ({ prompt: input, targetTool: model }),
      extractResult: (d: any) => d.enhancedPrompt ?? '',
    };

  if (/translate|convert|midjourney to|dalle to|from .* to/i.test(t))
    return {
      mode: 'translate', label: 'Translator', icon: ArrowRightLeft, color: '#A4B3B6',
      apiEndpoint: '/api/tools/translate',
      buildPayload: (input, model) => ({ prompt: input, fromTool: 'Midjourney', toTool: model }),
      extractResult: (d: any) => d.translatedPrompt ?? '',
    };

  if (/image|photo|picture|portrait|scenery|render|flux|midjourney|dall|stable|draw|visual|cinematic/i.test(t))
    return {
      mode: 'image', label: 'Image Gen', icon: Image, color: '#E98074',
      apiEndpoint: '/api/tools/generate',
      buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Image Generation' }),
      extractResult: (d: any) => d.generatedPrompt ?? '',
    };

  if (/instagram|social|post|calendar|content|reel|tiktok|linkedin|twitter|marketing|ad|copy/i.test(t))
    return {
      mode: 'social', label: 'Marketing', icon: Megaphone, color: '#6B4DB3',
      apiEndpoint: '/api/tools/generate',
      buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Marketing' }),
      extractResult: (d: any) => d.generatedPrompt ?? '',
    };

  if (/code|developer|programming|debug|system prompt|api|function|script/i.test(t))
    return {
      mode: 'code', label: 'Code', icon: Code2, color: '#fbbf24',
      apiEndpoint: '/api/tools/generate',
      buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Code' }),
      extractResult: (d: any) => d.generatedPrompt ?? '',
    };

  return {
    mode: 'make', label: 'Prompt Maker', icon: Sparkles, color: '#8B5CF6',
    apiEndpoint: '/api/tools/generate',
    buildPayload: (input, model) => ({ description: input, targetTool: model, useCase: 'Text' }),
    extractResult: (d: any) => d.generatedPrompt ?? '',
  };
};

const DEFAULT_INTENT = detectIntent('');

// ─── History persistence ─────────────────────────────────────────────
const HISTORY_KEY = 'ilp_bar_history';
const MAX_HISTORY = 5;

function getHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}
function pushHistory(q: string) {
  const h = getHistory().filter(i => i !== q);
  h.unshift(q);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, MAX_HISTORY)));
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

    try {
      const res = await fetch(intent.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intent.buildPayload(input.trim(), selectedModel)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      const output = intent.extractResult(data);
      if (!output) throw new Error('No result returned.');
      setResult(output);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [input, intent, isLoading, selectedModel]);

  // ── Copy / Reset ─────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleReset = useCallback(() => {
    setResult(''); setError(''); setResultIntent(null);
    setInput(''); setIntent(DEFAULT_INTENT);
    inputRef.current?.focus();
  }, []);

  // ── Chip click ───────────────────────────────────────────────────
  const handleChipClick = useCallback((starter: string) => {
    if (starter === '__LIBRARY__') {
      document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
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
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: `1px solid ${isFocused || showPill || isLoading ? `${ac}40` : 'rgba(255,255,255,0.06)'}`,
            boxShadow: isFocused || showPill || isLoading
              ? `0 0 40px ${ac}15, inset 0 0 30px ${ac}05`
              : '0 2px 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Model selector */}
          <div ref={modelRef} className="relative flex-shrink-0 mr-2">
            <button
              type="button"
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-semibold text-white/60 hover:text-white/90 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
            >
              <span className="text-[13px]">{AI_MODELS.find(m => m.id === selectedModel)?.icon}</span>
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
                  className="absolute top-full left-0 mt-2 w-44 bg-[#1a1a20]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_16px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden py-1 z-50"
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
                      <span>{m.icon}</span>
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
                  className="absolute top-full left-0 right-0 mt-4 bg-[#1a1a20]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_16px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden py-1 z-50"
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
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(30px)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.2)' : `${ac}20`}`,
                boxShadow: `0 8px 40px ${error ? 'rgba(239,68,68,0.08)' : `${ac}08`}`,
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
