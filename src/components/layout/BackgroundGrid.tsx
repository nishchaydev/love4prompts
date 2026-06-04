import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden mix-blend-screen">
      <motion.div 
        className="absolute inset-0 opacity-[0.4]"
        animate={{
          backgroundPosition: ['0px 0px', '0px 32px']
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 8
        }}
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
        }}
      />
      {/* Top fade gradient to seamlessly blend into the top edge */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-background-primary)] to-transparent" />
      {/* Bottom fade gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-background-primary)] to-transparent" />
    </div>
  );
};
