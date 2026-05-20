import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'promotions'),
      where('active', '==', true)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data: Promotion[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Promotion));
      
      // Sort in-memory by createdAt desc (compatible con Firestore Timestamp y número)
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds ?? a.createdAt ?? 0;
        const timeB = b.createdAt?.seconds ?? b.createdAt ?? 0;
        return timeB - timeA;
      });

      console.log('[Carrusel] Promociones activas cargadas:', data.length, data.map(p => p.title));
      setPromotions(data);
      setCurrent(0);
      setLoading(false);
    }, (error) => {
      console.error("Error al cargar promociones del carrusel:", error);
      setLoading(false);
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

  if (loading) {
    return (
      <div className="w-full px-4 pt-2 pb-1">
        <div className="w-full rounded-[1.5rem] overflow-hidden bg-neutral-200 animate-pulse" style={{ aspectRatio: '16/6' }} />
      </div>
    );
  }

  if (promotions.length === 0) return null;

  const handleClick = (promo: Promotion) => {
    if (promo.businessId && onBusinessSelect) {
      onBusinessSelect(promo.businessId);
    }
  };

  return (
    <div className="w-full px-4 pt-2 pb-1">
      <div className="flex items-center gap-1.5 mb-2 ml-1 px-1">
        <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
          🔥 Ofertas y Promociones
        </span>
      </div>

      <div className="relative w-full h-32 rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-orange-50/70 via-white/40 to-amber-50/70 border border-orange-100 shadow-md shadow-orange-100/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 p-4 pr-12 flex items-center justify-between gap-4 cursor-pointer"
            onClick={() => handleClick(promotions[current])}
          >
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-between h-full min-w-0 pl-6">
              <div>
                <p className="text-neutral-900 font-black text-xs leading-snug line-clamp-2 uppercase tracking-tight">
                  {promotions[current].title}
                </p>
                {promotions[current].businessName && (
                  <p className="text-neutral-500 text-[9px] font-bold mt-1 flex items-center gap-0.5">
                    📍 {promotions[current].businessName}
                  </p>
                )}
              </div>

              {promotions[current].businessId && (
                <div className="text-[8px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-0.5">
                  Ver oferta →
                </div>
              )}
            </div>

            {/* Right Image (Rounded Square) */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-orange-100 bg-white shadow-sm">
              <img
                src={promotions[current].imageUrl}
                alt={promotions[current].title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/200x200/f97316/ffffff?text=🔥+Oferta';
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows (only if more than 1) */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(c => (c - 1 + promotions.length) % promotions.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all border border-neutral-100 z-10"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(c => (c + 1) % promotions.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all border border-neutral-100 z-10"
            >
              <ChevronRight className="w-4 h-4 text-neutral-700" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-10 flex gap-1 z-10">
              {promotions.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                  className={`h-1 rounded-full transition-all ${i === current ? 'w-4 bg-orange-500' : 'w-1 bg-orange-200'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
