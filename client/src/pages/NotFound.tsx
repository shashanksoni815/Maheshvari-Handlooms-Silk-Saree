import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <p className="text-8xl md:text-9xl font-serif text-primary/10 select-none mb-6">404</p>
    <h1 className="text-2xl md:text-3xl font-serif text-primary mb-4">Page Not Found</h1>
    <p className="text-secondary mb-10 max-w-md">
      The page you are looking for may have been moved, deleted, or never existed. Let us guide you back.
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        to="/"
        className="bg-primary text-white px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition-colors"
      >
        Return Home
      </Link>
      <Link
        to="/shop"
        className="border border-gray-300 text-secondary px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
      >
        Browse Shop
      </Link>
    </div>
  </div>
);
