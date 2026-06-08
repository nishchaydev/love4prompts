import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2, Copy, Check, Sparkles, MessageSquare, Code2, Image as ImageIcon, ArrowLeft, ArrowRight, RotateCcw, ExternalLink, Lightbulb } from 'lucide-react';
import { getRemainingUses, recordUse, hasReachedLimit } from '../../lib/rate-limit';
import { AI_MODELS_EXTENDED } from '../hero/logos';
import { useModKey } from '../../lib/useOS';
import { saveToHistory, PromptHistory } from './PromptHistory';
import { ExampleChips } from './ExampleChips';

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
  const [useCase, setUseCase] = useState('');
  const [targetModel, setTargetModel] = useState('ChatGPT');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
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
    setRemainingUses(getRemainingUses(TOOL_SLUG));
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
    if (hasReachedLimit(TOOL_SLUG)) {
      setError("You've reached your daily limit of 5 free generations.");
      return;
    }

    setError('');
    setResult('');
    setTips([]);
    setLoading(true);

    try {
      const response = await fetch('/api/tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      recordUse(TOOL_SLUG);
      setRemainingUses(getRemainingUses(TOOL_SLUG));
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
      <div className="bg-[var(--color-background-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 min-h-[400px] flex flex-col">
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
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1 gap-5"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                  Step 1 of 3
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">
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
                  placeholder="e.g., I want a professional LinkedIn post about the future of remote work..."
                  className="w-full bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-xl p-4 text-[13.5px] text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder-white/20 resize-none font-medium leading-relaxed min-h-[160px]"
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
                <button
                  onClick={goNext}
                  disabled={!description.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-white/20 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_15px_var(--color-primary-glow)] flex items-center gap-2 cursor-pointer"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
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
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1 gap-5"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                  Step 2 of 3
                </span>
                <h2 className="text-xl font-bold text-white mt-1 tracking-tight">
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
                      <button
                        key={uc.id}
                        onClick={() => setUseCase(uc.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                          isActive
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                            : 'border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text-secondary)] hover:text-white hover:border-white/15'
                        }`}
                      >
                        <span className="text-lg">{uc.icon}</span>
                        <span className="text-[10px] font-bold">{uc.label}</span>
                      </button>
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
                      <button
                        key={model.id}
                        onClick={() => setTargetModel(model.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all duration-200 cursor-pointer select-none ${
                          isActive
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                            : 'border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text-secondary)] hover:text-white hover:border-white/15'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {model.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between mt-auto">
                <button
                  onClick={goBack}
                  className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:text-white hover:border-white/20 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  onClick={goNext}
                  disabled={!useCase}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-white/20 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_15px_var(--color-primary-glow)] flex items-center gap-2 cursor-pointer"
                >
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
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
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1 gap-5"
            >
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                  Step 3 of 3
                </span>
                <h2 className="text-xl font-bold text-white mt-1 tracking-tight">
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
                      <button
                        key={style}
                        onClick={() => toggleStyle(style)}
                        disabled={loading}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer border transition-all select-none duration-150 ${
                          isSelected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                            : 'border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text-secondary)] hover:text-white hover:border-white/15'
                        }`}
                      >
                        {style}
                      </button>
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
                  placeholder="Any specific requirements, tone, audience, or constraints..."
                  className="w-full bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-xl p-3.5 text-[13px] text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder-white/20 resize-none font-medium leading-relaxed"
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
                            : 'bg-white/10 border border-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-[var(--color-text-muted)] font-mono">
                    {remainingUses} of 5 free today
                  </span>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={goBack}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:text-white hover:border-white/20 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={loading || remainingUses === 0}
                    className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-white/20 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_15px_var(--color-primary-glow)] flex items-center justify-center gap-2 cursor-pointer min-w-[160px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Prompt
                        <kbd className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 border border-white/15 text-white/50">{modKey}+⏎</kbd>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESULT STATE ── */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col flex-1 gap-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-success-green)] uppercase">
                    Generated
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1 tracking-tight">
                    Your prompt is ready
                  </h2>
                </div>
                <button
                  onClick={handleStartOver}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:text-white hover:border-white/20 font-bold text-[11px] tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Start Over
                </button>
              </div>

              {/* Output text */}
              <div className="relative flex-1">
                <div className="w-full bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-xl p-4 font-mono text-[13px] text-white/90 whitespace-pre-wrap leading-relaxed min-h-[200px] overflow-y-auto max-h-[360px] select-text">
                  {result}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 transition-all cursor-pointer active:scale-90"
                  title="Copy Prompt"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[var(--color-success-green)]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
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
                        className="text-[12px] text-[var(--color-text-secondary)] border-l-2 border-[var(--color-accent-coral)] pl-3 py-0.5 font-medium leading-relaxed"
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
