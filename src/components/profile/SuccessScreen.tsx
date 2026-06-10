import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const SuccessScreen: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
  return (
    <div className="min-h-screen flex flex-col font-['Inter'] selection:bg-black selection:text-white antialiased bg-[#f9f9f9] text-[#1a1c1c] absolute inset-0 z-50">
      {/* Top Navigation */}
      <header className="w-full border-b border-[#cfc4c5] bg-[#f9f9f9] px-[40px] py-[24px] flex justify-between items-center z-50 sticky top-0">
        <div className="flex items-center gap-[24px]">
          <span className="font-bold text-black uppercase tracking-tighter" style={{ fontSize: 'clamp(24px, 4vw, 32px)', lineHeight: 0.9 }}>
            love<span className="text-[#FF6D87]">4</span>prompts
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          <button 
            onClick={onRestart}
            className="ed-label-caps text-[12px] uppercase tracking-widest text-[#4c4546] hover:text-black transition-colors font-bold"
          >
            Close
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-[1px] bg-[#cfc4c5]">
        {/* Left Spacing / Structure */}
        <div className="hidden md:block md:col-span-1 lg:col-span-2 bg-[#f9f9f9]"></div>
        
        {/* Content Center */}
        <div className="col-span-1 md:col-span-10 lg:col-span-8 bg-[#f9f9f9] flex flex-col items-center justify-center py-[80px] px-[40px] min-h-[70vh]">
          <div className="text-center mb-[80px] w-full max-w-4xl flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-black mb-[24px]" />
            <h1 className="font-bold text-black uppercase break-words tracking-tighter" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.9 }}>
              SUBMISSION ARCHIVED
            </h1>
            <p className="text-[14px] leading-[20px] text-[#4c4546] mt-[24px] uppercase tracking-wider max-w-xl mx-auto font-bold">
              Reference Sequence #884-X-Omega has been successfully compiled and committed to the main ledger.
            </p>
          </div>

          {/* Clinical Preview Card */}
          <div className="w-full max-w-2xl border border-[#cfc4c5] bg-[#f9f9f9] mb-[80px] relative overflow-hidden group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#cfc4c5]">
              {/* Image Placeholder */}
              <div className="aspect-square w-full bg-[#e2e2e2] relative">
                <div className="absolute inset-0 bg-[#c6c6c6] mix-blend-multiply opacity-20"></div>
                <img 
                  alt="Submitted Prompt Render Preview" 
                  className="w-full h-full object-cover filter grayscale contrast-125" 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
                />
                {/* Hover Overlay Content */}
                <div className="absolute inset-0 bg-[#f9f9f9]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[24px] flex flex-col justify-end z-20">
                  <span className="ed-label-caps text-[10px] text-black mb-2 tracking-widest font-bold">METADATA</span>
                  <span className="ed-label-caps text-[12px] text-[#4c4546] block tracking-widest font-bold">SEED: 49201</span>
                  <span className="ed-label-caps text-[12px] text-[#4c4546] block tracking-widest font-bold">CFG: 7.5</span>
                </div>
              </div>
              
              {/* Text Formula */}
              <div className="bg-[#f9f9f9] p-[40px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-[24px] border-b border-[#cfc4c5] pb-[8px]">
                    <span className="ed-label-caps text-[10px] text-black tracking-widest font-bold">FORMULA</span>
                    <span className="w-2 h-2 bg-black"></span>
                  </div>
                  <p className="text-[14px] leading-relaxed text-black font-medium">
                    "Neo-brutalist monolithic structure, stark high-contrast lighting, sharp geometric shadows, clinical pristine white void, architectural curation..."
                  </p>
                </div>
                <div className="mt-[24px]">
                  <span className="inline-block px-2 py-1 border border-[#cfc4c5] ed-label-caps text-[10px] text-[#4c4546] mr-2 mb-2 tracking-widest font-bold">ARCHITECTURE</span>
                  <span className="inline-block px-2 py-1 border border-[#cfc4c5] ed-label-caps text-[10px] text-[#4c4546] mr-2 mb-2 tracking-widest font-bold">MINIMAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-[24px] w-full max-w-lg justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex-1 py-4 px-6 border-b-2 border-black ed-label-caps text-[12px] text-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200 text-center font-bold cursor-pointer"
            >
              VIEW IN LIBRARY
            </button>
            <button 
              onClick={onRestart}
              className="flex-1 py-4 px-6 border border-[#cfc4c5] ed-label-caps text-[12px] text-[#4c4546] uppercase tracking-widest hover:border-black hover:text-black transition-colors duration-200 text-center font-bold cursor-pointer"
            >
              SUBMIT ANOTHER
            </button>
          </div>
        </div>

        {/* Right Spacing / Structure */}
        <div className="hidden md:block md:col-span-1 lg:col-span-2 bg-[#f9f9f9]"></div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#cfc4c5] bg-[#f9f9f9] grid grid-cols-1 md:grid-cols-2 gap-[24px] px-[40px] py-[24px] mt-auto">
        <div className="font-bold text-black uppercase tracking-tighter" style={{ fontSize: 'clamp(24px, 4vw, 32px)', lineHeight: 1 }}>
          love<span className="text-[#FF6D87]">4</span>prompts
        </div>
        <div className="flex flex-col md:flex-row md:justify-end gap-[24px] md:items-center">
          <span className="ed-label-caps text-[10px] text-[#4c4546] tracking-widest font-bold">© 2024 LOVE4PROMPTS. ARCHITECTURAL RIGOR APPLIED TO LANGUAGE.</span>
          <div className="flex gap-[8px]">
            <a className="ed-label-caps text-[10px] text-[#4c4546] hover:text-[#FF6D87] transition-colors duration-200 uppercase tracking-widest font-bold" href="#">PRIVACY</a>
            <a className="ed-label-caps text-[10px] text-[#4c4546] hover:text-[#FF6D87] transition-colors duration-200 uppercase tracking-widest font-bold" href="#">TERMS</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
