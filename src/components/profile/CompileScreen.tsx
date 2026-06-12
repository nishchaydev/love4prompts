import React, { useState, useEffect } from 'react';

interface CompileScreenProps {
  onComplete: () => void;
}

export const CompileScreen: React.FC<CompileScreenProps> = ({ onComplete }) => {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const allLines = [
    "> injecting stylistic parameters... OK",
    "> resolving dependencies... OK",
    "> mapping visual tokens... [14ms] OK",
    "> finalizing structural mesh... WAIT"
  ];

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < allLines.length) {
        setTerminalLines(prev => {
          const newLines = [...prev, allLines[lineIndex]];
          if (newLines.length > 5) return newLines.slice(newLines.length - 5);
          return newLines;
        });
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => onComplete(), 500);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-transparent text-[#1a1c1c] font-['Inter'] antialiased min-h-screen flex flex-col selection:bg-black selection:text-white pt-[20px]">

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col justify-center items-center px-[40px] py-[80px] w-full relative overflow-hidden">
        {/* Compiling Container */}
        <div className="w-full max-w-5xl border-2 border-black bg-white flex flex-col relative z-10 shadow-[8px_8px_0_#000]">
          {/* Header Bar */}
          <div className="flex justify-between items-center border-b-2 border-black px-[24px] py-[8px] bg-black text-white">
            <span className="ed-label-caps text-[10px] tracking-widest font-bold">SYSTEM.PROCESS.AWAIT</span>
            <span className="ed-label-caps text-[10px] tracking-widest font-bold animate-[blink_1s_step-end_infinite]">_</span>
          </div>

          {/* Content Area */}
          <div className="p-[40px] flex flex-col gap-[24px]">
            <div className="flex items-center gap-[16px]">
              <div className="w-8 h-8 rounded-full border-[4px] border-black border-t-transparent animate-spin"></div>
              <h1 className="text-black uppercase tracking-tighter relative inline-block animate-[pulse_2s_ease-in-out_infinite]" 
                  style={{ fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 900, lineHeight: 0.9 }}>
                COMPILING...
              </h1>
            </div>

            {/* Massive Progress Bar with Stripes */}
            <div className="w-full h-16 border-2 border-black relative bg-[#eeeeee] overflow-hidden mt-8 group">
              <div 
                className="absolute top-0 left-0 h-full bg-[#1482A3] w-full origin-left"
                style={{
                  animation: 'progress 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                }}
              ></div>
              <div 
                className="absolute inset-0 opacity-[0.15]"
                style={{ 
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
                  backgroundSize: '28px 28px',
                  animation: 'stripes 1s linear infinite'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-white ed-label-caps text-[12px] font-black tracking-widest z-10 mix-blend-difference">
                PROCESSING ARCHIVE DATA
              </div>
            </div>

            {/* Terminal Output Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mt-12 border-t border-black pt-[24px]">
              <div className="flex flex-col gap-2">
                <span className="ed-label-caps text-[10px] font-bold tracking-widest text-[#7e7576]">CURRENT OPERATION</span>
                <span className="font-['Inter'] text-[12px] font-bold tracking-wider text-black uppercase">PROTOCOL 005 // ENCODING</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="ed-label-caps text-[10px] font-bold tracking-widest text-[#7e7576]">STATUS</span>
                <span className="font-['Inter'] text-[12px] font-bold tracking-wider text-black uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-black inline-block animate-[blink_1s_step-end_infinite]"></span>
                  VALIDATING SYNTAX
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="ed-label-caps text-[10px] font-bold tracking-widest text-[#7e7576]">NEXT STEP</span>
                <span className="font-['Inter'] text-[12px] font-bold tracking-wider text-[#cfc4c5] uppercase">GENERATING PREVIEW</span>
              </div>
            </div>

            {/* Fake Terminal Lines */}
            <div className="mt-8 ed-label-caps text-[10px] font-bold tracking-widest text-[#7e7576] leading-relaxed bg-[#f3f3f3] p-[8px] border border-[#cfc4c5] h-32 overflow-hidden flex flex-col justify-end uppercase relative shadow-inner">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FF6D87]/20 animate-[scanline_2s_linear_infinite]"></div>
              <div>&gt; initiating sequence alpha... <span className="text-[#1482A3]">OK</span></div>
              <div>&gt; parsing token clusters... [240ms] <span className="text-[#1482A3]">OK</span></div>
              <div>&gt; building structural nodes... [1.2s] <span className="text-[#1482A3]">OK</span></div>
              {terminalLines.map((line, i) => (
                <div key={i} className="animate-[slideUp_0.2s_ease-out]">{line}</div>
              ))}
              <div className="text-black">&gt; awaiting compiler resolution <span className="animate-[blink_1s_step-end_infinite]">_</span></div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          15% { transform: scaleX(0.1); }
          50% { transform: scaleX(0.6); }
          80% { transform: scaleX(0.8); }
          100% { transform: scaleX(1); }
        }
        @keyframes stripes {
          0% { background-position: 0 0; }
          100% { background-position: 28px 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(120px); opacity: 0; }
        }
      `}} />
    </div>
  );
};
