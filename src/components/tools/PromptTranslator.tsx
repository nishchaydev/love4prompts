import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Loader2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getRemainingUses, recordUse, hasReachedLimit } from '../../lib/rate-limit';
import { AI_MODELS_EXTENDED } from '../hero/logos';
import { useModKey } from '../../lib/useOS';
import { saveToHistory, PromptHistory } from './PromptHistory';
import { ExampleChips } from './ExampleChips';

const TOOL_SLUG = 'prompt-translator';

const EXAMPLE_PROMPTS = [
  'A cinematic portrait of a woman in golden hour --ar 16:9 --v 6',
  'Generate a Python REST API with authentication and rate limiting',
  'Write a persuasive product description for noise-cancelling headphones',
];

export const PromptTranslator: React.FC = () => {
  const [fromModel, setFromModel] = useState(AI_MODELS_EXTENDED[0].id);
  const [toModel, setToModel] = useState(AI_MODELS_EXTENDED[3].id);
  const [inputPrompt, setInputPrompt] = useState('');
  const [outputPrompt, setOutputPrompt] = useState('');
  const [adaptations, setAdaptations] = useState<string[]>([]);
  const [showAdaptations, setShowAdaptations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [swapRotation, setSwapRotation] = useState(0);
  const [remainingUses, setRemainingUses] = useState(5);
  const modKey = useModKey();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setInputPrompt(q);
    setRemainingUses(getRemainingUses(TOOL_SLUG));
  }, []);

  const handleSwap = () => {
    const tempModel = fromModel;
    const tempText = inputPrompt;
    setFromModel(toModel);
    setToModel(tempModel);
    setInputPrompt(outputPrompt);
    setOutputPrompt(tempText);
    setSwapRotation((prev) => prev + 180);
    setAdaptations([]);
    setShowAdaptations(false);
  };

  const handleTranslate = async () => {
    if (!inputPrompt.trim()) {
      setError('Paste a prompt to translate.');
      return;
    }
    if (fromModel === toModel) {
      setError('Source and target must be different.');
      return;
    }
    if (hasReachedLimit(TOOL_SLUG)) {
      setError("You've reached your limit of 5 free translations today.");
      return;
    }

    setError('');
    setOutputPrompt('');
    setAdaptations([]);
    setShowAdaptations(false);
    setLoading(true);

    try {
      const response = await fetch('/api/tools/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputPrompt.trim(),
          fromTool: fromModel,
          toTool: toModel,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Translation failed.');

      setOutputPrompt(data.translatedPrompt || '');
      setAdaptations(data.adaptations || []);
      saveToHistory({
        input: inputPrompt,
        output: data.translatedPrompt || '',
        tool: TOOL_SLUG,
        model: `${fromModel} → ${toModel}`,
      });
      recordUse(TOOL_SLUG);
      setRemainingUses(getRemainingUses(TOOL_SLUG));

      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'prompt_translated');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputPrompt) return;
    navigator.clipboard.writeText(outputPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'prompt_translated_copied');
      }
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = outputPrompt;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const usedUses = 5 - remainingUses;

  const ModelSelector = ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (v: string) => void;
    label: string;
  }) => (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {AI_MODELS_EXTENDED.map((model) => {
          const isActive = value === model.id;
          const Icon = model.icon;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onChange(model.id)}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                  : 'border-black border-[2px] bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black hover:border-black'
              }`}
            >
              <Icon className="w-3 h-3" />
              {model.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 relative z-10">
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* 3-column grid: FROM | SWAP | TO */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-0 items-stretch">

        {/* FROM CARD */}
        <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl lg:rounded-r-none p-6 flex flex-col gap-5">
          <ModelSelector value={fromModel} onChange={setFromModel} label="From" />

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <label htmlFor="from-prompt" className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                Source Prompt
              </label>
              <PromptHistory toolSlug={TOOL_SLUG} onReuse={(e) => setInputPrompt(e.input)} />
            </div>
            <textarea
              id="from-prompt"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value.slice(0, 10000))}
              rows={8}
              maxLength={10000}
              disabled={loading}
              placeholder="Paste a prompt written for any AI tool..."
              className="w-full flex-1 bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-xl p-4 text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder-white/20 resize-none font-medium leading-relaxed min-h-[200px]"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
            />
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono text-right">
              {inputPrompt.length} / 10,000
            </span>
          </div>
        </div>

        {/* CENTER SWAP COLUMN */}
        <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0 lg:px-3 z-10">
          <motion.button
            onClick={handleSwap}
            disabled={loading}
            animate={{ rotate: swapRotation }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-11 h-11 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-black flex items-center justify-center shadow-[0_0_20px_var(--color-primary-glow)] cursor-pointer active:scale-90 transition-colors disabled:opacity-40"
            aria-label="Swap source and target"
          >
            <ArrowLeftRight className="w-4.5 h-4.5" />
          </motion.button>
        </div>

        {/* TO CARD */}
        <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl lg:rounded-l-none p-6 flex flex-col gap-5">
          <ModelSelector value={toModel} onChange={setToModel} label="To" />

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                Translated Output
              </label>
              {outputPrompt && !loading && (
                <button
                  onClick={handleCopy}
                  className="w-7 h-7 rounded-lg bg-black/40 hover:bg-black/70 flex items-center justify-center text-black border border-black/20 border-[2px] transition-all cursor-pointer active:scale-90"
                  title="Copy"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[var(--color-success-green)]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            <div className="w-full flex-1 bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-xl p-4 font-mono text-[13px] text-black/90 whitespace-pre-wrap leading-relaxed min-h-[200px] overflow-y-auto max-h-[360px] select-text">
              {loading ? (
                <div className="flex flex-col gap-3 py-1">
                  <div className="h-3.5 w-11/12 bg-white/[0.03] rounded animate-pulse" />
                  <div className="h-3.5 w-full bg-white/[0.03] rounded animate-pulse" />
                  <div className="h-3.5 w-5/6 bg-white/[0.03] rounded animate-pulse" />
                  <div className="h-3.5 w-4/5 bg-white/[0.03] rounded animate-pulse" />
                </div>
              ) : outputPrompt ? (
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {outputPrompt}
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span className="text-black/15 italic text-[12px]">
                  Translated prompt will appear here...
                </span>
              )}
            </div>
          </div>

          {/* Adaptations accordion */}
          {adaptations.length > 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <button
                onClick={() => setShowAdaptations(!showAdaptations)}
                className="flex items-center gap-2 text-[11px] font-semibold text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                {showAdaptations ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                What changed ({adaptations.length})
              </button>

              <AnimatePresence>
                {showAdaptations && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 mt-3">
                      {adaptations.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="text-[12px] text-gray-700 border-l-2 border-[var(--color-primary)] pl-3 py-0.5 font-medium leading-relaxed"
                        >
                          ✓ {item}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom row: error + rate limit + translate button */}
      <div className="mt-5 flex flex-col gap-3 max-w-md mx-auto">
        {error && (
          <div className="text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-xs leading-relaxed text-center">
            {error}
          </div>
        )}

        {/* Rate limit dots */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < usedUses
                    ? 'bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]'
                    : 'bg-white/10 border border-black/30 border-[2px]'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] font-mono">
            {remainingUses} of 5 free today
          </span>
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading || !inputPrompt.trim() || remainingUses === 0}
          className="w-full h-11 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_25px_var(--color-primary-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              Translate Prompt
              <kbd className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 border border-white/15 text-black/50">{modKey}+⏎</kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
