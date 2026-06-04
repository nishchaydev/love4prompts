import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';

export const MouseGlow: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isClicking, setIsClicking] = useState(false);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const [hasMouse, setHasMouse] = useState(false);
  
  // Spring config for smooth trailing effect
  const springConfig = { damping: 40, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Enable the effect on PCs (large screens) or devices with a physical mouse
    const checkMouse = () => {
      const isLargeScreen = window.innerWidth >= 768;
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setHasMouse(isLargeScreen || hasFinePointer);
    };
    checkMouse();
    window.addEventListener('resize', checkMouse);

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth < 768) {
      return () => window.removeEventListener('resize', checkMouse);
    }

    // Initial center position so it doesn't snap from top-left on first move
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newClick = { id: Date.now(), x: e.clientX, y: e.clientY };
      setClicks(prev => [...prev, newClick]);
      
      // Cleanup the ripple after animation completes
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== newClick.id));
      }, 800);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('resize', checkMouse);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  if (!hasMouse) return null;

  // Use framer-motion template to update CSS without React re-renders for max performance
  // Make the glow tighter and brighter when clicking to simulate energy
  const glowSize = isClicking ? 400 : 800;
  const glowOpacity = isClicking ? 0.7 : 0.4;
  const background = useMotionTemplate`radial-gradient(${glowSize}px circle at ${smoothX}px ${smoothY}px, var(--color-primary-glow), transparent 70%)`;

  return (
    <>
      {/* Primary Ambient Glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 mix-blend-screen transition-all duration-300"
        style={{ background, opacity: glowOpacity }}
      />
      
      {/* Custom Trailing Cursor Ring */}
      <motion.div 
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-8 h-8 rounded-full border-[1.5px] border-[var(--color-primary)] mix-blend-screen shadow-[0_0_10px_var(--color-primary-glow)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.6 : 1,
          opacity: isClicking ? 1 : 0.6
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Click Ripples */}
      <AnimatePresence>
        {clicks.map(click => (
          <motion.div
            key={click.id}
            initial={{ 
              opacity: 0.8, 
              scale: 0.2,
              x: click.x,
              y: click.y,
              translateX: "-50%",
              translateY: "-50%"
            }}
            animate={{ 
              opacity: 0, 
              scale: 2.5,
              x: click.x,
              y: click.y,
              translateX: "-50%",
              translateY: "-50%"
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed top-0 left-0 z-[9998] w-[80px] h-[80px] rounded-full border-2 border-[var(--color-primary)] mix-blend-screen shadow-[0_0_20px_var(--color-primary-glow)]"
          />
        ))}
      </AnimatePresence>
    </>
  );
};
