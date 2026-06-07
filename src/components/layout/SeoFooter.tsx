import React from 'react';

export const SeoFooter: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.05] bg-gradient-to-b from-[#120A24]/40 to-[#0A0118] py-20 mt-auto">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] rounded-full bg-[var(--color-primary)] opacity-[0.03] blur-[100px] pointer-events-none z-0" aria-hidden="true" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Core */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo-icon.png" 
                alt="Love4Prompts Logo" 
                className="h-12 w-auto object-contain transition-all duration-300 hover:scale-105" 
              />
              <span className="text-xl md:text-2xl font-black font-display tracking-tight text-white">
                Love4<span className="text-[var(--color-primary)]">Prompts</span>
              </span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-[13px] leading-relaxed max-w-sm">
              The ultimate prompt toolkit for every AI. Access our daily updated library to discover and download free prompts for every use case.
            </p>
            <a 
              href="/dashboard" 
              className="inline-flex items-center text-[var(--color-primary)] font-semibold text-[13px] hover:text-[var(--color-primary-hover)] hover:underline mt-1 transition-colors group no-underline"
            >
              Manage Prompts 
              <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
            </a>
          </div>

          {/* Column 2: AI Tools */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-bold text-white/40 text-[11px] uppercase tracking-widest mb-2 font-mono">AI Tools</h3>
            <a href="/tools/prompt-enhancer" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Prompt Enhancer</a>
            <a href="/tools/prompt-maker" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Prompt Maker</a>
            <a href="/tools/prompt-translator" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Prompt Translator</a>
            <a href="/tools/image-to-prompt" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Image to Prompt</a>
            <a href="/tools" className="text-[var(--color-primary)] font-semibold text-[13px] hover:underline mt-1 no-underline">All Tools</a>
          </div>

          {/* Column 3: Prompt Maker Tools */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-bold text-white/40 text-[11px] uppercase tracking-widest mb-2 font-mono">Prompt Maker</h3>
            <a href="/?tag=maker" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">AI Prompt Maker</a>
            <a href="/?tag=chatgpt-maker" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">ChatGPT Maker</a>
            <a href="/?tag=video-maker" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">AI Video Maker</a>
            <a href="/?tag=claude-maker" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Claude Maker</a>
            <a href="/?tag=sora-maker" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Sora Maker</a>
            <a href="/?tag=story-maker" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Story Maker</a>
          </div>

          {/* Column 4: Photo & Video Prompts */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-bold text-white/40 text-[11px] uppercase tracking-widest mb-2 font-mono">Visuals</h3>
            <a href="/?tag=photo" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Photo Prompt</a>
            <a href="/?tag=ai-photo" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">AI Photo App</a>
            <a href="/?tag=drawing" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Drawing Prompt</a>
            <a href="/?tag=video" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">AI Video from Text</a>
          </div>

          {/* Column 5: Platforms */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-bold text-white/40 text-[11px] uppercase tracking-widest mb-2 font-mono">Platforms</h3>
            <a href="/?tag=chatgpt" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">ChatGPT Prompts</a>
            <a href="/?tag=gemini" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">Gemini Prompts</a>
            <a href="/?tag=builder" className="text-[var(--color-text-secondary)] text-[13px] hover:text-white hover:translate-x-1 transition-all duration-200 no-underline">App Builder</a>
          </div>
        </div>

        {/* Bottom Footer row */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-[12px] font-medium">
            &copy; {new Date().getFullYear()} Love4Prompts. Download Free AI Prompts. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-[12px] font-medium text-white/30 hover:text-white/60 transition-colors no-underline">Privacy Policy</a>
            <a href="/terms" className="text-[12px] font-medium text-white/30 hover:text-white/60 transition-colors no-underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
