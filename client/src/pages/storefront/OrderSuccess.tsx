import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif text-primary mb-4">Order Confirmed!</h1>
      <p className="text-secondary leading-relaxed mb-3">
        Thank you for your purchase. Your order has been successfully placed and is now being prepared with care.
      </p>
      {id && (
        <p className="text-sm text-gray-500 mb-10">
          Order reference: <span className="font-medium text-primary">#{id.substring(id.length - 8).toUpperCase()}</span>
        </p>
      )}

      <div className="bg-supporting/30 border border-supporting rounded p-6 mb-10 text-left">
        <div className="flex items-start gap-4">
          <Package className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-primary mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm text-secondary">
              <li>1. Your order is being quality-inspected by our team.</li>
              <li>2. It will be carefully packaged in our signature box within 1–2 business days.</li>
              <li>3. You'll receive a shipping confirmation with tracking details via email.</li>
              <li>4. Expected delivery: 4–7 business days.</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/account"
          className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          Track My Order <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center border border-gray-300 text-secondary px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};
