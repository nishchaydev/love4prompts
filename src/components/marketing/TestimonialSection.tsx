import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Digital Creator (150k followers)',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    text: 'ViralPrompt is literally my secret weapon. I copy a prompt, tweak it slightly in Midjourney, and post. My engagement is up 300% this month.',
  },
  {
    name: 'Marcus Chen',
    role: 'Faceless Channel Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    text: 'I used to spend hours trying to figure out how other creators got those hyper-realistic AI images. Now I just browse the library and get the exact prompt.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Social Media Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
    text: 'The best investment for our agency. We generate thousands of assets a week using these prompts. It pays for itself in time saved.',
  },
];

export const TestimonialSection: React.FC = () => {
  return (
    <section className="py-24 bg-[var(--color-background-primary)]">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Loved by 10,000+ Creators</h2>
          <p className="text-xl text-gray-400 font-medium">Join the community going viral every single day.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#111] p-8 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-white/10 hover:border-[var(--color-primary)]/50 hover:shadow-[0_8px_40px_var(--color-primary-glow)] transition-all duration-300">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-[var(--color-primary)] text-[var(--color-primary)]" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-lg font-medium">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-white/20" />
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-sm text-gray-400 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
