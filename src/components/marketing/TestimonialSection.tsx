import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Digital Creator · 150k followers',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    text: 'I type what I need, it figures out the tool. Saved me hours every week. The prompt enhancer alone 10x\'d my Midjourney outputs.',
  },
  {
    name: 'Marcus Chen',
    role: 'AI Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    text: 'The universal bar feels like magic. I write "optimize my system prompt" and it just works. No clicking through menus. One place for everything.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Agency Lead',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
    text: 'Our team generates prompts for 6 different AI tools daily. Having one bar that translates between ChatGPT, Midjourney, and Claude saves us real money.',
  },
];

export const TestimonialSection: React.FC = () => {
  return (
    <section className="py-28 relative">
      <div className="container mx-auto px-4 max-w-[1000px]">
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3 font-mono">Feedback</p>
          <h2 className="text-3xl md:text-[44px] font-black text-white tracking-[-0.04em] leading-tight mb-3">Built for creators and teams</h2>
          <p className="text-[15px] text-white/30 font-medium">Powering workflows from solo creators to full agencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative p-6 rounded-3xl transition-all duration-500 group"
              style={{
                background: 'rgba(18, 10, 36, 0.4)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: '0 0 32px var(--color-primary-glow)',
                  border: '1px solid rgba(113, 61, 255, 0.2)',
                  borderRadius: 'inherit',
                }}
              />

              <div className="relative z-10">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[var(--color-primary)] text-[var(--color-primary)] opacity-80" />
                  ))}
                </div>
                <p className="text-white/60 leading-relaxed mb-6 text-[13.5px] font-medium">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-white/10" loading="lazy" />
                  <div>
                    <h4 className="text-[13px] font-bold text-white/80">{t.name}</h4>
                    <p className="text-[11px] text-white/25 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
