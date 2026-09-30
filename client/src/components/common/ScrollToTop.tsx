import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Smooth scroll window to absolute top (0, 0)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Reset document element & body scroll top
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search]);

  return null;
};
