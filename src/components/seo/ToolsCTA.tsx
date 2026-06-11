import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const ToolsCTA: React.FC = () => {
  return (
    <div className="w-full bg-[#FF6D87] border-[4px] border-black shadow-[10px_10px_0_rgba(0,0,0,1)] rounded-[2rem] p-6 md:p-10 relative overflow-hidden mt-8 max-w-5xl mx-auto group">
      
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
        
        {/* Content (Left) */}
        <div className="flex flex-col gap-4 w-full lg:w-[55%] text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full font-bold tracking-widest text-[10px] uppercase w-fit">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            UNLIMITED ACCESS
          </div>
          
          <h2 className="text-[2.5rem] md:text-5xl lg:text-[52px] font-black tracking-tighter text-black uppercase leading-[1]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Ready to<br />supercharge<br />your<br />workflows?
          </h2>
          
          <p className="text-[#1a1a1a] font-medium text-base md:text-lg max-w-sm mt-2 leading-relaxed">
            Join the love4prompts community to get unlimited access to all AI tools, save your prompts, and explore the largest library of community-generated templates.
          </p>
        </div>

        {/* Action button (Right) */}
        <div className="w-full lg:w-[45%] shrink-0 flex justify-center lg:justify-end items-center">
          <a 
            href="/login" 
            className="magnetic-btn group/btn relative inline-flex items-center justify-center gap-6 bg-black text-white px-8 py-5 md:px-8 md:py-6 rounded-2xl font-bold tracking-wide uppercase transition-transform duration-300 w-full md:w-auto"
          >
            <div className="flex flex-col items-center text-center text-lg md:text-xl leading-tight">
              <span className="relative z-10">Join Community</span>
              <span className="relative z-10">Free</span>
            </div>
            <ArrowRight className="w-6 h-6 md:w-7 md:h-7 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-2 shrink-0" />
          </a>
        </div>
        
      </div>
    </div>
  );
};
