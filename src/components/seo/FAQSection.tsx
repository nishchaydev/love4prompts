import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
  relatedTools?: { label: string; href: string }[];
}

/**
 * Reusable FAQ section with built-in FAQPage JSON-LD schema
 * and optional cross-linking to related tools.
 */
export const FAQSection: React.FC<Props> = ({ faqs, relatedTools }) => {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center mb-10">
        <p className="text-[11px] font-mono font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-2">
          FAQ
        </p>
        <h2 className="text-xl md:text-2xl font-light text-white tracking-[-0.03em]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background-card)] overflow-hidden transition-colors hover:border-white/10"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="text-[13.5px] font-semibold text-white/80 group-hover:text-white transition-colors pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-white/30" />
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
                    <p className="px-4 pb-4 text-[13px] text-white/50 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Cross-linking CTA */}
      {relatedTools && relatedTools.length > 0 && (
        <div className="mt-10 pt-6 border-t border-white/[0.04]">
          <p className="text-[11px] font-mono font-bold text-[var(--color-text-muted)] uppercase tracking-[0.15em] mb-3">
            Try also
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedTools.map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold border border-[var(--color-border)] bg-[var(--color-background-elevated)] text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all no-underline"
              >
                {tool.label} →
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
