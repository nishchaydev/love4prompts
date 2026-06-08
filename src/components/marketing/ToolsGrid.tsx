import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Wand2, Sparkles, ArrowRightLeft, Image, Camera,
  Code2, ArrowUpRight
} from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TOOLS_DATA = [
  {
    icon: Wand2,
    name: "Prompt Enhancer",
    description: "Make any prompt sharper and more effective",
    href: "/tools/prompt-enhancer"
  },
  {
    icon: Sparkles,
    name: "Prompt Maker",
    description: "Generate prompts from a simple idea",
    href: "/tools/prompt-maker"
  },
  {
    icon: ArrowRightLeft,
    name: "Prompt Translator",
    description: "Convert prompts between AI models",
    href: "/tools/prompt-translator"
  },
  {
    icon: Image,
    name: "Image to Prompt",
    description: "Reverse-engineer any image into a prompt",
    href: "/tools/image-to-prompt"
  },
  {
    icon: Camera,
    name: "Prompt to Image",
    description: "Craft perfect Midjourney and Flux prompts",
    href: "/tools/prompt-to-image"
  },
  {
    icon: LinkedinIcon,
    name: "LinkedIn Post",
    description: "Write posts that get real engagement",
    href: "/linkedin-post-generator"
  },
  {
    icon: InstagramIcon,
    name: "Instagram Caption",
    description: "Captions that stop the scroll",
    href: "/instagram-caption-generator"
  },
  {
    icon: Code2,
    name: "Coding Prompt",
    description: "Get better code from any AI model",
    href: "/coding-prompt-generator"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 16
    }
  }
};

export const ToolsGrid: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="container mx-auto px-4 py-16 sm:py-24 relative z-10 border-t border-white/[0.03]">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[var(--color-primary)]/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[var(--color-accent-purple)]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center mb-16 gap-3"
      >
        <p className="text-[11px] font-mono font-bold text-[var(--color-primary)] uppercase tracking-[0.2em]">
          Interactive Console Suite
        </p>
        <h2 className="text-3xl md:text-[40px] font-light tracking-[-0.04em] text-white leading-tight">
          Everything you need to <span className="font-bold text-[var(--color-primary)]">prompt better</span>.
        </h2>
        <p className="text-white/45 text-[14px] max-w-[460px] leading-relaxed font-medium">
          Choose from our custom tailored tool workflow suite, designed specifically for rapid generation and refinement.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10"
      >
        {TOOLS_DATA.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.a
              key={index}
              href={tool.href}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className="group flex flex-col justify-between text-left bg-[var(--color-background-card)]/40 hover:bg-[var(--color-background-elevated)]/60 border border-[var(--color-border)] hover:border-[var(--color-border-warm)] rounded-3xl p-6 gap-6 transition-all duration-300 hover:shadow-[0_8px_30px_var(--color-primary-glow)] no-underline relative overflow-hidden backdrop-blur-xl"
            >
              {/* Inner card content */}
              <div className="flex flex-col gap-4">
                {/* Icon Container */}
                <div className="flex items-center justify-center bg-[var(--color-primary-surface)] border border-[var(--color-border-warm)] rounded-2xl p-2.5 w-11 h-11 text-[var(--color-primary)] transition-all duration-300">
                  <Icon className="w-5.5 h-5.5" />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="text-[13px] text-white/40 leading-relaxed font-medium group-hover:text-white/60 transition-colors">
                    {tool.description}
                  </p>
                </div>
              </div>

              {/* Action Button Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-white/30 group-hover:text-[var(--color-primary)] transition-colors self-start">
                <span>USE TOOL</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
};
