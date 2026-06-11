import React from 'react';

export const SeoFooter: React.FC = () => {
  return (
    <footer className="bg-black text-white w-full mt-auto pt-[60px] pb-[40px] px-[20px] sm:px-[60px] font-['Inter'] relative overflow-hidden border-t-8 border-black">
      {/* Scrolling Marquee */}
      <div className="absolute top-0 left-0 w-full bg-[#FF6D87] border-b-4 border-black py-2 z-10 flex overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex font-black tracking-widest text-[14px] text-black uppercase">
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8 mb-12 sm:mb-16">
          {/* Column 1: Brand & Core */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
                LOVE<span className="text-[#FF6D87]">4</span>PROMPTS
              </span>
            </div>
            <p className="text-gray-400 font-bold text-[14px] leading-relaxed max-w-sm">
              The ultimate prompt toolkit for every AI. Access our daily updated library to discover and download free prompts for every use case.
            </p>
            <a 
              href="/dashboard" 
              className="inline-flex items-center bg-[#1482A3] text-black border-2 border-black font-black uppercase px-4 py-2 w-max hover:bg-[#FF6D87] hover:text-white transition-all shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] no-underline"
            >
              Manage Prompts 
            </a>
          </div>

          {/* Column 2: AI Tools */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-black text-[#FF6D87] text-[16px] uppercase tracking-widest mb-2">AI Tools</h3>
            <a href="/tools/prompt-enhancer" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Prompt Enhancer</a>
            <a href="/tools/prompt-maker" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Prompt Maker</a>
            <a href="/tools/image-to-prompt" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Image to Prompt</a>
            <a href="/tools" className="text-white bg-[#FF6D87] border-2 border-black w-max px-2 py-1 font-black text-[12px] uppercase mt-2 no-underline hover:bg-[#1482A3] transition-colors">All Tools</a>
          </div>

          {/* Column 3: Prompt Maker Tools */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-black text-[#FF6D87] text-[16px] uppercase tracking-widest mb-2">Makers</h3>
            <a href="/?tag=maker" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">AI Prompt Maker</a>
            <a href="/?tag=chatgpt-maker" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">ChatGPT Maker</a>
            <a href="/?tag=video-maker" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">AI Video Maker</a>
            <a href="/?tag=claude-maker" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Claude Maker</a>
            <a href="/?tag=sora-maker" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Sora Maker</a>
          </div>

          {/* Column 4: Visuals & Socials */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-black text-[#FF6D87] text-[16px] uppercase tracking-widest mb-2">Visuals</h3>
            <a href="/?tag=photo" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Photo Prompt</a>
            <a href="/?tag=ai-photo" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">AI Photo App</a>
            <a href="/linkedin-post-generator" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">LinkedIn Gen</a>
            <a href="/instagram-caption-generator" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Insta Caption Gen</a>
          </div>

          {/* Column 5: Legal */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-black text-[#FF6D87] text-[16px] uppercase tracking-widest mb-2">Legal</h3>
            <a href="/terms" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Terms of Service</a>
            <a href="/privacy" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Privacy Policy</a>
            <a href="/non-user-notice" className="text-[#ccc] text-[14px] font-bold hover:text-[#1482A3] hover:translate-x-1 transition-all duration-200 no-underline">Non-user Notice</a>
            <a href="/404" className="text-[#FFD166] text-[14px] font-black uppercase hover:text-[#FF6D87] hover:translate-x-1 transition-all duration-200 no-underline mt-2">Find Yourself</a>
          </div>
        </div>

        {/* Bottom Footer row */}
        <div className="border-t-4 border-[#333] pt-6 flex flex-col gap-4">
          <p className="text-[#FF6D87] font-bold uppercase tracking-widest text-[10px] sm:text-[12px]">
            Disclaimer: Human avatars and persons shown on this site are AI-generated and not real people.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#888] font-bold text-[12px] uppercase">
              &copy; {new Date().getFullYear()} LOVE4PROMPTS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
