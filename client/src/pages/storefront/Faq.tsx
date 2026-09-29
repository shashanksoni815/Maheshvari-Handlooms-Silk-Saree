import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Orders & Shipping',
    icon: '📦',
    questions: [
      { q: 'How long will it take to receive my order?', a: 'Orders within India are typically delivered within 4-7 business days. International shipping timelines vary between 10-15 business days depending on the destination.' },
      { q: 'Do you offer free shipping?', a: 'Yes, we offer complimentary express shipping on all domestic orders above ₹10,000.' },
      { q: 'How can I track my order?', a: 'Once your order is dispatched, you will receive an email with your tracking number and a link to trace its journey. You can also view this in your Account Dashboard.' },
    ],
  },
  {
    category: 'Product & Care',
    icon: '✨',
    questions: [
      { q: 'Are your silk sarees authentic?', a: 'Absolutely. Every saree comes with an authenticity certificate. We source directly from generational weavers in Varanasi, Kanchipuram, and Chanderi, guaranteeing 100% pure silk.' },
      { q: 'Does the saree come with a blouse piece?', a: 'Yes, all our sarees include an unstitched blouse piece, woven seamlessly with the saree. It is typically 0.8 to 1 meter in length.' },
      { q: 'How should I care for my silk saree?', a: 'We strongly recommend dry cleaning only. For storage, fold them in a muslin cloth and avoid hanging them on metal hangers to maintain the integrity of the weave.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    icon: '🔄',
    questions: [
      { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for unused, unwashed items with their original tags intact. Please refer to our full Cancellation & Returns Policy for details.' },
      { q: 'How long do refunds take?', a: 'Once we receive and inspect the returned item, your refund will be processed back to your original payment method within 5-7 business days.' },
    ],
  },
];

const AccordionItem = ({ q, a, index }: { q: string; a: string; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
      className="border border-supporting/60 rounded-2xl overflow-hidden bg-white hover:border-accent/40 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <span className="text-sm font-semibold text-primary leading-snug">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
          <ChevronDown className="w-5 h-5 text-accent" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-secondary text-sm leading-relaxed border-t border-supporting/40 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Faq = () => {
  return (
    <div className="bg-background min-h-screen">

      {/* ── Hero ── */}
      <div className="relative bg-primary py-24 overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center text-[14vw] font-extrabold tracking-tighter text-white/5 uppercase leading-none select-none pointer-events-none">
          FAQ
        </span>
        <motion.div className="relative z-10 text-center px-4" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-amber-300 mb-5 border border-amber-300/30 px-4 py-1.5 rounded-full">
            Knowledge Base
          </span>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Frequently Asked</h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm">
            Find quick answers about our heritage silks, orders, and care guidelines.
          </p>
        </motion.div>
      </div>

      {/* ── FAQ Groups ── */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        {faqs.map((group, gIdx) => (
          <div key={gIdx} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{group.icon}</span>
              <h2 className="text-2xl font-serif text-primary">{group.category}</h2>
            </div>
            <div className="space-y-3">
              {group.questions.map((faq, i) => (
                <AccordionItem key={i} q={faq.q} a={faq.a} index={gIdx * 3 + i} />
              ))}
            </div>
          </div>
        ))}

        {/* Still Have Questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-8 bg-primary rounded-3xl p-10 text-center text-white"
        >
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
            <MessageCircle className="w-7 h-7 text-amber-300" />
          </div>
          <h3 className="text-2xl font-serif mb-3">Still Have Questions?</h3>
          <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto">Our customer care team is always delighted to assist you personally.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-soft text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

