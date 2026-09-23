import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Package, MapPin, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-4 w-64 bg-white border border-supporting shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
          onMouseLeave={onClose}
        >
          {isAuthenticated ? (
            <div>
              <div className="p-4 border-b border-supporting bg-background/50">
                <p className="text-sm text-secondary">Welcome back,</p>
                <p className="font-serif text-primary text-lg truncate">{user?.firstName || 'User'}</p>
              </div>
              <ul className="py-2">
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <li>
                    <Link to="/admin" onClick={onClose} className="flex items-center px-4 py-2.5 text-sm text-primary font-bold hover:bg-supporting/30 transition-colors">
                      <Shield className="w-4 h-4 mr-3 text-primary" />
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/account" onClick={onClose} className="flex items-center px-4 py-2.5 text-sm text-secondary hover:bg-supporting/30 hover:text-primary transition-colors">
                    <User className="w-4 h-4 mr-3 text-secondary/70" />
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/account/orders" onClick={onClose} className="flex items-center px-4 py-2.5 text-sm text-secondary hover:bg-supporting/30 hover:text-primary transition-colors">
                    <Package className="w-4 h-4 mr-3 text-secondary/70" />
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" onClick={onClose} className="flex items-center px-4 py-2.5 text-sm text-secondary hover:bg-supporting/30 hover:text-primary transition-colors">
                    <Heart className="w-4 h-4 mr-3 text-secondary/70" />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/account/addresses" onClick={onClose} className="flex items-center px-4 py-2.5 text-sm text-secondary hover:bg-supporting/30 hover:text-primary transition-colors">
                    <MapPin className="w-4 h-4 mr-3 text-secondary/70" />
                    Addresses
                  </Link>
                </li>
                <li className="border-t border-supporting/50 mt-1 pt-1">
                  <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm text-burgundy hover:bg-burgundy/5 transition-colors">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="p-6 flex flex-col gap-4">
              <h3 className="font-serif text-primary text-lg text-center mb-1">Welcome to Maheshwari</h3>
              <Link
                to="/login"
                onClick={onClose}
                className="w-full flex justify-center py-3 text-xs font-bold uppercase tracking-widest text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="w-full flex justify-center py-3 text-xs font-bold uppercase tracking-widest text-primary bg-transparent border border-primary hover:bg-primary/5 transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
