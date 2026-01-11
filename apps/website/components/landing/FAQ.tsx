'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

const faqs = [
  {
    question: 'Why not just use GraphQL?',
    answer:
      'GraphQL lets the backend expose a schema that the frontend queries. Reactive Contracts inverts this: the frontend declares its requirements (data + constraints), and the backend must prove it can satisfy them. This puts frontend in control and catches violations at build time, not runtime.',
  },
  {
    question: 'How does this compare to tRPC?',
    answer:
      "tRPC provides excellent type safety for RPC calls. Reactive Contracts goes further by adding declarative constraints (latency, caching, freshness) and validating the entire contract—including performance requirements—at build time. It's not just about types, it's about guarantees.",
  },
  {
    question: 'Can I use this with an existing REST API?',
    answer:
      'Yes! You can wrap existing endpoints with contracts and gradually migrate. Start by defining contracts for new features, then incrementally add them to existing endpoints. The compiler will guide you through the process.',
  },
  {
    question: 'What happens when a contract changes?',
    answer:
      "When a contract changes, the compiler re-generates types and validates that both frontend and backend still satisfy the agreement. If the backend can't meet the new requirements (e.g., tighter latency constraint), the build fails—before deployment. This prevents breaking changes from reaching production.",
  },
  {
    question: 'Is this production-ready?',
    answer:
      "Reactive Contracts is in **Beta** (v0.1.3-beta). The core features are production-ready and tested, but we're still adding developer experience improvements like build tool plugins and enhanced error messages. Perfect for early adopters and new projects. Check the roadmap for what's coming next.",
  },
  {
    question: 'Does this work with [my framework]?',
    answer:
      'Currently we support React, Next.js, Vite, and Astro. The core is framework-agnostic, so adding support for Vue, Svelte, or Solid is straightforward. If you need a specific framework adapter, open an issue or contribute one!',
  },
  {
    question: 'What about server-side rendering (SSR)?',
    answer:
      'Yes! Contracts work seamlessly with SSR. The generated types ensure type safety on both server and client. Use the same contracts in Next.js App Router, Astro, or any SSR framework. Check our Next.js example for a complete implementation.',
  },
  {
    question: 'How does this impact bundle size?',
    answer:
      '@reactive-contracts/core has zero dependencies and minimal runtime overhead. The compiler runs at build time, so it adds no runtime bundle size. Only the contract execution logic (fetch wrapper, cache management) is included in your bundle, which is typically <5kB gzipped.',
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className="p-6 bg-white/3 border-white/10 hover:border-white/20 transition-colors cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-sm font-semibold text-white flex-1">{question}</h4>
          <ChevronDown
            className={`h-5 w-5 text-white/60 shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
        {isOpen && <p className="text-sm text-white/70 leading-relaxed">{answer}</p>}
      </div>
    </Card>
  );
};

export const FAQ = () => {
  return (
    <section id="faq" className="mx-auto px-4 py-16 md:py-24 bg-white/2">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-white/70 text-md max-w-2xl mx-auto">
            Common questions about Reactive Contracts and how it compares to other solutions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-white/50 text-sm">
            Have more questions?{' '}
            <a
              href="https://github.com/creativoma/reactive-contracts/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline underline-offset-2"
            >
              Open an issue on GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
