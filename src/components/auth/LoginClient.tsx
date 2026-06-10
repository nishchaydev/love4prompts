import React, { useState, useEffect } from 'react';
import { Mail, KeyRound, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginClient: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('/dashboard');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-['Inter'] antialiased flex flex-col relative overflow-hidden selection:bg-black selection:text-white">
      {/* Background Massive Text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span 
          className="text-[#e8e8e8] font-bold tracking-tighter" 
          style={{ fontSize: 'clamp(100px, 25vw, 400px)', lineHeight: 0.8 }}
        >
          ARCHIVE
        </span>
      </div>

      {/* Header */}
      <header className="w-full flex justify-between items-center px-[40px] py-[24px] z-10 border-b border-[#cfc4c5]">
        <div className="ed-label-caps text-[10px] tracking-widest font-bold">
          SYS.LOGIN
        </div>
        <div className="font-bold tracking-tighter" style={{ fontSize: '24px', lineHeight: 1 }}>
          love<span className="text-[#FF6D87]">4</span>prompts
        </div>
        <div className="ed-label-caps text-[10px] tracking-widest font-bold">
          V.1.0
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center z-10 p-[24px]">
        <div className="w-full max-w-[500px] border border-black bg-[#f9f9f9] flex flex-col relative shadow-[8px_8px_0_#cfc4c5]">
          {/* Header */}
          <div className="p-[40px] border-b border-black">
            <h1 className="text-[48px] font-bold uppercase tracking-tighter leading-none mb-2">
              ACCESS
            </h1>
            <p className="ed-label-caps text-[10px] tracking-widest font-bold text-[#4c4546]">
              SECURE TERMINAL AUTHENTICATION
            </p>
          </div>

          {/* Form */}
          <form 
            className="p-[40px] flex flex-col gap-[24px]"
            onSubmit={(e) => { 
              e.preventDefault(); 
              localStorage.setItem('demo_auth', 'true');
              window.location.href = redirectUrl; 
            }}
          >
            {/* Identifier */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="ed-label-caps text-[10px] tracking-widest font-bold">IDENTIFIER</label>
                <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576]">REQ</span>
              </div>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-[#7e7576]" />
                <input 
                  type="email" 
                  defaultValue="demo@love4prompts.com"
                  placeholder="user@love4prompts.com"
                  className="w-full border border-black bg-white py-4 pl-12 pr-4 font-['Inter'] text-[14px] text-black placeholder:text-[#cfc4c5] focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>
            </div>

            {/* Credential */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="ed-label-caps text-[10px] tracking-widest font-bold">CREDENTIAL</label>
                <span className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576]">REQ</span>
              </div>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-4 w-4 h-4 text-[#7e7576]" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  defaultValue="demo_password"
                  placeholder="••••••••"
                  className="w-full border border-black bg-white py-4 pl-12 pr-12 font-['Inter'] text-[14px] text-black placeholder:text-[#cfc4c5] focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[#7e7576] hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-black text-white py-4 px-6 flex items-center justify-center gap-2 hover:bg-[#FF6D87] transition-colors duration-300 mt-4 group"
            >
              <span className="ed-label-caps text-[12px] tracking-widest font-bold">AUTHORIZE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Links */}
          <div className="p-[24px] border-t border-black flex justify-between items-center bg-[#f3f3f3]">
            <a href="#" className="ed-label-caps text-[10px] tracking-widest font-bold hover:text-[#FF6D87] transition-colors">
              REQUEST ACCESS
            </a>
            <a href="/recovery" className="ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576] hover:text-[#FF6D87] transition-colors">
              FORGOT CREDENTIAL?
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#cfc4c5] bg-[#f9f9f9] flex flex-col md:flex-row justify-between items-center px-[40px] py-[24px] z-10 gap-4">
        <div className="ed-label-caps text-[10px] tracking-widest font-bold text-[#4c4546]">
          ©2024 LOVE4PROMPTS. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-[24px] ed-label-caps text-[10px] tracking-widest font-bold text-[#7e7576]">
          <a href="#" className="hover:text-black transition-colors">TERMS</a>
          <a href="#" className="hover:text-black transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-black transition-colors">COLOPHON</a>
          <a href="#" className="hover:text-black transition-colors">CONTACT</a>
        </div>
      </footer>
    </div>
  );
};
