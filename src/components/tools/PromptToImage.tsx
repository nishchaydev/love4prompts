import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, Check, ImagePlus, Download } from 'lucide-react';
import { useModKey } from '../../lib/useOS';
import { saveToHistory, PromptHistory } from './PromptHistory';
import { ExampleChips } from './ExampleChips';
import { springs } from '../../lib/motion';

const EXAMPLE_PROMPTS = [
  'A magical forest with bioluminescent mushrooms at twilight',
  'Cyberpunk samurai standing in neon-lit rain, cinematic',
  'Minimalist product photo of a perfume bottle on marble',
  'Oil painting of a coastal village at sunset, impressionist style',
];

export const PromptToImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const modKey = useModKey();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImageError(false);
    setImageUrl(null);

    const encodedPrompt = encodeURIComponent(prompt.trim());
    const newImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    const img = new window.Image();
    let timeoutId: ReturnType<typeof setTimeout>;

    img.onload = () => {
      clearTimeout(timeoutId);
      setImageUrl(newImageUrl);
      setImageError(false);
      setIsLoading(false);
      saveToHistory({ input: prompt, output: newImageUrl, tool: 'prompt-to-image' });
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      setImageError(true);
      setIsLoading(false);
    };

    timeoutId = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      setImageError(true);
      setIsLoading(false);
    }, 30000);

    img.src = newImageUrl;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = prompt;
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

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8 relative z-10">
      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.gentle}
        className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-6 sm:p-8"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="prompt-input" className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                Describe the image you want
              </label>
              <PromptHistory toolSlug="prompt-to-image" onReuse={(e) => setPrompt(e.input)} />
            </div>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="A futuristic cyberpunk city at night with neon lights reflecting on wet streets..."
              className="w-full bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-4 text-[13.5px] text-black focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder-black/30 resize-none font-medium leading-relaxed"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
          </div>

          {/* Example chips */}
          {!prompt && !isLoading && (
            <ExampleChips examples={EXAMPLE_PROMPTS} onSelect={setPrompt} disabled={isLoading} />
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={springs.bouncy}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="w-full h-11 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-xs tracking-wider uppercase shadow-[0_4px_25px_var(--color-primary-glow)] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" />
                Generate Image
                <kbd className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/10 border border-white/15 text-black/50">{modKey}+⏎</kbd>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {(imageUrl || isLoading) && !imageError && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.gentle, delay: 0.1 }}
            className="mt-6 bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-success-green)] uppercase">
                Generated Image
              </span>
              {imageUrl && (
                <motion.a
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={springs.bouncy}
                  href={imageUrl}
                  download="generated-image.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#FF6D87]/20 hover:shadow-[4px_4px_0_#FF6D87] flex items-center justify-center text-[var(--color-text-muted)] hover:text-black border-[3px] border-black"
                  title="Download image"
                >
                  <Download className="w-4 h-4" />
                </motion.a>
              )}
            </div>

            <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-xl overflow-hidden border-[3px] border-black bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3 text-[var(--color-text-muted)]">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                  <span className="text-xs font-medium">Creating your image...</span>
                </div>
              ) : imageUrl ? (
                <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />
              ) : null}
            </div>

            {/* Used prompt */}
            {imageUrl && !isLoading && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                    Used Prompt
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={springs.bouncy}
                    onClick={handleCopy}
                    className="w-7 h-7 rounded-lg bg-black/40 hover:bg-black/70 flex items-center justify-center text-black border border-black/20 border-[2px] cursor-pointer"
                    title="Copy prompt"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-[var(--color-success-green)]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </motion.button>
                </div>
                <div className="bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-4 font-mono text-[13px] text-black/80 leading-relaxed select-text">
                  {prompt}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {imageError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-sm text-center"
        >
          Failed to generate image. Please try again with a different prompt.
        </motion.div>
      )}
    </div>
  );
};
