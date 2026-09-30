/**
 * Dynamic Image Optimization Helper
 * Automatically injects responsive widths, webp/avif auto-format, and quality optimization flags
 * into Cloudinary & Unsplash URLs.
 */

export const getOptimizedImageUrl = (url?: string, width = 600, quality = 80): string => {
  if (!url) {
    return `https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=${quality}&w=${width}`;
  }

  // Cloudinary Optimization
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    const transformStr = `f_auto,q_auto:${quality > 85 ? 'good' : 'eco'},w_${width},c_limit`;
    return url.replace('/upload/', `/upload/${transformStr}/`);
  }

  // Unsplash Optimization
  if (url.includes('images.unsplash.com')) {
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?auto=format&fit=crop&q=${quality}&w=${width}`;
  }

  return url;
};
