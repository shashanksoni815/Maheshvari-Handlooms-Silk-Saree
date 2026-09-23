import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryId, currentProductId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['related-products', categoryId],
    queryFn: async () => {
      const response = await api.get(`/products?category=${categoryId}&limit=5`);
      return response.data;
    },
    enabled: !!categoryId,
  });

  const products = data?.data?.products?.filter((p: any) => p._id !== currentProductId).slice(0, 4) || [];

  if (isLoading || products.length === 0) return null;

  return (
    <div className="mt-24 pt-12 border-t border-supporting">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-serif text-primary">You May Also Like</h2>
        <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline hidden md:block">
          View All Sarees
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="mt-8 text-center md:hidden">
        <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-primary border border-primary px-8 py-3 inline-block">
          View All Sarees
        </Link>
      </div>
    </div>
  );
};
