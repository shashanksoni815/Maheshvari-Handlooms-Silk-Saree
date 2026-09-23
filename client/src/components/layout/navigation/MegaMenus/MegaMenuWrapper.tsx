import React, { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MegaMenuWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const MegaMenuWrapper: React.FC<MegaMenuWrapperProps> = ({ isOpen, onClose, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute top-full left-0 w-full bg-background border-b border-supporting shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] z-40 overflow-hidden"
          role="region"
          aria-expanded={isOpen}
          onMouseLeave={onClose}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
