import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-[10px] font-black text-orange-600 uppercase">
            {review.userName.charAt(0)}
          </div>
          <span className="text-[10px] font-black text-neutral-900">{review.userName}</span>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className={`w-2.5 h-2.5 ${s <= review.rating ? 'fill-orange-500 text-orange-500' : 'text-neutral-100'}`} />
          ))}
        </div>
      </div>
      <p className="text-[11px] text-neutral-600 font-medium leading-relaxed">
        {review.comment}
      </p>
      {review.createdAt && (
        <p className="text-[8px] text-neutral-400 mt-2 font-bold uppercase">
          Hace {Math.floor((Date.now() - (review.createdAt.seconds * 1000)) / (1000 * 60 * 60 * 24))} días
        </p>
      )}
    </div>
  );
}
