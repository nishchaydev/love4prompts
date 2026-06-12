import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  { num: '01 / DISCOVER', title: 'Find Your Tool', desc: 'Browse our curated Image Library of prompts or select a specialized AI generator for your social media needs.', color: 'bg-[#FFD166]' },
  { num: '02 / CUSTOMIZE', title: 'Set Your Intent', desc: 'Describe your idea, define your target audience, or tweak the parameters to fit your specific goal.', color: 'bg-[#1482A3]', textClass: 'text-white' },
  { num: '03 / GENERATE', title: 'Production Ready', desc: 'Get instantly optimized results—whether it’s a perfect Midjourney prompt or a viral, algorithm-scored social post.', color: 'bg-[#FF6D87]' },
];

export const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 md:py-24 border-t-[4px] border-black relative bg-white" ref={ref}>
      <div className="container mx-auto px-4 max-w-[1000px]">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-block bg-[#06D6A0] text-black text-[12px] font-black px-4 py-1.5 border-[3px] border-black shadow-[4px_4px_0_#000] rounded-full mb-6 uppercase tracking-widest">
            Process Channel
          </div>
          <h2 className="text-[32px] md:text-[48px] font-black text-black tracking-[-0.04em] uppercase leading-none">
            Optimized in three phases.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className={`flex-1 flex flex-col p-8 md:p-10 border-[3px] border-black rounded-[24px] shadow-[6px_6px_0_#000] hover:-translate-y-2 hover:shadow-[10px_10px_0_#000] transition-all duration-300 ${step.color}`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <span className={`text-[12px] font-black ${step.textClass || 'text-black'} bg-black/10 inline-block px-3 py-1 rounded-full w-fit tracking-widest mb-6 uppercase`}>
                {step.num}
              </span>
              <h3 className={`text-[24px] font-black ${step.textClass || 'text-black'} tracking-tight mb-3 uppercase leading-tight`}>{step.title}</h3>
              <p className={`text-[15px] ${step.textClass === 'text-white' ? 'text-white/90' : 'text-black/80'} leading-relaxed font-bold`}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
