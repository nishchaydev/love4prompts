import React, { useState } from 'react';
import { Copy, Check, Flame, Share2, Wand2 } from 'lucide-react';

export interface Prompt {
  id: string;
  realId?: string;
  slug: string;
  title: string;
  prompt_text: string;
  image_url: string | null;
  tags: string[];
  model: string;
  style: string;
  view_count: number;
  save_count: number;
  copy_count?: number;
  created_at?: string;
  category?: string;
  subcategory?: string;
  creator?: {
    name: string;
    avatar: string;
    handle: string;
  } | null;
}

interface PromptCardProps {
  prompt: Prompt;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  index?: number;
}

const getOptimizedImageUrl = (url: string | null): string => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('w', '400');
      parsed.searchParams.set('q', '65');
      if (!parsed.searchParams.has('auto')) {
        parsed.searchParams.set('auto', 'format');
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, isSaved = false, onSave, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const optimizedUrl = getOptimizedImageUrl(prompt.image_url);
  const isAboveFold = index !== undefined && index < 6;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="group relative w-full flex flex-col mb-4 break-inside-avoid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a 
        href={`/prompt/${prompt.slug}`} 
        className="block relative w-full overflow-hidden rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] transition-all duration-300 no-underline cursor-pointer group-hover:border-[var(--color-border-hover)] group-hover:shadow-[0_0_24px_rgba(225,29,72,0.08)]"
      >
        {/* Image */}
        {prompt.image_url && !imageError ? (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4', minHeight: '180px' }}>
            <img 
              src={optimizedUrl} 
              alt={prompt.title} 
              width={400}
              height={533}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading={isAboveFold ? "eager" : "lazy"}
              {...(isAboveFold ? { fetchPriority: "high" } as any : {})}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center bg-[var(--color-bg-surface-hover)]" style={{ aspectRatio: '3/4' }}>
            <span className="text-[var(--color-text-muted)] text-xs font-mono uppercase tracking-widest">No image</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-2xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}></div>
        
        {/* Create Me CTA (Primary action on hover) */}
        <div className={`absolute top-3 right-3 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-[12px] font-bold shadow-[0_4px_16px_var(--color-primary-glow)] cursor-pointer">
            <Flame className="w-3.5 h-3.5" />
            Create Me
          </span>
        </div>

        {/* Bottom Actions */}
        <div className={`absolute bottom-3 left-3 right-3 flex justify-between items-center transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <button
            onClick={handleCopy}
            aria-label="Copy Prompt"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-black/50 border border-white/15 text-white rounded-full text-[12px] font-semibold hover:bg-black/70 transition-all duration-200 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          <div className="flex gap-1.5">
            <a 
              href={`/tools/prompt-enhancer?q=${encodeURIComponent(prompt.prompt_text)}`}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-black/50 border border-white/15 text-white flex items-center justify-center hover:bg-[var(--color-accent)]/30 hover:border-[var(--color-accent)]/40 transition-all duration-200 cursor-pointer"
              aria-label="Enhance prompt"
              title="1-Click Enhance"
            >
               <Wand2 className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <button 
              onClick={(e) => { e.preventDefault(); }}
              className="w-9 h-9 rounded-full bg-black/50 border border-white/15 text-white flex items-center justify-center hover:bg-black/70 transition-all duration-200 cursor-pointer"
              aria-label="Share prompt"
            >
               <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Category badge */}
        {prompt.category && (
          <div className="absolute top-3 left-3">
            <span className="badge-pill !bg-black/40 !border-white/15 !text-white/90 text-[10px]">
              {prompt.category}
            </span>
          </div>
        )}
      </a>

      {/* Meta */}
      <div className="pt-2.5 px-0.5">
        <h3 className="text-[14px] font-semibold text-[var(--color-text)] leading-snug line-clamp-2 mb-1.5 group-hover:text-[var(--color-primary)] transition-colors duration-200 font-[Epilogue]">
          {prompt.title}
        </h3>
        
        {prompt.creator ? (
          <div className="flex items-center gap-2 mt-1">
            <img src={prompt.creator.avatar} alt={prompt.creator.name} className="w-5 h-5 rounded-full object-cover" width={20} height={20} />
            <span className="text-[12px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer font-[Epilogue]">{prompt.creator.name}</span>
          </div>
        ) : (
          <p className="text-[11px] text-[var(--color-text-muted)] font-medium flex items-center gap-1.5 font-[Epilogue]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
            {prompt.copy_count ? prompt.copy_count.toLocaleString() : prompt.save_count.toLocaleString()} copies
          </p>
        )}
      </div>
    </div>
  );
};
