import React, { useState } from 'react';
import { CopyableOutput } from './CopyableOutput';

export const PromptToImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    // Use pollinations.ai for free, keyless image generation
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const newImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setImageUrl(newImageUrl);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="bg-[var(--color-background-card)] rounded-[24px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        <div className="space-y-6">
          <div>
            <label htmlFor="prompt-input" className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              Describe the image you want to generate
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cyberpunk city at night with neon lights..."
              className="w-full h-32 bg-[var(--color-background-elevated)] border border-white/[0.08] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-transparent transition-all placeholder:text-[var(--color-text-muted)] resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[var(--color-primary)] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#cc001f] transition-all hover:shadow-[0_0_20px_var(--color-primary-glow)] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                Generate Image
              </>
            )}
          </button>
        </div>
      </div>

      {imageUrl && !isLoading && (
        <div className="bg-[var(--color-background-card)] rounded-[24px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-fade-in-up">
          <h3 className="text-xl font-bold text-white mb-6">Generated Image</h3>
          <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />
          </div>
          
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Used Prompt</h4>
            <CopyableOutput text={prompt} />
          </div>
        </div>
      )}
    </div>
  );
};
