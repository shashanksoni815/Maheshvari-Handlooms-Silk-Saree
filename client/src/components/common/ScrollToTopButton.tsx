import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-[90] p-3 rounded-full bg-[#063F35] text-white shadow-xl hover:bg-[#042d26] border border-[#d9c8a6]/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
          aria-label="Easy Scroll to top"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 text-[#C6A15B] group-hover:-translate-y-0.5 transition-transform duration-200" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
