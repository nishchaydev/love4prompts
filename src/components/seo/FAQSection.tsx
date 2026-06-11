import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
}

/**
 * Reusable FAQ section with built-in FAQPage JSON-LD schema
 * and optional cross-linking to related tools.
 */
export const FAQSection: React.FC<Props> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Build FAQPage JSON-LD for Google rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16">
      {/* JSON-LD for search engines */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center mb-10">
        <p className="text-[11px] font-mono font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-2">
          FAQ
        </p>
        <h2 className="text-xl md:text-2xl font-black text-black tracking-[-0.03em] uppercase">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl border-[3px] border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] overflow-hidden transition-colors hover:border-black/50 mb-3"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="text-[14px] font-bold text-black/80 group-hover:text-black transition-colors pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-black/40" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[14px] font-medium text-black/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>


    </section>
  );
};
