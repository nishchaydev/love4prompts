import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  { num: '01 / INPUT', title: 'Write Intent', desc: 'Describe your idea in simple keywords or draft instructions.' },
  { num: '02 / ANALYZE', title: 'Smart Detection', desc: 'The system instantly parses intent and detects the optimal action.' },
  { num: '03 / OUTPUT', title: 'Production Ready', desc: 'Get structured, high-fidelity prompt parameters formatted for your model.' },
];

export const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 border-t border-white/[0.03] relative bg-[var(--color-background-primary)]/40" ref={ref}>
      <div className="container mx-auto px-4 max-w-[960px]">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3 font-mono">
            Process Channel
          </p>
          <h2 className="text-2xl md:text-[36px] font-bold text-white tracking-[-0.04em]">
            Optimized in three phases.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[var(--color-border)] bg-[var(--color-background-card)]/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className={`flex-1 flex flex-col p-8 md:p-10 relative ${
                i > 0 ? 'border-t md:border-t-0 md:border-l border-white/[0.04]' : ''
              }`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <span className="text-[10px] font-mono font-bold text-[var(--color-primary)] tracking-widest mb-4">
                {step.num}
              </span>
              <h3 className="text-[16px] font-bold text-white tracking-tight mb-2">{step.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
