import React from 'react';

export const SeoFooter: React.FC = () => {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background-card)] py-16 mt-auto">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-16">
          {/* Column 0: AI Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-wider mb-2">AI Tools</h3>
            <a href="/tools/prompt-enhancer" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Prompt Enhancer</a>
            <a href="/tools/prompt-maker" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Prompt Maker</a>
            <a href="/tools/prompt-translator" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Prompt Translator</a>
            <a href="/tools/image-to-prompt" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Image to Prompt</a>
            <a href="/tools" className="text-[var(--color-primary)] font-semibold text-sm hover:underline mt-1">All Tools &rarr;</a>
          </div>

          {/* Column 1: Brand & Core */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-[var(--color-text-primary)] text-lg mb-2">Viral Prompt App</h3>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              The ultimate ai prompt app. Access our daily updated library to download free viral prompts for every use case.
            </p>
            <a href="/dashboard/submit" className="text-[var(--color-primary)] font-semibold text-sm hover:underline mt-2">Submit Your Reel &rarr;</a>
          </div>

          {/* Column 2: Prompt Maker Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-wider mb-2">Prompt Maker</h3>
            <a href="/?tag=maker" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">AI Prompt Maker</a>
            <a href="/?tag=chatgpt-maker" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">ChatGPT Prompt Maker</a>
            <a href="/?tag=video-maker" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">AI Video Prompt Maker</a>
            <a href="/?tag=claude-maker" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Claude Prompt Maker</a>
            <a href="/?tag=sora-maker" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Sora Prompt Maker</a>
            <a href="/?tag=story-maker" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Story Prompt Maker</a>
          </div>

          {/* Column 3: Photo & Video Prompts */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-wider mb-2">Visual & Video</h3>
            <a href="/?tag=photo" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Photo Prompt App</a>
            <a href="/?tag=ai-photo" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">AI Photo Prompt App</a>
            <a href="/?tag=drawing" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Drawing Prompt App</a>
            <a href="/?tag=video" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">AI Video Generation from Text Prompt App</a>
          </div>

          {/* Column 4: Writing & Journaling */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-wider mb-2">Writing & Daily</h3>
            <a href="/?tag=writing" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Writing Prompt App</a>
            <a href="/?tag=journal" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Journal Prompt App</a>
            <a href="/?tag=daily" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Daily Prompt App</a>
          </div>

          {/* Column 5: Platforms & Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-[var(--color-text-primary)] text-sm uppercase tracking-wider mb-2">Platforms</h3>
            <a href="/?tag=chatgpt" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">ChatGPT Prompt App</a>
            <a href="/?tag=gemini" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">Gemini Prompt App</a>
            <a href="/?tag=builder" className="text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors">AI Prompt App Builder</a>
          </div>
        </div>

        {/* Bottom Footer row */}
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--color-text-muted)] text-sm">
            &copy; {new Date().getFullYear()} Love4Prompts. Download Free AI Prompts.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
