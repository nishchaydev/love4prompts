import React, { useState } from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CompileScreen } from './CompileScreen';
import { SuccessScreen } from './SuccessScreen';
import { supabase } from '../../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export const DashboardClient: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [screenState, setScreenState] = useState<'submit' | 'compile' | 'success'>('submit');
  const [promptText, setPromptText] = useState('');
  const [engine, setEngine] = useState('MIDJOURNEY V6.0');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [activeTags, setActiveTags] = useState<string[]>(['STRUCTURAL']);
  const [styleSearch, setStyleSearch] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const protocolLines = [
    "PROTOCOL 004 //",
    "SEQUENCE INITIALIZED.",
    "AWAITING STRUCTURAL",
    "PROMPT INPUT."
  ];
  const [displayedProtocolLines, setDisplayedProtocolLines] = useState<string[]>(['', '', '', '']);

  const handleTyping = (text: string, setter: (val: string) => void) => {
    setter(text);
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
  };

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && localStorage.getItem('demo_auth') === 'true') {
        setSession({ user: { email: 'demo@love4prompts.com', user_metadata: { user_name: 'Demo User' } } } as any);
      } else {
        setSession(session);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && localStorage.getItem('demo_auth') === 'true') {
        setSession({ user: { email: 'demo@love4prompts.com', user_metadata: { user_name: 'Demo User' } } } as any);
      } else {
        setSession(session);
      }
    });
    
    const draft = localStorage.getItem('draft_prompt');
    if (draft) {
      setPromptText(draft);
      localStorage.removeItem('draft_prompt');
    }

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const fullText = "/// TYPE YOUR IMAGINATION HERE...";
    let i = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (!isDeleting) {
        setPlaceholderText(fullText.substring(0, i + 1));
        i++;
        if (i === fullText.length) {
          isDeleting = true;
          clearInterval(timer);
          setTimeout(() => { timer = setInterval(tick, 60); }, 2000);
        }
      } else {
        setPlaceholderText(fullText.substring(0, i - 1));
        i--;
        if (i === 0) {
          isDeleting = false;
          clearInterval(timer);
          setTimeout(() => { timer = setInterval(tick, 60); }, 500);
        }
      }
    };

    const delay = setTimeout(() => {
      timer = setInterval(tick, 60);
    }, 1500);

    // Protocol Typing Animation
    let protoLineIdx = 0;
    let protoCharIdx = 0;
    let protoTimer: NodeJS.Timeout;
    let protoLineTimeout: NodeJS.Timeout; // Add timeout ref

    const typeProtoChar = () => {
      if (protoLineIdx >= protocolLines.length) return;

      const currentLineIdx = protoLineIdx;
      const currentCharIdx = protoCharIdx;

      setDisplayedProtocolLines(prev => {
        const newLines = [...prev];
        // Extra safety check
        if (protocolLines[currentLineIdx]) {
          newLines[currentLineIdx] = protocolLines[currentLineIdx].substring(0, currentCharIdx + 1);
        }
        return newLines;
      });

      protoCharIdx++;

      if (protoCharIdx >= protocolLines[protoLineIdx].length) {
        protoLineIdx++;
        protoCharIdx = 0;
        if (protoLineIdx < protocolLines.length) {
          clearInterval(protoTimer);
          protoLineTimeout = setTimeout(() => {
            protoTimer = setInterval(typeProtoChar, 40);
          }, 600); // Pause between lines
        } else {
          clearInterval(protoTimer);
        }
      }
    };

    const protoDelay = setTimeout(() => {
      protoTimer = setInterval(typeProtoChar, 40);
    }, 500);

    return () => {
      clearTimeout(delay);
      clearInterval(timer);
      clearTimeout(protoDelay);
      clearInterval(protoTimer);
      clearTimeout(protoLineTimeout);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  if (screenState === 'compile') {
    return <CompileScreen onComplete={() => setScreenState('success')} />;
  }

  if (screenState === 'success') {
    return <SuccessScreen onRestart={() => setScreenState('submit')} />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-['Inter'] pt-20">

      {/* Main Grid Layout */}
      <div className="relative z-10 container mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-12 border-l border-[#cfc4c5] min-h-[calc(100vh-80px)]">

        {/* Row 1: Left Spacer | Header */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 border-r border-[#cfc4c5] relative overflow-visible bg-transparent">
          <div className="p-8 sticky top-24 h-full flex flex-col justify-between">
            <div className="ed-label-caps text-[#4c4546] mt-4 min-h-[100px]">
              {displayedProtocolLines.map((line, i) => {
                const isActiveLine = line.length > 0 && (i === protocolLines.length - 1 || displayedProtocolLines[i + 1]?.length === 0);
                const isStart = i === 0 && line.length === 0;

                return (
                  <div key={i} className="min-h-[1.2em]">
                    {line}
                    {(isActiveLine || isStart) && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="inline-block w-2 h-3 bg-[#4c4546] ml-1 align-baseline"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {/* Rotated SUBMIT title reading bottom to top, T at top, centered in sidebar */}
            <h1
              className="absolute top-[200px] left-[20px] xl:left-[50px] text-[180px] lg:text-[240px] leading-[0.75] font-black tracking-tighter text-black uppercase opacity-[0.07] hover:opacity-[0.15] transition-opacity m-0 pointer-events-none z-0"
              style={{ transformOrigin: 'top left', transform: 'rotate(-90deg) translate(-100%, 0)' }}
            >
              SUBMIT
            </h1>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9 lg:col-span-10 flex flex-col gap-16 p-6 lg:p-16 pb-32">

          {/* SECTION 01: FORMULA */}
          <div className="flex flex-col gap-8">
            <div className="border-l-[4px] border-[#FF6D87] pl-[20px] sm:pl-[24px]">
              <div className="ed-label-caps text-[#4c4546] mb-[16px] tracking-[0.1em]">
                // 01.PROMPT.FORMULA
              </div>
              <h1 className="text-black tracking-tighter uppercase"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 900, lineHeight: 0.9 }}>
                PROMPT FORMULA<span className="text-[#FF6D87]">.</span>
              </h1>
            </div>
            <textarea
              value={promptText}
              onChange={(e) => handleTyping(e.target.value, setPromptText)}
              placeholder={placeholderText || "/// "}
              className={`w-full min-h-[300px] lg:min-h-[400px] border border-black bg-white p-8 font-mono text-sm lg:text-base outline-none transition-all duration-300 resize-y ${isTyping
                  ? 'shadow-[8px_8px_0_#FF6D87] -translate-y-1 -translate-x-1'
                  : 'shadow-[8px_8px_0_#cfc4c5] hover:shadow-[8px_8px_0_#FF6D87] hover:-translate-y-1 hover:-translate-x-1 focus:shadow-[8px_8px_0_#000] focus:-translate-y-1 focus:-translate-x-1'
                }`}
            />
          </div>

          {/* Bottom Split: REFERENCE & METADATA */}
          <div className="flex flex-col lg:flex-row gap-16">

            {/* SECTION 02: REFERENCE */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="border-l-[4px] border-[#FF6D87] pl-[20px] sm:pl-[24px]">
                <div className="ed-label-caps text-[#4c4546] mb-[16px] tracking-[0.1em]">
                  // 02.REFERENCE.IMAGE
                </div>
                <h2 className="text-black tracking-tighter uppercase"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, lineHeight: 0.9 }}>
                  REFERENCE<span className="text-[#FF6D87]">.</span>
                </h2>
              </div>

              <div className="w-full aspect-square border border-black shadow-[8px_8px_0_#cfc4c5] flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-[8px_8px_0_#FF6D87] hover:-translate-y-1 hover:-translate-x-1 cursor-pointer group relative">
                {/* Background T overlay (placeholder style from image) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                  <span className="text-[250px] font-black font-sans leading-none">T</span>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="bg-[#f0f0f0] p-4 group-hover:bg-[#e0e0e0] transition-colors border border-black">
                    <Upload className="w-6 h-6 text-black" />
                  </div>
                  <span className="ed-label-caps text-black text-[10px] tracking-widest font-bold">UPLOAD REFERENCE</span>
                </div>
              </div>
            </div>

            {/* SECTION 03: METADATA */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="border-l-[4px] border-[#FF6D87] pl-[20px] sm:pl-[24px]">
                <div className="ed-label-caps text-[#4c4546] mb-[16px] tracking-[0.1em]">
                  // 03.TARGET.METADATA
                </div>
                <h2 className="text-black tracking-tighter uppercase"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 900, lineHeight: 0.9 }}>
                  METADATA<span className="text-[#FF6D87]">.</span>
                </h2>
              </div>

              <div className="w-full bg-white border border-black p-8 shadow-[8px_8px_0_#cfc4c5] space-y-8 flex-1 transition-all duration-300 hover:shadow-[8px_8px_0_#FF6D87] hover:-translate-y-1 hover:-translate-x-1">
                {/* Target Engine */}
                <div className="flex flex-col gap-2">
                  <label className="ed-label-caps text-[10px] text-black font-bold uppercase tracking-widest">TARGET ENGINE</label>
                  <select
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full border border-black bg-transparent p-4 ed-label-caps text-xs uppercase outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer"
                  >
                    <option>MIDJOURNEY V6.0</option>
                    <option>DALL-E 3</option>
                    <option>STABLE DIFFUSION</option>
                    <option>FLUX</option>
                  </select>
                </div>

                {/* Aspect Ratio */}
                <div className="flex flex-col gap-2">
                  <label className="ed-label-caps text-[10px] text-black font-bold uppercase tracking-widest">ASPECT RATIO</label>
                  <div className="flex w-full border border-black">
                    {['16:9', '1:1', '9:16'].map(ratio => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`flex-1 py-3 ed-label-caps text-[11px] font-bold transition-colors border-r border-black last:border-r-0 ${aspectRatio === ratio ? 'bg-[#FF6D87] text-white' : 'bg-transparent text-black hover:bg-[#f0f0f0]'
                          }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Injectors */}
                <div className="flex flex-col gap-2">
                  <label className="ed-label-caps text-[10px] text-black font-bold uppercase tracking-widest">STYLE INJECTORS</label>
                  <input
                    type="text"
                    value={styleSearch}
                    onChange={(e) => handleTyping(e.target.value, setStyleSearch)}
                    placeholder="ADD TAGS..."
                    className={`w-full border bg-transparent p-4 ed-label-caps text-xs uppercase outline-none transition-colors duration-300 ${isTyping
                        ? 'border-[#FF6D87] shadow-[4px_4px_0_#FF6D87]'
                        : 'border-black focus:ring-2 focus:ring-black'
                      }`}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['NEO-BRUTALISM', 'CLINICAL', 'STRUCTURAL'].map(tag => (
                      <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`border px-2 py-1 ed-label-caps text-[9px] transition-colors cursor-pointer ${activeTags.includes(tag)
                            ? 'bg-[#FF6D87] border-[#FF6D87] text-white'
                            : 'border-black bg-transparent text-black hover:bg-black hover:text-white'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compile Button */}
          <div className="mt-8 pt-8 border-t-4 border-black">
            <button
              onClick={() => {
                if (!session) {
                  localStorage.setItem('draft_prompt', promptText);
                  window.location.href = '/login?redirect=/submit';
                  return;
                }
                setScreenState('compile');
              }}
              className="w-full flex items-center justify-between group cursor-pointer outline-none bg-black text-white p-8 hover:bg-[#FF6D87] transition-colors shadow-[8px_8px_0_#cfc4c5]"
            >
              <span className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">
                COMPILE
              </span>
              <ArrowRight className="w-10 h-10 lg:w-16 lg:h-16 group-hover:translate-x-4 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
