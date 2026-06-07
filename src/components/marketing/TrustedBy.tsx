import React from 'react';

export const TrustedBy: React.FC = () => {
  return (
    <div className="w-full mt-16 pt-8 border-t border-white/[0.03]">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6 font-mono text-center">
        Trusted by teams at
      </p>
      
      {/* Logos grid */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-35 max-w-[900px] mx-auto px-4">
        {/* WSJ */}
        <div className="h-4 flex items-center justify-center font-serif text-[13px] font-extrabold tracking-widest text-white whitespace-nowrap">
          THE WALL STREET JOURNAL.
        </div>

        {/* Shopify */}
        <div className="flex items-center gap-1.5 text-white font-bold text-[14px]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4.5 h-4.5 text-emerald-400">
            <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
          </svg>
          <span className="font-sans tracking-tight">shopify</span>
        </div>

        {/* Stanford */}
        <div className="h-4 flex items-center justify-center font-serif text-[14px] font-bold text-white tracking-tight">
          Stanford University
        </div>

        {/* Adobe */}
        <div className="flex items-center gap-1.5 text-white font-bold text-[13px]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500">
            <path d="M14.3 2H22v20h-3.4l-3-6.5h-5.2l-3 6.5H2L9.7 2h4.6zm-1.8 8.6L12 9.5l-.5 1.1-1.6 3.4h4.2l-1.6-3.4z" />
          </svg>
          <span className="font-sans uppercase tracking-wider">Adobe</span>
        </div>

        {/* Visa */}
        <div className="h-4 flex items-center justify-center font-sans italic text-[17px] font-black text-white tracking-tighter">
          VISA
        </div>

        {/* Accenture */}
        <div className="flex items-center text-white font-bold text-[13.5px] tracking-tighter">
          accenture<span className="text-purple-400 font-extrabold ml-0.5">&gt;</span>
        </div>

        {/* Cisco */}
        <div className="flex flex-col items-center justify-center text-white">
          <div className="flex gap-[2px] items-end h-[8px] mb-[1px]">
            <span className="w-[1.5px] h-[4px] bg-white rounded-full"></span>
            <span className="w-[1.5px] h-[6px] bg-white rounded-full"></span>
            <span className="w-[1.5px] h-[8px] bg-white rounded-full"></span>
            <span className="w-[1.5px] h-[6px] bg-white rounded-full"></span>
            <span className="w-[1.5px] h-[4px] bg-white rounded-full"></span>
          </div>
          <span className="font-sans text-[11.5px] font-bold tracking-tight">CISCO</span>
        </div>

        {/* PwC */}
        <div className="h-4 flex items-center justify-center font-sans text-[14px] font-extrabold text-white tracking-widest uppercase">
          pwc
        </div>
      </div>
    </div>
  );
};
