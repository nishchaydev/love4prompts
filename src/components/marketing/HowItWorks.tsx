import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedSection } from '../ui/AnimatedSection';

const STEPS = [
  {
    num: '01',
    title: 'Type Your Intent',
    desc: '"Enhance my prompt" or "make a portrait" — plain language, no menus.',
    color: '#8B5CF6',
  },
  {
    num: '02',
    title: 'AI Routes & Executes',
    desc: 'The bar detects intent, picks the right tool, and runs it — all in one step.',
    color: '#D83F87',
  },
  {
    num: '03',
    title: 'Copy & Create',
    desc: 'One-click copy your result. Paste into ChatGPT, Midjourney, or any AI.',
    color: '#34d399',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden border-t border-white/[0.04]">
      <div className="container mx-auto px-4 max-w-[900px] relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-[40px] font-black text-white tracking-[-0.03em] leading-tight">
            Three steps. Zero friction.
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard: React.FC<{ step: typeof STEPS[0]; index: number }> = ({ step, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="text-center group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="text-[56px] font-black mb-3 transition-colors duration-500"
        style={{ color: `${step.color}10` }}
        whileHover={{ scale: 1.1, color: `${step.color}30` }}
      >
        {step.num}
      </motion.div>
      <h3 className="text-[16px] font-bold text-white mb-2">{step.title}</h3>
      <p className="text-[13px] text-white/30 font-medium leading-relaxed max-w-[240px] mx-auto">
        {step.desc}
      </p>
    </motion.div>
  );
};
