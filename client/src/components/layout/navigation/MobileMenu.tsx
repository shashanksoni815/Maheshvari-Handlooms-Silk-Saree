import React, { useEffect } from 'react';
import { X, User, Heart, LogOut, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'Journal', path: '/journal' },
    { name: 'About', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-[100] lg:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-[85vw] sm:max-w-md bg-background shadow-2xl z-[110] lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-supporting shrink-0 h-[68px]">
              <img src="/logo.png" alt="Maheshwari Silk" className="h-10 w-auto object-contain" />
              <button onClick={onClose} className="p-2 text-secondary hover:text-primary transition-colors" aria-label="Close menu">
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav aria-label="Main navigation" className="flex flex-col px-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center justify-between border-b border-supporting/30 px-3 py-4 font-serif text-lg text-primary transition-colors hover:bg-supporting/20"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="h-4 w-4 text-[#6E6257]" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer / Account */}
            <div className="border-t border-supporting p-6 shrink-0 bg-white">
              <div className="space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/account" onClick={onClose} className="flex items-center text-sm font-medium tracking-wide text-secondary hover:text-primary transition-colors">
                      <User className="w-5 h-5 mr-3" strokeWidth={1.5} />
                      My Account
                    </Link>
                    <Link to="/wishlist" onClick={onClose} className="flex items-center text-sm font-medium tracking-wide text-secondary hover:text-primary transition-colors">
                      <Heart className="w-5 h-5 mr-3" strokeWidth={1.5} />
                      Wishlist
                    </Link>
                    <button onClick={handleLogout} className="flex items-center text-sm font-medium tracking-wide text-burgundy hover:text-burgundy/80 transition-colors w-full text-left">
                      <LogOut className="w-5 h-5 mr-3" strokeWidth={1.5} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={onClose} className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest text-white bg-primary hover:bg-primary/90 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={onClose} className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest text-primary border border-primary hover:bg-primary/5 transition-colors">
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
