import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, Check, Sparkles, MessageSquare, Image as ImageIcon, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Lightbulb } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getRemainingUses, recordUse, hasReachedLimit } from '../../lib/rate-limit';
import { AI_MODELS_EXTENDED } from '../hero/logos';
import { useModKey } from '../../lib/useOS';
import { saveToHistory, PromptHistory } from './PromptHistory';
import { ExampleChips } from './ExampleChips';
import { springs } from '../../lib/motion';

const TOOL_SLUG = 'prompt-maker';

const EXAMPLE_PROMPTS = [
  'A weekly meal planner and grocery list generator',
  'A cold email template for B2B SaaS sales',
  'A detailed character backstory generator for D&D',
  'A code reviewer that checks for security vulnerabilities',
];

const USE_CASES = [
  { id: 'Image Generation', label: 'Image', icon: '🖼️' },
  { id: 'Text', label: 'Writing', icon: '✏️' },
  { id: 'Code', label: 'Code', icon: '💻' },
  { id: 'Marketing', label: 'Marketing', icon: '📈' },
  { id: 'Study', label: 'Study', icon: '📚' },
  { id: 'Other', label: 'Other', icon: '🔮' },
];

const STYLE_CHIPS = [
  'Professional', 'Creative', 'Minimal', 'Detailed', 'Casual', 'Technical',
];

type WizardStep = 1 | 2 | 3 | 'result';

