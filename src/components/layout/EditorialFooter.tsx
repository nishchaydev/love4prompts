import React from 'react';

export const EditorialFooter: React.FC = () => {
  return (
    <footer className="bg-[var(--color-bg-surface)] text-[var(--color-text)] w-full mt-auto pt-16 pb-10 px-5 sm:px-8 font-[Epilogue] relative overflow-hidden border-t border-[var(--color-border)]">
      {/* Scrolling Marquee */}
      <div className="absolute top-0 left-0 w-full bg-[var(--color-primary)] py-2 z-10 flex overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex font-[Anton] tracking-wide text-[13px] text-white uppercase">
          <span className="mx-6">SEE THE TREND ✷ BE THE TREND ✷ RECREATE VIRAL AI IMAGES ✷ </span>
          <span className="mx-6">SEE THE TREND ✷ BE THE TREND ✷ RECREATE VIRAL AI IMAGES ✷ </span>
          <span className="mx-6">SEE THE TREND ✷ BE THE TREND ✷ RECREATE VIRAL AI IMAGES ✷ </span>
          <span className="mx-6">SEE THE TREND ✷ BE THE TREND ✷ RECREATE VIRAL AI IMAGES ✷ </span>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-12 mt-8">
        {/* Logo & Description */}
        <div className="flex-1">
          <a href="/" className="font-[Anton] text-[28px] uppercase tracking-wide no-underline inline-block mb-4 leading-none">
            <span className="text-[var(--color-text)]">love4</span>
            <span className="text-[var(--color-primary)]">prompts</span>
          </a>
          <p className="text-[var(--color-text-muted)] max-w-[280px] text-[13px] leading-relaxed">
            The fastest way to recreate viral AI image trends. See it. Pick it. Become it.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 w-full md:w-auto">
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4 text-[12px] text-[var(--color-text-secondary)] uppercase tracking-wider">Tools</h3>
            <a href="/tools/prompt-enhancer" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Prompt Enhancer</a>
            <a href="/tools/prompt-maker" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Prompt Builder</a>
            <a href="/tools/image-to-prompt" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Image to Prompt</a>
            <a href="/extension" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Chrome Extension</a>
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold mb-4 text-[12px] text-[var(--color-text-secondary)] uppercase tracking-wider">Explore</h3>
            <a href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Trends</a>
            <a href="/library" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Library</a>
            <a href="/categories" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Categories</a>
            <a href="/about" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">About</a>
            <a href="/submit" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Submit a Trend</a>
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold mb-4 text-[12px] text-[var(--color-text-secondary)] uppercase tracking-wider">Socials</h3>
            <a href="https://www.instagram.com/love4prompts" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Twitter / X</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">GitHub</a>
          </div>

          <div className="flex flex-col">
            <h3 className="font-semibold mb-4 text-[12px] text-[var(--color-text-secondary)] uppercase tracking-wider">Legal</h3>
            <a href="/terms" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Terms of Service</a>
            <a href="/privacy" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Privacy Policy</a>
            <a href="/non-user-notice" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-2.5 text-[13px] transition-colors no-underline cursor-pointer">Non-user Notice</a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-[var(--color-border)] flex flex-col text-[var(--color-text-muted)] text-[11px]">
        <p className="mb-4 text-[var(--color-primary)]/60 font-semibold uppercase tracking-wider text-[10px]">
          Disclaimer: Human avatars and persons shown on this site are AI-generated and not real people.
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-mono">
            &copy; {new Date().getFullYear()} Love4Prompts
          </div>
          <div className="flex space-x-6">
            <a href="/terms" className="hover:text-[var(--color-text-secondary)] transition-colors no-underline cursor-pointer">Terms</a>
            <a href="/privacy" className="hover:text-[var(--color-text-secondary)] transition-colors no-underline cursor-pointer">Privacy</a>
            <a href="/non-user-notice" className="hover:text-[var(--color-text-secondary)] transition-colors no-underline cursor-pointer">Non-user Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
