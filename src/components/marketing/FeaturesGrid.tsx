import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wand2, Sparkles, TrendingUp, Cpu, Check, Play, RefreshCw } from 'lucide-react';

// ─── BRAND LOGO PATHS (ChatGPT/OpenAI, Midjourney, Claude, Flux, DALL-E, Gemini) ───
const OpenAILogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.729 9.176c.123-.807-.052-1.637-.495-2.337a4.26 4.26 0 00-2.029-1.631c-.13-.396-.347-.753-.637-1.049a2.766 2.766 0 00-3.328-.316c-.579-.472-1.307-.732-2.06-.736a3.197 3.197 0 00-2.73 1.51c-.694-.287-1.468-.285-2.161.004a3.194 3.194 0 00-2.001 2.213 2.756 2.756 0 00-1.745.892c-.822.846-1.066 2.103-.615 3.19a3.21 3.21 0 00-.73 2.063c.004.887.368 1.733 1.011 2.348a2.768 2.768 0 00.316 3.328 2.768 2.768 0 003.328.316c.582.476 1.312.739 2.069.742a3.197 3.197 0 002.73-1.51c.691.285 1.463.283 2.152-.005a3.197 3.197 0 002.002-2.212c.621.13 1.258.013 1.802-.332a2.766 2.766 0 001.077-3.155 3.208 3.208 0 00.73-2.063c-.004-.888-.369-1.734-1.012-2.35zm-9.729 9.387c-.779 0-1.468-.387-1.89-1.026l3.359-1.938v-2.09l-3.359 1.938c-.378-.22-.684-.543-.888-.93a2.637 2.637 0 01-.252-1.926l3.359-1.94 1.81 1.045v2.09l-1.81-1.045a1.218 1.218 0 00-1.214.001l-1.545.892c.328.536.911.854 1.545.845h.005l3.359-1.939v2.091l-3.359 1.938c.633.009 1.217-.308 1.545-.845l1.81-1.045v2.09c0 .779-.387 1.468-1.026 1.89zm-1.89-7.306l-1.81-1.045c.422-.64 1.111-1.026 1.89-1.026.779 0 1.468.387 1.89 1.026l-3.359 1.938zm-4.385-1.026c0-.779.387-1.468 1.026-1.89.421.639 1.11 1.026 1.89 1.026.779 0 1.468-.387 1.89-1.026l-3.359 1.938v2.09L5.725 10.231zm2.348 6.556c-.633-.009-1.217.309-1.545.846L4.718 16.581c-.422-.64-.616-1.403-.548-2.164a2.64 2.64 0 011.027-1.74l3.359-1.938 1.81 1.045v2.09l-1.81-1.045a1.218 1.218 0 00-1.214-.001zm6.98 2.051l-1.81-1.045 1.81-1.045a1.218 1.218 0 001.214.001l1.545-.892c-.328-.536-.911-.854-1.545-.845h-.005l-3.359 1.939v-2.091l3.359-1.938c-.633-.009-1.217.308-1.545.845l-1.81 1.045v-2.09c0-.779.387-1.468 1.026-1.89.422.64 1.111 1.026 1.89 1.026.779 0 1.468-.387 1.89-1.026l-3.359 1.938v2.09z" />
  </svg>
);

const MidjourneyLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L12 18V20zm0-7.24L7.8 7.8A5.92 5.92 0 0 1 12 6c1.62 0 3.1.64 4.2 1.8L12 12.76zM18 14c0 3.31-2.69 6-6 6v-2l5.3-6.8c.45.83.7 1.79.7 2.8z" />
  </svg>
);

const ClaudeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.1 5.9c-.3-.8-.9-1.4-1.7-1.7-1.1-.5-2.4-.2-3.1.6L8.8 10.3c-.6.6-1.4.9-2.2.9h-.8c-1.3 0-2.4-1.1-2.4-2.4s1.1-2.4 2.4-2.4c1 0 1.9-.6 2.2-1.6s-.1-2-1-2.6c-1.1-.7-2.6-.5-3.5.4C1.9 4.3 1.2 6.1 1.2 8c0 3.7 3 6.8 6.8 6.8h.4c.5 0 .9.2 1.3.5l5.5 5.5c.6.6 1.4.9 2.2.9.8 0 1.6-.3 2.2-.9.6-.6.9-1.4.9-2.2 0-.8-.3-1.6-.9-2.2L14 10.9c-.3-.3-.5-.7-.5-1.1s.2-.8.5-1.1l5.1-2.8z" />
  </svg>
);

const GeminiLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10-0-5.523-4.477-10-10-10 5.523 0 10-4.477 10-10z" />
  </svg>
);

const FluxLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L2 13h9v9l10-11h-9V2z" />
  </svg>
);

export const FeaturesGrid: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Component 1: Prompt Optimizer State
  const [optInput, setOptInput] = useState('a samurai portrait');
  const [optResult, setOptResult] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const runOptimization = () => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    setOptResult('');
    setTimeout(() => {
      setOptResult(
        'A cinematic portrait of a samurai standing in the pouring rain, dramatic rim lighting, neon street reflections, shot on 35mm anamorphic lens, unreal engine 5 render, highly detailed, 8k --ar 16:9'
      );
      setIsOptimizing(false);
    }, 1200);
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
    <section className="py-24 border-t border-white/[0.03] relative overflow-hidden" ref={ref}>
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
            className="lg:col-span-2 bg-[#120A24]/60 border border-white/[0.04] rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-[#0A0118]/80 border border-white/[0.03] rounded-2xl p-4 min-h-[200px]">
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
            className="bg-[#120A24]/60 border border-white/[0.04] rounded-3xl p-6 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
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
              <div className="mt-6 bg-[#0A0118]/80 border border-white/[0.03] rounded-2xl p-4 flex flex-col gap-4">
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
            className="lg:col-span-3 bg-[#120A24]/60 border border-white/[0.04] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
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
            <div className="flex-1 w-full max-w-[400px] bg-[#0A0118]/80 border border-white/[0.03] rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[220px]">
              {/* Central Input Node */}
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/25 border border-[var(--color-primary)]/40 flex items-center justify-center z-10 shadow-[0_0_20px_var(--color-primary-glow)]">
                <span className="text-[11px] font-mono font-bold text-white">L4</span>
              </div>

              {/* Surrounding Target Nodes */}
              {[
                { name: 'ChatGPT', pos: 'top-4 left-6', icon: OpenAILogo },
                { name: 'Midjourney', pos: 'top-4 right-6', icon: MidjourneyLogo },
                { name: 'Claude', pos: 'top-1/2 -translate-y-1/2 left-4', icon: ClaudeLogo },
                { name: 'Flux', pos: 'top-1/2 -translate-y-1/2 right-4', icon: FluxLogo },
                { name: 'DALL-E', pos: 'bottom-4 left-6', icon: OpenAILogo },
                { name: 'Gemini', pos: 'bottom-4 right-6', icon: GeminiLogo },
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
                          : 'bg-[#120A24] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isHovered ? 'text-white' : 'text-white/40'}`} />
                    </div>
                    <span className="text-[9px] font-mono text-white/40 mt-1">{m.name}</span>
                  </div>
                );
              })}

              {/* Connecting paths overlay */}
              {hoveredModel && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <line
                    x1="50%"
                    y1="50%"
                    x2={
                      hoveredModel === 'ChatGPT' || hoveredModel === 'Claude' || hoveredModel === 'DALL-E'
                        ? '25%'
                        : '75%'
                    }
                    y2={
                      hoveredModel === 'ChatGPT' || hoveredModel === 'Midjourney'
                        ? '20%'
                        : hoveredModel === 'DALL-E' || hoveredModel === 'Gemini'
                        ? '80%'
                        : '50%'
                    }
                    stroke="var(--color-primary)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-[dash_10s_linear_infinite]"
                  />
                </svg>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