export const PromptMaker: React.FC = () => {
  const [step, setStep] = useState<WizardStep>(1);
  const [description, setDescription] = useState('');
  const [useCase, setUseCase] = useState('Code Generation');
  const [targetModel, setTargetModel] = useState('ChatGPT');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Professional']);
  const [extraContext, setExtraContext] = useState('');

  const [result, setResult] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [remainingUses, setRemainingUses] = useState(5);
  const modKey = useModKey();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setDescription(q);
    getRemainingUses(TOOL_SLUG).then(setRemainingUses);
  }, []);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const handleGenerate = async () => {
    if (!description.trim() || !useCase) return;
    const limitReached = await hasReachedLimit(TOOL_SLUG);
    if (limitReached) {
      setError("You've reached your daily limit of 5 free generations.");
      return;
    }

    setError('');
    setResult('');
    setTips([]);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/tools/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          description: description.trim(),
          targetTool: targetModel,
          useCase,
          styles: selectedStyles,
          extraContext: extraContext.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generation failed.');

      setResult(data.generatedPrompt || data.directResponse || '');
      setTips(data.tips || []);
      saveToHistory({
        input: description,
        output: data.generatedPrompt || data.directResponse || '',
        tool: TOOL_SLUG,
        model: targetModel,
      });
      await recordUse(TOOL_SLUG);
      const remaining = await getRemainingUses(TOOL_SLUG);
      setRemainingUses(remaining);
      setStep('result');

      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'prompt_generated');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = result;
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

  const handleStartOver = () => {
    setStep(1);
    setDescription('');
    setUseCase('');
    setTargetModel('ChatGPT');
    setSelectedStyles([]);
    setExtraContext('');
    setResult('');
    setTips([]);
    setError('');
  };

  const usedUses = 5 - remainingUses;
  const currentStepNum = step === 'result' ? 3 : step;

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); setStep((s) => ((s as number) + 1) as WizardStep); };
  const goBack = () => { setDirection(-1); setStep((s) => ((s as number) - 1) as WizardStep); };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8 relative z-10">
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-white/[0.05]">
            <motion.div
              className="h-full bg-[var(--color-primary)]"
              initial={{ width: '0%' }}
              animate={{
                width: currentStepNum >= s ? '100%' : '0%',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>

      {/* Wizard body */}
      <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-6 sm:p-8 min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── STEP 1: Describe ── */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springs.gentle}
              className="flex flex-col flex-1 gap-5"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                  Step 1 of 3
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h2 className="text-xl font-bold text-black tracking-tight">
                    What do you want to create?
                  </h2>
                  <PromptHistory toolSlug={TOOL_SLUG} onReuse={(e) => setDescription(e.input)} />
                </div>
                <p className="text-[13px] text-[var(--color-text-muted)] mt-1 font-medium">
                  Describe your idea in plain English. Be as specific or vague as you want.
                </p>
              </div>

              <div className="relative flex-1">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                  rows={6}
                  maxLength={500}
                  placeholder="/// TYPE YOUR IMAGINATION HERE..."
                  className="w-full bg-gray-50 border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-4 text-[13.5px] text-black focus:outline-none focus:shadow-[6px_6px_0_#FF6D87] focus:-translate-y-1 transition-all duration-300 placeholder:font-mono placeholder-black/30 resize-none font-medium leading-relaxed min-h-[160px]"
                />
                <span className="absolute bottom-3 right-4 text-[10px] text-[var(--color-text-muted)] font-mono">
                  {description.length} / 500
                </span>
              </div>

              {/* Example chips */}
              {!description && (
                <ExampleChips examples={EXAMPLE_PROMPTS} onSelect={setDescription} />
              )}

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springs.bouncy}
                  onClick={goNext}
                  disabled={!description.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_var(--color-primary-glow)] flex items-center gap-2 cursor-pointer"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Use Case + Model ── */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springs.gentle}
              className="flex flex-col flex-1 gap-5"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                  Step 2 of 3
                </span>
                <h2 className="text-xl font-bold text-black mt-1 tracking-tight">
                  What's it for?
                </h2>
              </div>

              {/* Use case grid */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                  Category
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {USE_CASES.map((uc) => {
                    const isActive = useCase === uc.id;
                    return (
                      <motion.button
                        key={uc.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springs.bouncy}
                        onClick={() => setUseCase(uc.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer select-none ${
                          isActive
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                            : 'border-[2px] border-black bg-gray-50 shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black'
                        }`}
                      >
                        <span className="text-lg">{uc.icon}</span>
                        <span className="text-[10px] font-bold">{uc.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* AI model pills */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                  Target AI Model
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AI_MODELS_EXTENDED.map((model) => {
                    const isActive = targetModel === model.id;
                    const Icon = model.icon;
                    return (
                      <motion.button
                        key={model.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springs.bouncy}
                        onClick={() => setTargetModel(model.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border cursor-pointer select-none ${
                          isActive
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                            : 'border-[2px] border-black bg-gray-50 shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {model.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between mt-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springs.bouncy}
                  onClick={goBack}
                  className="px-5 py-2.5 rounded-xl border-[2px] border-black bg-transparent text-gray-700 hover:text-black hover:border-black/30 font-bold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springs.bouncy}
                  onClick={goNext}
                  disabled={!useCase}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_var(--color-primary-glow)] flex items-center gap-2 cursor-pointer"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Preferences ── */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springs.gentle}
              className="flex flex-col flex-1 gap-5"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                  Step 3 of 3
                </span>
                <h2 className="text-xl font-bold text-black mt-1 tracking-tight">
                  Any preferences?
                </h2>
              </div>

              {/* Style chips */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                  Style (optional)
                </span>
                <div className="flex flex-wrap gap-2">
                  {STYLE_CHIPS.map((style) => {
                    const isSelected = selectedStyles.includes(style);
                    return (
                      <motion.button
                        key={style}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springs.bouncy}
                        onClick={() => toggleStyle(style)}
                        disabled={loading}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer border select-none ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                            : 'border-[2px] border-black bg-gray-50 shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black'
                        }`}
                      >
                        {style}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Extra context */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                  Additional context (optional)
                </span>
                <textarea
                  value={extraContext}
                  onChange={(e) => setExtraContext(e.target.value.slice(0, 300))}
                  rows={3}
                  maxLength={300}
                  placeholder="e.g., Keep the tone encouraging, use clear analogies, and ask me questions..."
                  className="w-full bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-3.5 text-[13px] text-black focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder-black/30 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Rate limit + generate */}
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i < usedUses
                            ? 'bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]'
                            : 'bg-white/10 border-[2px] border-black/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-[var(--color-text-muted)] font-mono">
                    {remainingUses} of 5 free today
                  </span>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springs.bouncy}
                    onClick={goBack}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl border-[2px] border-black bg-transparent text-gray-700 hover:text-black hover:border-black/30 font-bold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springs.bouncy}
                    onClick={handleGenerate}
                    disabled={loading || remainingUses === 0}
                    className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_var(--color-primary-glow)] flex items-center justify-center gap-2 cursor-pointer min-w-[160px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Prompt
                        <kbd className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 border border-white/15 text-black/50">{modKey}+⏎</kbd>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESULT STATE ── */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={springs.gentle}
              className="flex flex-col flex-1 gap-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-success-green)] uppercase">
                    Generated
                  </span>
                  <h2 className="text-xl font-bold text-black mt-1 tracking-tight">
                    Your prompt is ready
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springs.bouncy}
                  onClick={handleStartOver}
                  className="px-4 py-2 rounded-xl border-[2px] border-black bg-transparent text-gray-700 hover:text-black hover:border-black/30 font-bold text-[11px] tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Start Over
                </motion.button>
              </div>

              {/* Output text */}
              <div className="relative flex-1">
                <div className="w-full bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-4 font-mono text-[13px] text-black/90 whitespace-pre-wrap leading-relaxed min-h-[200px] overflow-y-auto max-h-[360px] select-text">
                  {result}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springs.bouncy}
                  onClick={handleCopy}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-black border-[2px] border-black/20 cursor-pointer"
                  title="Copy Prompt"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[var(--color-success-green)]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {/* Tips section */}
              {tips.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-accent-coral)] uppercase tracking-widest font-mono">
                    <Lightbulb className="w-3 h-3" />
                    Tips
                  </div>
                  <div className="flex flex-col gap-2">
                    {tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="text-[12px] text-gray-700 border-l-2 border-[var(--color-accent-coral)] pl-3 py-0.5 font-medium leading-relaxed"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Open in bar */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/?q=${encodeURIComponent(result)}`;
                }}
                className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline flex items-center gap-1 font-semibold self-start"
              >
                <span>Open in Bar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
