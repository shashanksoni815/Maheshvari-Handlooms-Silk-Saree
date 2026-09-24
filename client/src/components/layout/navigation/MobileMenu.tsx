import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronRight, User, Heart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // Fetch dynamic data for menus
  const { data: catData } = useQuery({ queryKey: ['mobile-nav-categories'], queryFn: async () => (await api.get('/categories')).data });
  const { data: colData } = useQuery({ queryKey: ['mobile-nav-collections'], queryFn: async () => (await api.get('/collections')).data });
  const { data: filterData } = useQuery({ queryKey: ['mobile-nav-filters'], queryFn: async () => (await api.get('/products/config/filters')).data });
  const { data: blogData } = useQuery({ queryKey: ['mobile-nav-blogs'], queryFn: async () => (await api.get('/blogs')).data });

  const categories = catData?.data || [];
  const collections = colData?.data || [];
  const weaves = filterData?.data?.weave || ['Handloom', 'Handwoven', 'Zari', 'Jamdani'];
  const blogs = blogData?.data || [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset accordions when closed
      setTimeout(() => setOpenAccordion(null), 300);
    }
  }, [isOpen]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const menuConfig: Array<{ name: string; id?: string; path?: string; submenus?: Array<{ name: string; path: string }> }> = [
    { name: 'Home', path: '/' },
    {
      name: 'Sarees',
      id: 'sarees',
      submenus: categories.slice(0, 6).map((c: any) => ({ name: c.name, path: `/shop?category=${c.slug}` })),
    },
    {
      name: 'Collections',
      id: 'collections',
      submenus: collections.slice(0, 6).map((c: any) => ({ name: c.name, path: `/shop?collection=${c.slug}` })),
    },
    {
      name: 'Silk & Weaves',
      id: 'silk-weaves',
      submenus: weaves.slice(0, 6).map((w: string) => ({ name: w, path: `/shop?weave=${w.toLowerCase().replace(/ /g, '-')}` })),
    },
    {
      name: 'Journal',
      id: 'journal',
      submenus: [
        { name: 'Featured Stories', path: '/journal' },
        ...blogs.slice(0, 5).map((b: any) => ({ name: b.title, path: `/journal/${b.slug}` }))
      ],
    },
    { name: 'About', path: '/about-us' },
    { name: 'Contact', path: '/contact' },
  ];

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
              <nav className="flex flex-col">
                {menuConfig.map((item) => (
                  <div key={item.name} className="border-b border-supporting/30 last:border-0">
                    {item.submenus ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => toggleAccordion(item.id as string)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left font-serif text-lg text-primary transition-colors hover:bg-supporting/20"
                        >
                          {item.name}
                          <motion.div
                            animate={{ rotate: openAccordion === item.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-secondary/60" strokeWidth={1.5} />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {openAccordion === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-supporting/10"
                            >
                              <ul className="py-2 pl-8 pr-6 space-y-1">
                                {item.submenus.map((sub: { name: string; path: string }) => (
                                  <li key={sub.name}>
                                    <Link
                                      to={sub.path}
                                      onClick={onClose}
                                      className="block py-2.5 text-sm font-medium tracking-wide text-secondary hover:text-accent transition-colors"
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                                {item.id === 'journal' && (
                                  <li className="pt-2 mt-2 border-t border-supporting/30">
                                    <Link to="/journal" onClick={onClose} className="block py-2 text-xs font-bold uppercase tracking-widest text-primary flex items-center">
                                      View All Journal <ChevronRight className="w-3 h-3 ml-1" />
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                      to={item.path as string}
                        onClick={onClose}
                        className="block px-6 py-4 font-serif text-lg text-primary transition-colors hover:bg-supporting/20"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
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
