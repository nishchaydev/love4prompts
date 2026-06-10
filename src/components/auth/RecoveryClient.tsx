import React from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';

export const RecoveryClient: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-['Inter'] antialiased flex flex-col relative overflow-hidden selection:bg-black selection:text-white">
      {/* Header */}
      <header className="w-full flex justify-center items-center py-[80px] z-10">
        <div className="font-bold tracking-tighter uppercase" style={{ fontSize: 'clamp(48px, 8vw, 120px)', lineHeight: 0.9 }}>
          love<span className="text-[#FF6D87]">4</span>prompts
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-start justify-center z-10 p-[24px]">
        <div className="w-full max-w-[500px] border border-black bg-[#f9f9f9] flex flex-col relative shadow-[8px_8px_0_#cfc4c5]">
          
          {/* Form */}
          <form 
            className="p-[40px] flex flex-col gap-[32px]"
            onSubmit={(e) => { e.preventDefault(); window.location.href = '/login'; }}
          >
            {/* Box Header */}
            <div className="flex justify-between items-start border-b border-[#cfc4c5] pb-[24px]">
              <div>
                <h1 className="text-[48px] font-bold uppercase tracking-tighter leading-none mb-2">
                  RECOVERY
                </h1>
                <p className="ed-label-caps text-[10px] tracking-widest font-bold text-[#4c4546]">
                  CREDENTIAL RESET PROTOCOL
                </p>
              </div>
              <div className="bg-[#FF6D87] p-2 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Identifier */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="ed-label-caps text-[10px] tracking-widest font-bold">IDENTIFIER</label>
                <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#cfc4c5]">EMAIL/ID</span>
              </div>
              <input 
                type="email" 
                placeholder="user@love4prompts.com"
                className="w-full border border-[#cfc4c5] bg-transparent py-4 px-4 font-mono text-[14px] text-black placeholder:text-[#cfc4c5] focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-transparent text-black border border-transparent py-4 px-6 flex items-center justify-between hover:border-black transition-colors duration-300 group"
            >
              <span className="ed-label-caps text-[12px] tracking-widest font-bold">INITIATE RECOVERY</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Return Link */}
            <a 
              href="/login" 
              className="w-full text-center ed-label-caps text-[10px] tracking-widest font-bold text-[#4c4546] hover:text-black transition-colors py-4"
            >
              RETURN TO AUTHENTICATION
            </a>

            {/* System Note */}
            <div className="border-t border-[#cfc4c5] pt-[24px] text-center">
              <p className="ed-label-caps text-[8px] tracking-widest font-bold text-[#7e7576] uppercase leading-relaxed">
                SYSTEM NOTE: PROTOCOL RESET WILL INVALIDATE ACTIVE SESSIONS.
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex justify-center items-center py-[40px] z-10">
        <div className="ed-label-caps text-[10px] tracking-widest font-bold text-[#cfc4c5]">
          SECURE TERMINAL // V.1.0.0
        </div>
      </footer>
    </div>
  );
};
