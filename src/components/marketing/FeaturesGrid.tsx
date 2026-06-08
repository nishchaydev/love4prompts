import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wand2, Sparkles, TrendingUp, Cpu, Check, Play, RefreshCw } from 'lucide-react';

// ─── BRAND LOGO PATHS (ChatGPT/OpenAI, Midjourney, Claude, DALL-E, Gemini) ───
const OpenAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 320 320" fill="currentColor" {...props}>
    <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z" />
  </svg>
);

const MidjourneyLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L12 18V20zm0-7.24L7.8 7.8A5.92 5.92 0 0 1 12 6c1.62 0 3.1.64 4.2 1.8L12 12.76zM18 14c0 3.31-2.69 6-6 6v-2l5.3-6.8c.45.83.7 1.79.7 2.8z" />
  </svg>
);

const ClaudeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
    <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
  </svg>
);

const DalleLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 85 24" fill="currentColor" {...props}>
    <path d="M8.147 2c1.438 0 2.75.225 3.937.676 1.186.45 2.21 1.099 3.074 1.946a8.625 8.625 0 011.927 3.094c.44 1.198.66 2.527.66 3.987s-.22 2.788-.66 3.986a8.625 8.625 0 01-1.927 3.095 8.778 8.778 0 01-3.074 1.946c-1.187.45-2.499.675-3.937.675H2V2h6.147zm19.898 0l7.469 19.405h-2.615l-1.969-5.108H22.25l-1.942 5.108H17.72L25.187 2h2.858zM8.12 4.243H4.534v14.92h3.613c2.175 0 3.896-.672 5.164-2.014 1.267-1.343 1.9-3.158 1.9-5.446 0-2.289-.633-4.104-1.9-5.446-1.268-1.343-2.998-2.014-5.19-2.014zm18.442.676l-3.45 9.108h6.956l-3.506-9.108zm23.215 16.486H37.536V2h2.588v17.135h9.653v2.27zM54.414 2v17.135h9.653v2.27H51.826V2h2.588zm12.619 9.946v3.19h-3.074v-3.19h3.074zm2.965 9.46V2h12.646v2.27H72.56v5.973h8.547v2.27H72.56v6.622h10.084v2.27H69.998z" />
  </svg>
);

const GeminiLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10-0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z" />
  </svg>
);

