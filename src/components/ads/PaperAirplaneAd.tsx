import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const springs = {
  snappy: { type: "spring", stiffness: 400, damping: 25 },
  bouncy: { type: "spring", stiffness: 300, damping: 15 },
  gentle: { type: "spring", stiffness: 100, damping: 20 },
  floaty: { type: "spring", stiffness: 50, damping: 10 },
};

const CRAZY_PROMPTS = [
  "Write a rap battle between a toaster and a microwave.",
  "Design a startup idea using only emojis.",
  "Explain quantum physics like I'm a 5-year-old medieval knight.",
  "Describe the taste of the color blue without using food metaphors."
];

export const PaperAirplaneAd = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalType, setModalType] = useState<'ad' | 'prompt' | null>(null);
  const [randomPrompt, setRandomPrompt] = useState("");
  const [pathData, setPathData] = useState<{ path: string, landX: number, landY: number } | null>(null);

  const [clickEffect, setClickEffect] = useState<'flash' | 'egg' | 'pop' | null>(null);
  const [eggPos, setEggPos] = useState({ x: 0, y: 0 });

  const flightProgress = useMotionValue(0);
  const offsetDistance = useTransform(flightProgress, [0, 1], ["0%", "100%"]);

  const generatePath = () => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Start slightly off-screen left
    const startX = -100;
    const startY = h * 0.3;

    // Target landing zone in the upper-middle of the screen to avoid footer
    const endX = w * 0.5 + (Math.random() * w * 0.3 - w * 0.15);
    const endY = h * 0.4 + (Math.random() * h * 0.2 - h * 0.1);

    // Keep the entire flight path in the upper 60% of the screen
    const thrustX = w * 0.15;
    const thrustY = h * 0.15;

    const peak1X = w * 0.35;
    const peak1Y = h * 0.2;

    const diveX = w * 0.65;
    const diveY = h * 0.55;

    const recoveryX = w * 0.85;
    const recoveryY = h * 0.35;

    // Smooth flight path
    const p = `M ${startX} ${startY} Q ${thrustX} ${thrustY} ${peak1X} ${peak1Y} T ${diveX} ${diveY} T ${recoveryX} ${recoveryY} T ${endX} ${endY}`;

    return { path: p, landX: endX, landY: endY };
  };

  const flightTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const startFlight = (delayMs: number = 2000) => {
    setPathData(generatePath());
    flightProgress.set(0);

    if (flightTimerRef.current) clearTimeout(flightTimerRef.current);

    flightTimerRef.current = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);

      // Fast but smooth flight duration
      animate(flightProgress, 1, {
        duration: 8,
        ease: "easeInOut",
        onComplete: () => setIsAnimating(false)
      });

    }, delayMs);
  };

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check localStorage for the last flight time to prevent spamming on page switches
    const lastFlight = localStorage.getItem('lastAirplaneFlight');
    const now = Date.now();
    const cooldownMs = 300000; // 5 minute cooldown between flights across pages to make it a rare Easter egg

    if (!lastFlight || now - parseInt(lastFlight, 10) > cooldownMs) {
      // It's time for a flight! Set a random initial delay (10-30s)
      const initialDelay = Math.random() * 20000 + 10000;
      localStorage.setItem('lastAirplaneFlight', (now + initialDelay).toString());
      startFlight(initialDelay);
    } else {
      // Schedule the next flight after the cooldown expires
      const timeUntilNext = cooldownMs - (now - parseInt(lastFlight, 10));
      flightTimerRef.current = setTimeout(() => {
        localStorage.setItem('lastAirplaneFlight', Date.now().toString());
        startFlight(0);
      }, timeUntilNext);
    }

    return () => {
      if (flightTimerRef.current) clearTimeout(flightTimerRef.current);
      effectTimeoutsRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isVisible) return;

    setEggPos({ x: e.clientX, y: e.clientY });

    setIsVisible(false);
    setIsAnimating(false);
    setClickEffect('flash');
    if (flightTimerRef.current) clearTimeout(flightTimerRef.current);
    
    // Clear any existing effect timeouts
    effectTimeoutsRef.current.forEach(clearTimeout);
    effectTimeoutsRef.current = [];

    const t1 = setTimeout(() => {
      setClickEffect('egg');
      const t2 = setTimeout(() => {
        setClickEffect('pop');
        const t3 = setTimeout(() => {
          setClickEffect(null);
          if (Math.random() > 0.4) {
            setModalType('ad');
          } else {
            setRandomPrompt(CRAZY_PROMPTS[Math.floor(Math.random() * CRAZY_PROMPTS.length)]);
            setModalType('prompt');
          }
        }, 500);
        effectTimeoutsRef.current.push(t3);
      }, 1000);
      effectTimeoutsRef.current.push(t2);
    }, 150);
    effectTimeoutsRef.current.push(t1);
  };

  const closeAd = () => {
    setModalType(null);
    // After closing, schedule the next flight with a long delay (e.g. 2-3 minutes)
    const nextDelay = Math.random() * 60000 + 120000;
    localStorage.setItem('lastAirplaneFlight', (Date.now() + nextDelay - 60000).toString());
    startFlight(nextDelay);
  };

  return (
    <AnimatePresence>
      {/* 1. Screen Flash */}
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
          className="fixed z-[150] pointer-events-none text-9xl flex items-center justify-center w-32 h-32"
          style={{ left: eggPos.x - 64, top: eggPos.y - 64 }}
          initial={{ scale: 0 }}
          animate={
            clickEffect === 'egg'
              ? { scale: 1, rotate: [0, -15, 15, -15, 15, 0] }
              : { scale: 2, opacity: 0, filter: 'blur(10px)' }
          }
          transition={
            clickEffect === 'egg'
              ? { scale: springs.bouncy, rotate: { delay: 0.2, duration: 0.4, repeat: Infinity } }
              : { duration: 0.4, ease: "easeOut" }
          }
        >
          {clickEffect === 'egg' ? '🥚' : '💥'}
        </motion.div>
      )}

      {isVisible && !modalType && pathData && !clickEffect && (
        <>
          {/* The Flying Airplane */}
          <motion.div
            className="fixed top-0 left-0 z-[90] cursor-pointer"
            style={{
              offsetPath: `path('${pathData.path}')`,
              offsetRotate: 'auto',
              offsetDistance: offsetDistance,
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
                  rotate: [0, 10, -10, 0],
                  scale: [0.9, 1.1, 0.95, 1]
                }
              }
              transition={!isAnimating
                ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative"
            >
              <svg
                width="80" height="80" viewBox="0 0 32 32" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="relative text-[#1a1a1a] drop-shadow-[4px_4px_0_#FF6D87]"
              >
                {/* 67.5deg rotation perfectly aligns the tip to the x-axis for offsetRotate: auto */}
                <g transform="rotate(67.5 16 16)">
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

          {/* Catch Me Text */}
          <motion.div
            className="fixed top-0 left-0 z-[95] pointer-events-none"
            style={{
              offsetPath: `path('${pathData.path}')`,
              offsetRotate: '0deg', // Always upright
              offsetDistance: offsetDistance,
              willChange: 'offset-distance, transform'
            } as any}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest whitespace-nowrap shadow-[4px_4px_0_#FF6D87] border-2 border-black animate-pulse"
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
            className="bg-[#FAEFED] border-[4px] border-black p-8 max-w-md w-full shadow-[12px_12px_0_rgba(0,0,0,1)] relative max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={springs.bouncy}
          >
            <motion.button
              onClick={closeAd}
              className="absolute top-2 right-2 bg-[#FF6D87] text-white border-[3px] border-black w-10 h-10 flex items-center justify-center font-black text-xl cursor-pointer"
              whileHover={{ scale: 1.05, x: -2, y: -2, boxShadow: '4px 4px 0 rgba(0,0,0,1)' }}
              whileTap={{ scale: 0.95, x: 0, y: 0, boxShadow: '0px 0px 0 rgba(0,0,0,1)' }}
            >
              X
            </motion.button>
            <div className="text-center mt-4">
              {modalType === 'ad' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, ...springs.gentle }}
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
                    className="w-full bg-[#FF6D87] text-white border-[3px] border-black py-3 font-bold text-lg shadow-[4px_4px_0_rgba(0,0,0,1)] cursor-pointer"
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
                  transition={{ delay: 0.1, ...springs.gentle }}
                >
                  <span className="bg-[#1482A3] text-white text-xs font-bold px-2 py-1 uppercase tracking-widest mb-4 inline-block">Surprise Prompt!</span>
                  <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-[#FF6D87]">You Caught It!</h2>
                  <div className="bg-white border-[3px] border-black p-6 mb-6 transform rotate-2">
                    <p className="text-xl font-bold text-black">{randomPrompt}</p>
                  </div>
                  <motion.button
                    className="w-full bg-black text-white border-[3px] border-black py-3 font-bold text-lg shadow-[4px_4px_0_#FF6D87] cursor-pointer"
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
