import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Digital Creator · 150k followers',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    text: 'I type what I need, it figures out the best format. Saved me hours every week. The prompt enhancer alone 10x\'d my Midjourney outputs.',
    color: 'bg-[#FFD166]'
  },
  {
    name: 'Marcus Chen',
    role: 'AI Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    text: 'The prompt maker feels like magic. I write my basic idea and it just works. No clicking through endless menus. One place for everything.',
    color: 'bg-[#FF6D87]'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Marketing Agency Lead',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
    text: 'Our team generates content for 6 different AI tools daily. Having tools that instantly write viral captions and LinkedIn posts saves us real money.',
    color: 'bg-[#1482A3]'
  },
];

export const TestimonialSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative bg-white border-t-[4px] border-black">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="text-center mb-16 relative z-10">
          <div className="inline-block bg-[#06D6A0] text-black text-[12px] font-black px-4 py-1.5 border-[3px] border-black shadow-[4px_4px_0_#000] rounded-full mb-6 uppercase tracking-widest">
            Wall of Love
          </div>
          <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-black text-black tracking-[-0.04em] leading-[0.95] mb-4 uppercase">
            Built for creators <br className="hidden sm:block" />
            <span className="text-white drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000] tracking-tighter">and teams</span>
          </h2>
          <p className="text-[16px] md:text-[20px] text-black font-medium max-w-2xl mx-auto">Powering workflows from solo creators to full agencies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-[24px] border-[3px] border-black shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#000] hover:-translate-y-2 transition-all duration-300 ${t.color}`}
            >
              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-5 h-5 ${i === 2 ? 'fill-white text-white' : 'fill-black text-black'}`} />
                  ))}
                </div>
                <p className={`text-black leading-relaxed mb-8 text-[15px] font-bold ${i === 2 ? 'text-white' : ''}`}>"{t.text}"</p>
                <div className="flex items-center gap-4 pt-4 border-t-2 border-black/20">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-[3px] border-black bg-white" loading="lazy" />
                  <div>
                    <h4 className={`text-[15px] font-black ${i === 2 ? 'text-white' : 'text-black'} uppercase tracking-tight`}>{t.name}</h4>
                    <p className={`text-[12px] ${i === 2 ? 'text-white/80' : 'text-black/80'} font-bold`}>{t.role}</p>
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
