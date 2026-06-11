import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CRAZY_PROMPTS = [
  "Write a rap battle between a toaster and a microwave.",
  "Design a startup idea using only emojis.",
  "Explain quantum physics like I'm a 5-year-old medieval knight.",
  "Describe the taste of the color blue without using food metaphors."
];

// Easing token: --ease-out-quart (from references)
const easeOutQuart = [0.165, 0.84, 0.44, 1];
// Easing token: --ease-in-out-cubic (from references)
const easeInOutCubic = [0.645, 0.045, 0.355, 1];

export const PaperAirplaneAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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

    // Bezier curve control points
    const startX = -150;
    const startY = h * 0.2;
    const cp1x = w * 0.8;
    const cp1y = h * 0.9;
    const cp2x = w * 0.2;
    const cp2y = h * 0.1;
    
    const p = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${landX} ${landY}`;
    setPathData({ path: p, landX, landY, rotate });
    
    // Start animation loop
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Flight duration is 4 seconds
      setTimeout(() => {
        setIsAnimating(false);
      }, 4000);
      
    }, 3000);
    
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
      else if (rand < 0.7) { landX = w - 120; landY = Math.random() * (h - 300) + 150; rotate = -15; }
      else { landX = Math.random() * (w - 300) + 150; landY = h - 140; rotate = 0; }
      
      const p = `M ${-150} ${h * 0.2} C ${w * 0.8} ${h * 0.9}, ${w * 0.2} ${h * 0.1}, ${landX} ${landY}`;
      setPathData({ path: p, landX, landY, rotate });
      
      setIsVisible(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 4000);
    }, 8000);
  };

  return (
    <AnimatePresence>
      {isVisible && !modalType && pathData && (
        <>
          {/* Dashed Trail */}
          <div className="fixed inset-0 pointer-events-none z-[80]">
            <svg className="w-full h-full" style={{ overflow: 'visible' }}>
              <motion.path 
                d={pathData.path}
                fill="none"
                stroke="#ccc"
                strokeWidth="3"
                strokeDasharray="10 10"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isAnimating ? 0.6 : 0.2 }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
            </svg>
          </div>

          {/* The Flying Airplane */}
          <motion.div 
            className="fixed top-0 left-0 z-[90] cursor-pointer"
            style={{ 
              offsetPath: `path('${pathData.path}')`,
              offsetRotate: 'auto 45deg' 
            } as any}
            initial={{ offsetDistance: '0%', opacity: 0 }}
            animate={{ offsetDistance: '100%', opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            onClick={handleClick}
            whileHover={!isAnimating ? { scale: 1.15 } : {}}
            whileTap={!isAnimating ? { scale: 0.95 } : {}}
          >
            <motion.div
               animate={!isAnimating ? { y: [0, -10, 0] } : {}}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="relative group"
            >
              <img 
                src="/paper_airplane_3d.png" 
                alt="3D Paper Airplane"
                className="w-[80px] h-[80px] object-contain drop-shadow-[4px_4px_0_rgba(0,0,0,1)] hover:drop-shadow-[8px_8px_0_rgba(255,109,135,1)] transition-all duration-300"
                style={{ filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,1))' }}
              />
              {!isAnimating && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-pulse">
                  Catch me!
                </div>
              )}
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
