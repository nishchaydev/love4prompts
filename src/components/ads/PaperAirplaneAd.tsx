import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CRAZY_PROMPTS = [
  "Write a rap battle between a toaster and a microwave.",
  "Design a startup idea using only emojis.",
  "Explain quantum physics like I'm a 5-year-old medieval knight.",
  "Describe the taste of the color blue without using food metaphors."
];

// Easing token: --ease-out-quart (from references)
const easeOutQuart: [number, number, number, number] = [0.165, 0.84, 0.44, 1];
// Easing token: --ease-in-out-cubic (from references)
const easeInOutCubic: [number, number, number, number] = [0.645, 0.045, 0.355, 1];

export const PaperAirplaneAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalType, setModalType] = useState<'ad' | 'prompt' | null>(null);
  const [randomPrompt, setRandomPrompt] = useState("");
  const [pathData, setPathData] = useState<{ path: string, landX: number, landY: number, rotate: number } | null>(null);

  useEffect(() => {
    // Generate flight path on client to avoid hydration issues
    const w = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Decide landing spot
    const rand = Math.random();
    let landX, landY, rotate;

    if (rand < 0.35) {
      // Land Left
      landX = 40;
      landY = Math.random() * (h - 300) + 150;
      rotate = 15;
    } else if (rand < 0.7) {
      // Land Right
      landX = w - 120;
      landY = Math.random() * (h - 300) + 150;
      rotate = -15;
    } else {
      // Land Bottom
      landX = Math.random() * (w - 300) + 150;
      landY = h - 140;
      rotate = 0;
    }

    // Bezier curve: Start right offscreen -> swoop left -> swoop right -> land
    const startX = w + 150;
    const startY = h * 0.1;
    const cp1x = -w * 0.5; // pull far left
    const cp1y = h * 0.9;
    const cp2x = w * 1.2;  // pull back right
    const cp2y = h * 0.3;

    const p = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${landX} ${landY}`;
    setPathData({ path: p, landX, landY, rotate });

    // Start animation loop
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);

      // Flight duration is 12 seconds for the longer path
      setTimeout(() => {
        setIsAnimating(false);
      }, 12000);

    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    // Only clickable when landed
    if (isAnimating || !isVisible) return;

    // Hide plane, show modal
    setIsVisible(false);

    if (Math.random() > 0.4) {
      setModalType('ad');
    } else {
      setRandomPrompt(CRAZY_PROMPTS[Math.floor(Math.random() * CRAZY_PROMPTS.length)]);
      setModalType('prompt');
    }
  };

  const closeAd = () => {
    setModalType(null);
    // Restart flight after some time
    setTimeout(() => {
      // Regenerate path
      const w = window.innerWidth;
      const h = window.innerHeight;
      const rand = Math.random();
      let landX, landY, rotate;
      if (rand < 0.35) { landX = 40; landY = Math.random() * (h - 300) + 150; rotate = 15; }
    setTimeout(() => {
      startFlight();
    }, 4000);
  };

  return (
    <AnimatePresence>
      {/* 1. Screen Flash Easter Egg */}
      {clickEffect === 'flash' && (
        <motion.div 
          className="fixed inset-0 z-[200] bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        />
      )}

      {/* 2. Shaking Egg & Pop */}
      {(clickEffect === 'egg' || clickEffect === 'pop') && (
        <motion.div 
          className="fixed z-[150] pointer-events-none text-6xl"
          style={{ left: eggPos.x - 30, top: eggPos.y - 30 }}
          initial={{ scale: 0, rotate: -180 }}
          animate={
            clickEffect === 'egg' 
              ? { scale: 1, rotate: [0, -15, 15, -15, 15, 0] } 
              : { scale: 3, opacity: 0, filter: 'blur(10px)' }
          }
          transition={
            clickEffect === 'egg' 
              ? { scale: { type: 'spring', bounce: 0.6 }, rotate: { delay: 0.3, duration: 0.5, repeat: Infinity } }
              : { duration: 0.4, ease: "easeOut" }
          }
        >
          {clickEffect === 'egg' ? '🥚' : '💥'}
        </motion.div>
      )}

      {isVisible && !modalType && pathData && !clickEffect && (
        <>
          {/* Dashed Trail of Air */}
          <div className="fixed inset-0 pointer-events-none z-[80]">
            <svg className="w-full h-full" style={{ overflow: 'visible' }}>
              <motion.path 
                d={pathData.path}
                fill="none"
                stroke="#FF6D87"
                strokeWidth="2"
                strokeDasharray="8 8"
                strokeLinecap="round"
                style={{ pathLength, opacity: trailOpacity }} // Driven by MotionValue!
              />
            </svg>
          </div>

          {/* The Flying Airplane */}
          <motion.div 
            className="fixed top-0 left-0 z-[90] cursor-pointer"
            style={{ 
              offsetPath: `path('${pathData.path}')`,
              offsetRotate: 'auto', // Perfectly aligns tangent to path
              offsetDistance: offsetDistance, // Driven by MotionValue!
              willChange: 'offset-distance, transform'
            } as any}
            onClick={handleClick}
            whileHover={!isAnimating ? { scale: 1.15 } : {}}
            whileTap={!isAnimating ? { scale: 0.95 } : {}}
          >
            <motion.div
               animate={!isAnimating 
                 ? { y: [0, -10, 0], rotate: [0, 2, -2, 0] } 
                 : { 
                     rotate: [0, 15, -15, 0], // Aerodynamic turbulence wobble
                     scale: [0.85, 1.15, 0.95, 1] // Z-axis depth scaling
                   }
               }
               transition={!isAnimating 
                 ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                 : { duration: 4, repeat: Infinity, ease: "easeInOut" }
               }
               className="relative"
            >
              {/* Shadow Layer */}
              <svg 
                width="80" height="80" viewBox="0 0 32 32" fill="none" 
                stroke="#FF6D87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                className="absolute top-[3px] left-[3px]"
              >
                {/* rotate(45) mathematically corrects the SVG coordinate system so the tip natively points 0 deg (Right) */}
                <g transform="rotate(45 16 16)">
                  <g transform="translate(4, 4)">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </g>
                  <line x1="6" y1="18" x2="2" y2="22"></line>
                  <line x1="12" y1="24" x2="8" y2="28"></line>
                </g>
              </svg>
              {/* Main SVG */}
              <svg 
                width="80" height="80" viewBox="0 0 32 32" fill="none" 
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                className="relative text-[#1a1a1a]"
              >
                <g transform="rotate(45 16 16)">
                  <g transform="translate(4, 4)">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </g>
                  <line x1="6" y1="18" x2="2" y2="22"></line>
                  <line x1="12" y1="24" x2="8" y2="28"></line>
                </g>
              </svg>
            </motion.div>
          </motion.div>

          {/* Catch Me Text - Wingman Text */}
          <motion.div 
            className="fixed top-0 left-0 z-[95] pointer-events-none"
            style={{ 
              offsetPath: `path('${pathData.path}')`,
              offsetRotate: '0deg', // Always upright
              offsetDistance: offsetDistance, // Driven by MotionValue!
              willChange: 'offset-distance, transform'
            } as any}
          >
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest whitespace-nowrap shadow-[4px_4px_0_#FF6D87] border-2 border-black animate-pulse"
            >
              Catch me!
            </motion.div>
          </motion.div>
        </>
      )}

      {/* The Modal */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            className="bg-[#FAEFED] border-[4px] border-black p-8 max-w-md w-full shadow-[12px_12px_0_rgba(0,0,0,1)] relative"
            initial={{ scale: 0.95, opacity: 0, rotateX: -20, y: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease: easeOutQuart }}
            style={{ perspective: 1000, transformStyle: "preserve-3d" }}
          >
            <motion.button 
              onClick={closeAd}
              className="absolute -top-4 -right-4 bg-[#FF6D87] text-white border-[3px] border-black w-10 h-10 flex items-center justify-center font-black text-xl hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-colors"
              whileHover={{ scale: 1.05, x: -2, y: -2 }}
              whileTap={{ scale: 0.95, x: 0, y: 0 }}
            >
              X
            </motion.button>
            <div className="text-center">
              {modalType === 'ad' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.24, ease: easeOutQuart }}
                >
                  <span className="bg-black text-white text-xs font-bold px-2 py-1 uppercase tracking-widest mb-4 inline-block">Sponsored</span>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-4">🚀 Level Up Your Prompts</h2>
                  <p className="text-gray-800 font-medium mb-6">
                    Unlock the ultimate AI toolkit today. Save hours of work with our premium curated templates.
                  </p>
                  
                  <div className="w-full h-[200px] bg-white border-[3px] border-black mb-6 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-500"></div>
                    <span className="relative z-10 text-xl font-bold bg-[#FF6D87] text-white px-4 py-2 border-2 border-black rotate-[-5deg]">Limited Time Offer</span>
                  </div>

                  <motion.button 
                    className="w-full bg-[#FF6D87] text-white border-[3px] border-black py-3 font-bold text-lg shadow-[4px_4px_0_rgba(0,0,0,1)] transition-shadow"
                    whileHover={{ scale: 1.02, y: -2, x: -2, boxShadow: '6px 6px 0 rgba(0,0,0,1)' }}
                    whileTap={{ scale: 0.98, y: 0, x: 0, boxShadow: '2px 2px 0 rgba(0,0,0,1)' }}
                  >
                    Claim Offer Now
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.24, ease: easeOutQuart }}
                >
                  <span className="bg-[#1482A3] text-white text-xs font-bold px-2 py-1 uppercase tracking-widest mb-4 inline-block">Surprise Prompt!</span>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-[#FF6D87]">You Caught It!</h2>
                  <div className="bg-white border-[3px] border-black p-6 mb-6 transform rotate-2">
                    <p className="text-xl font-bold text-black">{randomPrompt}</p>
                  </div>
                  <motion.button 
                    className="w-full bg-black text-white border-[3px] border-black py-3 font-bold text-lg shadow-[4px_4px_0_#FF6D87] transition-shadow"
                    whileHover={{ scale: 1.02, y: -2, x: -2, boxShadow: '6px 6px 0 #FF6D87' }}
                    whileTap={{ scale: 0.98, y: 0, x: 0, boxShadow: '2px 2px 0 #FF6D87' }}
                  >
                    Try this prompt
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
