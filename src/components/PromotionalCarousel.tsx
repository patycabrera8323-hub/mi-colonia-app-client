import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  imageUrl: string;
  businessId?: string | null;
  businessName?: string | null;
  active: boolean;
}

interface Props {
  onBusinessSelect?: (businessId: string) => void;
}

export function PromotionalCarousel({ onBusinessSelect }: Props) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'promotions'),
      where('active', '==', true)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data: Promotion[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Promotion));
      
      // Sort in-memory by createdAt desc
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setPromotions(data);
      setCurrent(0);
    }, (error) => {
      console.error("Error al cargar promociones del carrusel:", error);
    });
    return () => unsub();
  }, []);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (promotions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % promotions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  if (promotions.length === 0) return null;

  const handleClick = (promo: Promotion) => {
    if (promo.businessId && onBusinessSelect) {
      onBusinessSelect(promo.businessId);
    }
  };

  return (
    <div className="w-full px-4 pt-2 pb-1">
      <div className="relative w-full rounded-[1.5rem] overflow-hidden shadow-lg shadow-orange-100/40" style={{ aspectRatio: '16/6' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => handleClick(promotions[current])}
          >
            <img
              src={promotions[current].imageUrl}
              alt={promotions[current].title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/800x300/f97316/ffffff?text=🔥+Promoción+Especial';
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {/* Title & badge */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div>
                <p className="text-white font-black text-sm leading-tight drop-shadow-lg line-clamp-1">
                  {promotions[current].title}
                </p>
                {promotions[current].businessName && (
                  <p className="text-white/80 text-[10px] font-bold mt-0.5">
                    📍 {promotions[current].businessName}
                  </p>
                )}
              </div>
              {promotions[current].businessId && (
                <div className="bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg flex-shrink-0">
                  Ver oferta →
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows (only if more than 1) */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(c => (c - 1 + promotions.length) % promotions.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(c => (c + 1) % promotions.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            >
              <ChevronRight className="w-4 h-4 text-neutral-700" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 right-4 flex gap-1">
              {promotions.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
