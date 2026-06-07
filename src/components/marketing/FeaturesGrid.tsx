import React from 'react';
import { GlassCard, AnimatedSection } from '../ui/AnimatedSection';
import { Wand2, Image, ArrowRightLeft, Code2, Megaphone, BookOpen } from 'lucide-react';

const FEATURES = [
  {
    icon: Wand2,
    color: '#8B5CF6',
    title: 'Prompt Enhancer',
    desc: 'Type "enhance my prompt about..."\nWe rewrite it for maximum AI output quality.',
  },
  {
    icon: Image,
    color: '#E98074',
    title: 'Image Generation',
    desc: 'Type "a cinematic portrait of..."\nWe craft the perfect Midjourney/DALL·E prompt.',
  },
  {
    icon: ArrowRightLeft,
    color: '#A4B3B6',
    title: 'Model Translator',
    desc: 'Type "convert this to DALL·E..."\nWe translate prompts between any two AI models.',
  },
  {
    icon: Code2,
    color: '#fbbf24',
    title: 'Code Prompts',
    desc: 'Type "write a system prompt for..."\nWe build precise technical prompts for coding AI.',
  },
  {
    icon: Megaphone,
    color: '#6B4DB3',
    title: 'Marketing Copy',
    desc: 'Type "create Instagram posts about..."\nWe generate marketing content prompts instantly.',
  },
  {
    icon: BookOpen,
    color: '#D83F87',
    title: 'Prompt Library',
    desc: 'Browse curated collections.\nCopy any prompt and use it instantly in your AI tool.',
  },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1000px] relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3">
            One Bar, Every Tool
          </p>
          <h2 className="text-3xl md:text-[44px] font-black text-white tracking-[-0.03em] leading-tight mb-3">
            Type anything. We route it.
          </h2>
          <p className="text-[15px] text-white/30 font-medium max-w-[500px] mx-auto">
            The bar detects what you need and runs the right tool. No menus. No clicking. Just type and go.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <GlassCard key={f.title} delay={i * 0.08} hoverColor={`${f.color}15`}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500"
                  style={{
                    backgroundColor: `${f.color}12`,
                    boxShadow: `0 0 0 1px ${f.color}20`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-white/30 leading-relaxed whitespace-pre-line">{f.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
