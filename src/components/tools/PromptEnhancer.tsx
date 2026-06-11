import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Loader2, Copy, Check, ExternalLink } from 'lucide-react';
import { getRemainingUses, recordUse, hasReachedLimit } from '../../lib/rate-limit';
import { AI_MODELS } from '../hero/logos';
import { useModKey } from '../../lib/useOS';
import { saveToHistory } from './PromptHistory';
import { PromptHistory } from './PromptHistory';
import { ExampleChips } from './ExampleChips';

const TOOL_SLUG = 'prompt-enhancer';

const EXAMPLE_PROMPTS = [
  'Write a blog post about AI productivity',
  'Design a landing page for a SaaS product',
  'Create a lesson plan for teaching Python',
  'Build a customer support chatbot prompt',
];

const ENHANCEMENT_CHIPS = [
  { id: 'More Detail', label: '⚡ More Detail' },
  { id: 'Add Examples', label: '📌 Add Examples' },
  { id: 'More Concise', label: '✂ More Concise' },
  { id: 'Expert Level', label: '🎯 Expert Level' },
  { id: 'Structure', label: '📐 Structure' }
];

export const PromptEnhancer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('ChatGPT');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'enhanced' | 'changed'>('enhanced');
  
  const [result, setResult] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [remainingUses, setRemainingUses] = useState(5);
  const modKey = useModKey();

  // Load state and rate limits
  useEffect(() => {
    // Pre-fill prompt from URL query parameters if present
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setPrompt(q);

    // Initial rate limit count
    setRemainingUses(getRemainingUses(TOOL_SLUG));
  }, []);

  // Chip multi-select toggle handler
  const handleToggleChip = (chipId: string) => {
    setSelectedChips((prev) =>
      prev.includes(chipId)
        ? prev.filter((id) => id !== chipId)
        : [...prev, chipId]
    );
  };

  // Submit enhance prompt handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setError('Please type your prompt idea first.');
      return;
    }
    if (hasReachedLimit(TOOL_SLUG)) {
      setError("You've reached your limit of 5 free enhancements today. Try again tomorrow!");
      return;
    }

    setLoading(true);
    setError('');
    setResult('');
    setImprovements([]);

    try {
      const response = await fetch('/api/tools/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          targetTool: selectedModel,
          modes: selectedChips
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance prompt.');
      }

      setResult(data.enhancedPrompt || '');
      setImprovements(data.improvements || []);
      
      // Save to history
      saveToHistory({
        input: prompt,
        output: data.enhancedPrompt || '',
        tool: TOOL_SLUG,
        model: selectedModel,
      });

      // Update limits
      recordUse(TOOL_SLUG);
      setRemainingUses(getRemainingUses(TOOL_SLUG));

      // Clarity event tracking
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'prompt_enhanced');
      }
    } catch (err: any) {
      console.error('Prompt Enhancer error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy handler
  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Clarity event tracking
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'prompt_enhanced_copied');
      }
    }).catch((err) => {
      console.warn('Copy failed, using fallback:', err);
      const textArea = document.createElement('textarea');
      textArea.value = result;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    });
  };

  const usedUses = 5 - remainingUses;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 relative z-10">
      {/* Hide horizontal scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT ZONE — INPUT */}
        <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-6 flex flex-col justify-between h-full gap-5">
          <div className="flex flex-col gap-5">
            {/* AI Model horizontal tabs */}
            <div className="flex items-center overflow-x-auto no-scrollbar gap-2 pb-1 border-b border-white/[0.04]">
              {AI_MODELS.map((model) => {
                const isActive = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    disabled={loading}
                    className={`flex-none px-4 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none rounded-full flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[var(--color-primary)] text-black shadow-[0_0_15px_var(--color-primary-glow)] scale-[1.02]'
                        : 'text-gray-700 hover:text-black bg-transparent'
                    }`}
                  >
                    <model.icon className="w-3.5 h-3.5" />
                    {model.label}
                  </button>
                );
              })}
            </div>

            {/* Prompt Textarea */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="prompt-input" className="text-xs font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                  Your prompt
                </label>
                <PromptHistory toolSlug={TOOL_SLUG} onReuse={(e) => setPrompt(e.input)} />
              </div>
              <div className="relative">
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value.slice(0, 1000))}
                  rows={6}
                  maxLength={1000}
                  disabled={loading}
                  placeholder="Type any rough idea — we'll make it significantly better..."
                  className="w-full bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-xl p-4 text-[13.5px] text-black focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder-white/20 resize-none font-medium leading-relaxed min-h-[180px]"
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <span className="absolute bottom-3 right-4 text-[10px] text-[var(--color-text-muted)] font-mono">
                  {prompt.length} / 1000
                </span>
              </div>
            </div>

            {/* Example chips */}
            {!prompt && !loading && (
              <ExampleChips examples={EXAMPLE_PROMPTS} onSelect={setPrompt} disabled={loading} />
            )}

            {/* Enhancement mode chips */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                Enhancement Modes
              </span>
              <div className="flex flex-wrap gap-2">
                {ENHANCEMENT_CHIPS.map((chip) => {
                  const isSelected = selectedChips.includes(chip.id);
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleToggleChip(chip.id)}
                      disabled={loading}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer border transition-all select-none duration-150 ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                          : 'border-black border-[2px] bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black hover:border-black'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {/* Inline rate limit dots indicator */}
            <div className="flex items-center gap-3 py-1">
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
                {remainingUses} of 5 free uses today
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-3.5 rounded-xl text-xs leading-relaxed">
                {error}
              </div>
            )}

            {/* Enhance Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim() || remainingUses === 0}
              className="w-full h-11 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_25px_var(--color-primary-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enhancing Prompt...
                </>
              ) : (
                <>
                  Enhance Prompt
                  <kbd className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 border border-white/15 text-black/50">{modKey}+⏎</kbd>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT ZONE — OUTPUT */}
        <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-6 flex flex-col h-full gap-5">
          
          {loading || result ? (
            <div className="flex flex-col flex-1 h-full gap-4">
              {/* Tab switcher */}
              <div className="border-b border-black border-[2px] w-full flex gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('enhanced')}
                  className={`text-sm font-bold pb-2 cursor-pointer transition-colors relative ${
                    activeTab === 'enhanced' ? 'text-black' : 'text-[var(--color-text-muted)] hover:text-black'
                  }`}
                >
                  Enhanced Prompt
                  {activeTab === 'enhanced' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('changed')}
                  className={`text-sm font-bold pb-2 cursor-pointer transition-colors relative ${
                    activeTab === 'changed' ? 'text-black' : 'text-[var(--color-text-muted)] hover:text-black'
                  }`}
                >
                  What Changed
                  {activeTab === 'changed' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                    />
                  )}
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="flex-1 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeTab === 'enhanced' ? (
                    <motion.div
                      key="enhanced-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col flex-1 gap-3.5"
                    >
                      <div className="relative flex-1">
                        {/* Scrollable text container */}
                        <div className="w-full bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-xl p-4 overflow-y-auto max-h-[360px] font-mono text-[13px] text-black/95 whitespace-pre-wrap leading-relaxed select-text min-h-[220px]">
                          {loading ? (
                            <div className="flex flex-col gap-3 py-1">
                              <div className="h-3.5 w-11/12 bg-white/[0.03] rounded skeleton-shimmer-line animate-pulse" />
                              <div className="h-3.5 w-full bg-white/[0.03] rounded skeleton-shimmer-line animate-pulse" />
                              <div className="h-3.5 w-5/6 bg-white/[0.03] rounded skeleton-shimmer-line animate-pulse" />
                              <div className="h-3.5 w-4/5 bg-white/[0.03] rounded skeleton-shimmer-line animate-pulse" />
                            </div>
                          ) : (
                            result
                          )}
                        </div>

                        {/* Copy Button */}
                        {result && !loading && (
                          <button
                            onClick={handleCopy}
                            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-sm flex items-center justify-center text-black border border-black/20 border-[2px] transition-all cursor-pointer active:scale-90"
                            title="Copy Prompt"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-[var(--color-success-green)]" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Open in Bar Link */}
                      {result && !loading && (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/?q=${encodeURIComponent(result)}`;
                          }}
                          className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline flex items-center gap-1 mt-1 font-semibold self-start"
                        >
                          <span>Open in Bar</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="changed-tab"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col flex-1 py-1"
                    >
                      {loading ? (
                        <div className="flex flex-col gap-4 py-2">
                          <div className="h-10 w-full bg-gray-50 border-[2px] border-black rounded skeleton-shimmer-line animate-pulse" />
                          <div className="h-10 w-5/6 bg-gray-50 border-[2px] border-black rounded skeleton-shimmer-line animate-pulse" />
                          <div className="h-10 w-11/12 bg-gray-50 border-[2px] border-black rounded skeleton-shimmer-line animate-pulse" />
                        </div>
                      ) : improvements.length > 0 ? (
                        <div className="flex flex-col gap-3.5">
                          {improvements.map((bullet, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-700 border-l-2 border-[var(--color-primary)] pl-3.5 py-0.5 font-medium leading-relaxed"
                            >
                              ✓ {bullet}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--color-text-muted)] italic py-4">
                          No explanation details returned for this run.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border-[2px] border-black border border-white/[0.04] flex items-center justify-center text-[var(--color-text-muted)]">
                <Wand2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-black">Ready to enhance</p>
              <p className="text-[12.5px] text-[var(--color-text-muted)] max-w-[260px] leading-relaxed">
                Your enhanced prompt and explanations will appear here after generation.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