export const FeaturesGrid: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Component 1: Prompt Optimizer State
  const [optInput, setOptInput] = useState('a samurai portrait');
  const [optResult, setOptResult] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const runOptimization = async () => {
    if (isOptimizing || !optInput.trim()) return;
    setIsOptimizing(true);
    setOptResult('');
    try {
      const res = await fetch('/api/tools/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: optInput.trim(), targetTool: 'Midjourney' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Optimization failed');
      setOptResult(data.enhancedPrompt || 'No result returned');
    } catch (err: any) {
      console.error('FeatureGrid optimize error:', err);
      setOptResult('Error: ' + (err.message || 'Failed to optimize. Please try again.'));
    } finally {
      setIsOptimizing(false);
    }
  };

  // Component 2: Rank Tracker State
  const [sliderVal, setSliderVal] = useState(72);
  const [chartPoints, setChartPoints] = useState<number[]>([]);

  useEffect(() => {
    // Generate simple chart points based on slider value
    const base = sliderVal;
    setChartPoints([
      Math.max(10, base - 35),
      Math.max(15, base - 20),
      Math.max(20, base - 10),
      Math.max(25, base - 5),
      base,
    ]);
  }, [sliderVal]);

  // Component 3: Model Router State
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  return (
    <section className="py-16 sm:py-24 border-t border-white/[0.03] relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 max-w-[1100px]">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3 font-mono">
            Interactive Showcase
          </p>
          <h2 className="text-3xl md:text-[44px] font-black text-white tracking-[-0.04em] leading-tight max-w-[600px]">
            Designed for impact.<br />
            <span className="text-white/30">Built for precision.</span>
          </h2>
        </motion.div>

        {/* Asymmetric Bento-Inspired Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel 1: Prompt Optimizer (Asymmetrical width 2/3) */}
          <motion.div
            className="lg:col-span-2 bg-[var(--color-background-card)]/40 backdrop-blur-xl border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Background Mesh Flare */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[var(--color-primary)]/10 rounded-full blur-[80px] pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
                  <Wand2 className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Active Prompt Optimizer</h3>
                  <p className="text-[12px] text-white/40">Watch plain text transform to production-ready prompts</p>
                </div>
              </div>

              {/* Console Workspace */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-[var(--color-background-primary)]/60 backdrop-blur-md border border-white/[0.03] rounded-2xl p-4 min-h-[200px]">
                {/* Left pane: input */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block mb-2">User Input</span>
                    <input
                      type="text"
                      value={optInput}
                      onChange={(e) => setOptInput(e.target.value)}
                      disabled={isOptimizing}
                      className="w-full bg-transparent text-[13px] text-white font-medium outline-none border-b border-white/[0.06] pb-2 focus:border-[var(--color-primary)] transition-colors"
                      placeholder="Type a basic prompt..."
                    />
                  </div>
                  <button
                    onClick={runOptimization}
                    disabled={isOptimizing || !optInput.trim()}
                    className="mt-6 self-start px-4 py-2 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-white/20 text-white text-[12px] font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_var(--color-primary-glow)] active:scale-95 cursor-pointer"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        Optimize Prompt
                      </>
                    )}
                  </button>
                </div>

                {/* Right pane: optimized result */}
                <div className="border-t md:border-t-0 md:border-l border-white/[0.04] pt-4 md:pt-0 md:pl-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--color-primary)] uppercase tracking-widest block mb-2">Optimized Output</span>
                    {isOptimizing ? (
                      <div className="space-y-2 py-1">
                        <div className="h-3 w-full bg-white/[0.03] rounded animate-pulse" />
                        <div className="h-3 w-4/5 bg-white/[0.03] rounded animate-pulse" />
                        <div className="h-3 w-5/6 bg-white/[0.03] rounded animate-pulse" />
                      </div>
                    ) : optResult ? (
                      <motion.p
                        className="text-[12px] text-white/80 leading-relaxed font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {optResult}
                      </motion.p>
                    ) : (
                      <p className="text-[12px] text-white/20 italic">Click Optimize to see result...</p>
                    )}
                  </div>

                  {optResult && (
                    <div className="flex gap-1.5 mt-4">
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">v5.2</span>
                      <span className="text-[9px] font-mono bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 px-2 py-0.5 rounded-full">Cinematic</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Panel 2: Rank/Impact Tracker (Asymmetrical width 1/3) */}
          <motion.div
            className="bg-[var(--color-background-card)]/40 backdrop-blur-xl border border-[var(--color-border)] rounded-3xl p-6 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Impact & Analytics</h3>
                  <p className="text-[12px] text-white/40 font-medium">Interactive performance metrics</p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="mt-6 bg-[var(--color-background-primary)]/60 backdrop-blur-md border border-white/[0.03] rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Visibility Index</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono tracking-tighter" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {sliderVal}%
                  </span>
                </div>

                <input
                  type="range"
                  min="30"
                  max="99"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full accent-[var(--color-primary)] h-1 rounded-full cursor-pointer bg-white/10"
                />

                {/* Glowing Sparkline Chart */}
                <div className="h-16 flex items-end justify-between gap-1.5 pt-4">
                  {chartPoints.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <motion.div
                        className="w-full rounded-t-md relative bg-gradient-to-t from-[var(--color-primary)] to-[#ea2261]"
                        style={{ height: `${(h / 99) * 45}px` }}
                        animate={{ height: `${(h / 99) * 45}px` }}
                        transition={{ type: 'spring', stiffness: 100 }}
                      >
                        {i === chartPoints.length - 1 && (
                          <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-white/30 leading-relaxed mt-4">
              Drag the visibility index to forecast the quality and search rank score of your generated prompt outputs.
            </p>
          </motion.div>

          {/* Panel 3: Intelligent Model Router (Full width 3/3) */}
          <motion.div
            className="lg:col-span-3 bg-[var(--color-background-card)]/40 backdrop-blur-xl border border-[var(--color-border)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="max-w-[450px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#ff9f43]/10 flex items-center justify-center border border-[#ff9f43]/20">
                  <Cpu className="w-4 h-4 text-[#ff9f43]" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Intelligent LLM & Image Router</h3>
              </div>
              <p className="text-[13px] text-white/40 leading-relaxed">
                One console input automatically routes optimized configurations to the appropriate target. Hover over any target to preview routing channel pathways.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  'Automatic Target Selection',
                  'Dynamic Formatting Conversion',
                  'API & Console Ready',
                  'Multi-Model Syncing',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-[12px] font-medium text-white/60">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Router Interactive Diagram */}
            <div className="flex-1 w-full max-w-[400px] bg-[var(--color-background-primary)]/60 backdrop-blur-md border border-white/[0.03] rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[180px] sm:min-h-[220px]">
              {/* Central Input Node */}
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/25 border border-[var(--color-primary)]/40 flex items-center justify-center z-10 shadow-[0_0_20px_var(--color-primary-glow)]">
                <span className="text-[11px] font-mono font-bold text-white">L4</span>
              </div>

              {/* Surrounding Target Nodes (Symmetrical 5-Node Layout) */}
              {[
                { name: 'ChatGPT', pos: 'top-4 left-6', icon: OpenAILogo },
                { name: 'Midjourney', pos: 'top-4 right-6', icon: MidjourneyLogo },
                { name: 'Claude', pos: 'top-1/2 -translate-y-1/2 left-4', icon: ClaudeLogo },
                { name: 'Gemini', pos: 'top-1/2 -translate-y-1/2 right-4', icon: GeminiLogo },
                { name: 'DALL-E', pos: 'bottom-4 left-1/2 -translate-x-1/2', icon: DalleLogo },
              ].map((m) => {
                const isHovered = hoveredModel === m.name;
                const IconComponent = m.icon;
                return (
                  <div
                    key={m.name}
                    className={`absolute ${m.pos} flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      hoveredModel && !isHovered ? 'opacity-30' : 'opacity-100 scale-105'
                    }`}
                    onMouseEnter={() => setHoveredModel(m.name)}
                    onMouseLeave={() => setHoveredModel(null)}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                        isHovered
                          ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] shadow-[0_0_15px_var(--color-primary-glow)]'
                          : 'bg-[var(--color-background-card)] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isHovered ? 'text-white' : 'text-white/40'}`} />
                    </div>
                    <span className="text-[9px] font-mono text-white/40 mt-1">{m.name}</span>
                  </div>
                );
              })}

              {/* Connecting paths overlay */}
              {hoveredModel && (() => {
                let x2 = '50%';
                let y2 = '50%';
                if (hoveredModel === 'ChatGPT') { x2 = '25%'; y2 = '20%'; }
                else if (hoveredModel === 'Midjourney') { x2 = '75%'; y2 = '20%'; }
                else if (hoveredModel === 'Claude') { x2 = '20%'; y2 = '50%'; }
                else if (hoveredModel === 'Gemini') { x2 = '80%'; y2 = '50%'; }
                else if (hoveredModel === 'DALL-E') { x2 = '50%'; y2 = '80%'; }
                return (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <line
                      x1="50%"
                      y1="50%"
                      x2={x2}
                      y2={y2}
                      stroke="var(--color-primary)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="animate-[dash_10s_linear_infinite]"
                    />
                  </svg>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
