import React from 'react';

export const EditorialFooter: React.FC = () => {
  return (
    <footer className="bg-black text-white w-full mt-auto pt-[60px] pb-[40px] px-[20px] sm:px-[60px] font-['Inter'] relative overflow-hidden">
      {/* Scrolling Marquee */}
      <div className="absolute top-0 left-0 w-full bg-[#1482A3] border-b-4 border-black py-2 z-10 flex overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex font-black tracking-widest text-[14px] text-black uppercase">
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
          <span className="mx-4">MAKE YOUR EVERYDAY SIMPLE ✷ UNLOCK AI SUPERPOWERS ✷ CREATE FASTER ✷ </span>
        </div>
      </div>
      
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-12 mt-6">
        {/* Left Section - Logo */}
        <div className="flex-1">
          <a href="/" className="text-[32px] font-black tracking-tighter no-underline flex items-center mb-4 leading-none">
            {"love4prompts".split('').map((char, index) => (
              <span 
                key={index} 
                className={`inline-block transition-all duration-300 ease-out hover:-translate-y-1 ${
                  char === '4' ? 'text-[#FF6D87] hover:text-white' : 'text-white hover:text-[#FF6D87]'
                }`}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </a>
          <p className="text-[#888] max-w-[300px] text-[14px] leading-relaxed">
            Making your everyday simple with ready-to-use tools and prompts. No complex tech stuff.
          </p>
        </div>

        {/* Right Section - Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 w-full md:w-auto">
          {/* Column 1 */}
          <div className="flex flex-col">
            <h3 className="font-bold mb-4 text-[16px] text-[#FF6D87]">Get the tools</h3>
            <a href="/tools/prompt-enhancer" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Prompt Enhancer</a>
            <a href="/tools/prompt-maker" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Prompt Builder</a>
            <a href="/extension" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Chrome Extension</a>
            <a href="/tools/caption-maker" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Caption Maker</a>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            <h3 className="font-bold mb-4 text-[16px] text-[#FF6D87]">Quick links</h3>
            <a href="/" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Explore</a>
            <a href="/dashboard" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Dashboard</a>
            <a href="/submit" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Submit Prompt</a>
            <a href="/#library" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Library</a>
            <a href="/404" className="text-[#ccc] hover:text-[#FFD166] mb-3 text-[14px] font-black uppercase transition-colors no-underline">Find Yourself</a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col">
            <h3 className="font-bold mb-4 text-[16px] text-[#FF6D87]">Socials</h3>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Instagram</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">GitHub</a>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col">
            <h3 className="font-bold mb-4 text-[16px] text-[#FF6D87]">Legal</h3>
            <a href="/terms" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Terms of Service</a>
            <a href="/privacy" className="text-[#ccc] hover:text-[#FF6D87] mb-3 text-[14px] transition-colors no-underline">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-[60px] pt-[20px] border-t border-[#333] flex flex-col text-[#888] text-[12px]">
        <p className="mb-4 text-[#FF6D87] font-bold uppercase tracking-widest text-[10px] sm:text-[12px]">
          Disclaimer: Human avatars and persons shown on this site are AI-generated and not real people.
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} LOVE4PROMPTS
          </div>
          <div className="flex space-x-6">
            <a href="/terms" className="hover:text-white transition-colors no-underline">Terms of service</a>
            <a href="/privacy" className="hover:text-white transition-colors no-underline">Privacy policy</a>
            <a href="/non-user-notice" className="hover:text-white transition-colors no-underline">Non-user notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
