import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Copy, Check, Share2 } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';
import { springs } from '../../lib/motion';

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
  created_at?: string;
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
  const [imageLoaded, setImageLoaded] = useState(false);

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
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={springs.gentle}
      className="group relative w-full flex flex-col mb-6 break-inside-avoid"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.a 
        href={`/prompt/${prompt.slug}`} 
        whileHover={{ y: -8, rotate: -2, boxShadow: "12px 12px 0px #FF6D87" }}
        whileTap={{ scale: 0.95, y: 0, rotate: 0, boxShadow: "4px 4px 0px #000000" }}
        transition={springs.bouncy}
        className="block relative w-full overflow-hidden bg-[#FAEFED] border-4 border-black shadow-[6px_6px_0px_#000000] transition-colors duration-300"
      >
        {prompt.image_url && !imageError ? (
          <div className="relative w-full min-h-[160px] bg-white overflow-hidden">
            <img 
              src={optimizedUrl} 
              alt={prompt.title} 
              width={400}
              height={300}
              className="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:scale-105"
              loading={isAboveFold ? "eager" : "lazy"}
              {...(isAboveFold ? { fetchPriority: "high" } as any : {})}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full aspect-[3/4] flex items-center justify-center bg-gray-100 border-b-4 border-black">
            <span className="text-black/40 font-black text-xs font-mono uppercase tracking-widest">No image</span>
          </div>
        )}
        
        {/* Overlay gradient for better icon visibility */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
        
        {/* Top actions */}
        <div className={`absolute top-3 right-3 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
          <button 
            onClick={(e) => { e.preventDefault(); onSave?.(prompt.id); }}
            className="px-4 py-2 bg-[#FF6D87] text-black border-2 border-black font-black uppercase hover:bg-[#1482A3] hover:text-white transition-all duration-300 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] focus:outline-none focus:ring-2 focus:ring-black"
            aria-label={isSaved ? "Remove from saved prompts" : "Save prompt"}
            aria-pressed={isSaved}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Bottom Actions */}
        <div className={`absolute bottom-3 left-3 right-3 flex justify-between items-center transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <button
            onClick={handleCopy}
            aria-label="Copy Prompt"
            className="flex items-center gap-2 px-4 py-2.5 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full text-sm font-bold hover:bg-black/80 hover:border-white/20 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FF6D87]"
          >
            {copied ? <Check className="w-4 h-4 text-[var(--color-success-green)]" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
          
          <button 
            onClick={(e) => { e.preventDefault(); }}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/80 hover:border-white/20 transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FF6D87]"
            aria-label="Share prompt"
          >
             <Share2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </motion.a>

      {/* Meta data section */}
      <div className="pt-3 px-1">
        <h3 className="text-[16px] font-black text-black leading-[1.3] line-clamp-2 mb-2 group-hover:text-[#FF6D87] transition-colors duration-300">
          {prompt.title}
        </h3>
        
        {prompt.creator ? (
          <div className="flex items-center gap-2 mt-2">
            <img src={prompt.creator.avatar} alt={prompt.creator.name} className="w-6 h-6 object-cover border-2 border-black" width={24} height={24} />
            <span className="text-[13px] font-bold text-gray-700 hover:text-black transition-colors cursor-pointer">{prompt.creator.name}</span>
          </div>
        ) : (
          <p className="text-[12px] text-gray-500 font-bold flex items-center gap-1.5 uppercase">
            <span className="w-2 h-2 bg-[#1482A3] border border-black shadow-[1px_1px_0px_#000]"></span>
            {prompt.copy_count ? prompt.copy_count.toLocaleString() : prompt.save_count.toLocaleString()} copies
          </p>
        )}
      </div>
    </motion.div>
  );
};
