import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../services/api';

interface Review {
  _id: string;
  user: { firstName: string; lastName: string };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const StarRating = ({
  rating,
  interactive = false,
  onSelect,
}: {
  rating: number;
  interactive?: boolean;
  onSelect?: (r: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={() => interactive && onSelect?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hover || rating) ? 'text-accent fill-accent' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const ReviewSection = ({ productId, reviews, onReviewAdded }: ReviewSectionProps) => {
  const { isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, data);
      reset();
      setSelectedRating(0);
      onReviewAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-12 mt-12">
      <h2 className="text-2xl font-serif text-primary mb-8">Customer Reviews</h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-6 mb-10 p-6 bg-supporting/30 rounded">
          <div className="text-center">
            <p className="text-5xl font-serif text-primary">{avgRating.toFixed(1)}</p>
            <StarRating rating={Math.round(avgRating)} />
            <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-gray-600">{star}</span>
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-accent h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="w-4 text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-8 mb-12">
        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-100 pb-8">
            <div className="flex justify-between items-start mb-3">
              <div>
                <StarRating rating={review.rating} />
                <h3 className="font-medium text-gray-900 mt-2">{review.title}</h3>
              </div>
              <p className="text-sm text-gray-400">
                {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <p className="text-secondary text-sm leading-relaxed mb-3">{review.comment}</p>
            <p className="text-xs text-gray-500 font-medium">
              {review.user.firstName} {review.user.lastName.charAt(0)}.
            </p>
          </div>
        ))}
      </div>

      {/* Write a Review */}
      {isAuthenticated ? (
        <div>
          <h3 className="text-xl font-serif text-primary mb-6">Write a Review</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
              <StarRating
                rating={selectedRating}
                interactive
                onSelect={(r) => {
                  setSelectedRating(r);
                  setValue('rating', r, { shouldValidate: true });
                }}
              />
              {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
              <input
                {...register('title')}
                placeholder="e.g. Stunning quality, just as described"
                className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
              <textarea
                {...register('comment')}
                rows={4}
                placeholder="Share the details of your experience with this product..."
                className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary text-sm resize-none"
              />
              {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-supporting/30 p-6 rounded text-center">
          <p className="text-secondary mb-4">Please sign in to write a review.</p>
          <a href="/login" className="text-primary font-medium hover:underline">Sign In</a>
        </div>
      )}
    </div>
  );
};
