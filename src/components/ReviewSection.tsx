import { Star, MessageCircle } from 'lucide-react';
import { ReviewItem } from './ReviewItem';
import { Review } from '../types';

interface ReviewSectionProps {
  user: any;
  reviews: Review[];
  newReview: { rating: number; comment: string };
  setNewReview: (review: { rating: number; comment: string }) => void;
  isSubmittingReview: boolean;
  onSubmitReview: () => void;
  onLogin: () => void;
  businessRating: number;
}

export function ReviewSection({ 
  user, 
  reviews, 
  newReview, 
  setNewReview, 
  isSubmittingReview, 
  onSubmitReview, 
  onLogin,
  businessRating
}: ReviewSectionProps) {
  return (
    <div id="reviews-section" className="mt-8 pt-8 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-neutral-900 uppercase">Reseñas de Vecinos</h3>
        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
          <span className="text-[10px] font-black text-orange-600">
            {businessRating || (reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '4.5')}
          </span>
        </div>
      </div>

      {/* Review Form */}
      {user ? (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 mb-8">
          <p className="text-[10px] font-black text-neutral-400 uppercase mb-3">Deja tu opinión</p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star}
                onClick={() => setNewReview({ ...newReview, rating: star })}
              >
                <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-orange-500 text-orange-500' : 'text-neutral-200'}`} />
              </button>
            ))}
          </div>
          <textarea 
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="¿Qué te pareció este negocio?"
            className="w-full bg-neutral-50 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none resize-none min-h-[80px] mb-3"
          />
          <button 
            onClick={onSubmitReview}
            disabled={isSubmittingReview || !newReview.comment.trim()}
            className="w-full bg-neutral-900 text-white rounded-xl py-3 text-xs font-black hover:bg-neutral-800 disabled:opacity-50 transition-all"
          >
            {isSubmittingReview ? 'Publicando...' : 'Publicar Reseña'}
          </button>
        </div>
      ) : (
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 text-center mb-8">
          <p className="text-xs text-orange-700 font-bold mb-3">Inicia sesión para dejar una reseña</p>
          <button 
            onClick={onLogin}
            className="bg-white text-neutral-900 px-6 py-2 rounded-xl text-xs font-black shadow-sm"
          >
            Login con Google
          </button>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-6">
            <MessageCircle className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
            <p className="text-[10px] text-neutral-400 font-bold uppercase">Sé el primero en opinar</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
