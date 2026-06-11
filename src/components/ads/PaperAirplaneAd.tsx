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
  const [modalType, setModalType] = useState<'ad' | 'prompt' | null>(null);
  const [randomPrompt, setRandomPrompt] = useState("");
  const [yPos, setYPos] = useState(100);

  useEffect(() => {
    const startFlight = () => {
      setYPos(Math.floor(Math.random() * (window.innerHeight / 2)) + 50);
      setIsVisible(true);
    };
    
    // Initial delay before first flight
    const timer = setTimeout(startFlight, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Scale up the plane, then show the modal
    setTimeout(() => {
      setIsAnimating(false);
      setIsVisible(false);
      
      if (Math.random() > 0.3) {
        setModalType('ad');
      } else {
        setRandomPrompt(CRAZY_PROMPTS[Math.floor(Math.random() * CRAZY_PROMPTS.length)]);
        setModalType('prompt');
      }
    }, 800); // Wait for the zoom animation
  };

  const closeAd = () => {
    setModalType(null);
    setTimeout(() => {
      setYPos(Math.floor(Math.random() * (window.innerHeight / 2)) + 50);
      setIsVisible(true);
    }, 15000);
  };

  return (
    <AnimatePresence>
      {/* The Flying Airplane */}
      {isVisible && !modalType && (
        <motion.div 
          className="fixed z-[90] cursor-pointer"
          initial={{ x: '-100px', y: yPos, scale: 1, rotate: 0 }}
          animate={
            isAnimating 
              ? { x: '50vw', y: '50vh', scale: 8, rotate: 45, opacity: 0 } 
              : { x: '120vw', y: yPos, scale: 1, rotate: [0, -5, 5, 0] }
          }
          transition={
            isAnimating
              ? { duration: 0.8, ease: easeInOutCubic }
              : { 
                  x: { duration: 12, ease: "linear" },
                  rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
          }
          onClick={handleClick}
          whileHover={!isAnimating ? { scale: 1.15, rotate: -15, transition: { duration: 0.15, ease: "easeOut" } } : {}}
          whileTap={!isAnimating ? { scale: 0.95 } : {}}
          onAnimationComplete={(definition) => {
            if (definition && typeof definition === 'object' && 'x' in definition && definition.x === '120vw') {
              // Reset if it flew past screen
              setIsVisible(false);
              setTimeout(() => {
                setYPos(Math.floor(Math.random() * (window.innerHeight / 2)) + 50);
                setIsVisible(true);
              }, 10000);
            }
          }}
          style={{ x: '-100px', y: yPos }} // Fallback
        >
          <div className="relative group">
            {/* Proper SVG Paper Airplane */}
            <svg 
              width="60" 
              height="60" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-black drop-shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white p-2 border-[2px] border-black rounded-xl"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="white" />
            </svg>
            {!isAnimating && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity duration-150">
                Catch me!
              </div>
            )}
          </div>
        </motion.div>
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
