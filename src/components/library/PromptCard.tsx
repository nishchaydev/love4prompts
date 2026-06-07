import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Copy, Check, Share2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

export interface Prompt {
  id: string;
  /** Original prompt ID — set on duplicated items for infinite scroll */
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
  creator?: {
    name: string;
    avatar: string;
    handle: string;
  };
}

interface PromptCardProps {
  prompt: Prompt;
  isSaved?: boolean;
  onSave?: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, isSaved = false, onSave }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative w-full flex flex-col mb-6 break-inside-avoid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={`/prompt/${prompt.slug}`} className="block relative w-full overflow-hidden rounded-[20px] bg-[#120A24] border border-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.5)] group-hover:shadow-[0_8px_30px_var(--color-primary-glow)] transition-all duration-500 ease-out group-hover:border-[var(--color-primary)]/30">
        {prompt.image_url && !imageError ? (
          <div className="relative w-full min-h-[160px] bg-[#120A24] overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02] animate-pulse">
                <div className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
              </div>
            )}
            <img 
              src={prompt.image_url} 
              alt={prompt.title} 
              className={`w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-[#170E30] to-[#0A0118] border-b border-white/[0.03]">
            <span className="text-white/20 font-medium text-xs font-mono uppercase tracking-widest">No image</span>
          </div>
        )}
        
        {/* Overlay gradient for better icon visibility */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
        
        {/* Top actions */}
        <div className={`absolute top-3 right-3 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <button 
            onClick={(e) => { e.preventDefault(); onSave?.(prompt.id); }}
            className="px-4 py-2 rounded-full bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-hover)] flex items-center justify-center shadow-[0_0_15px_var(--color-primary-glow)] transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Save prompt"
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className={`absolute bottom-3 left-3 right-3 flex justify-between items-center transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full text-sm font-bold hover:bg-black/80 hover:border-white/20 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-[var(--color-success-green)]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
          
          <button 
            onClick={(e) => { e.preventDefault(); }}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/80 hover:border-white/20 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
            aria-label="Share prompt"
          >
             <Share2 className="w-4 h-4" />
          </button>
        </div>
      </a>

      {/* Meta data section */}
      <div className="pt-3 px-1">
        <h3 className="text-[14px] font-semibold text-white leading-[1.3] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
          {prompt.title}
        </h3>
        
        {prompt.creator ? (
          <div className="flex items-center gap-2 mt-2">
            <img src={prompt.creator.avatar} alt={prompt.creator.name} className="w-6 h-6 rounded-full object-cover border border-white/10" />
            <span className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">{prompt.creator.name}</span>
          </div>
        ) : (
          <p className="text-[12px] text-gray-500 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary-glow)]"></span>
            {prompt.copy_count ? prompt.copy_count.toLocaleString() : prompt.save_count.toLocaleString()} copies
          </p>
        )}
      </div>
    </motion.div>
  );
};
