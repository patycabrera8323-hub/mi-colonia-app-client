import { ArrowLeft, Star, Clock, MapPin, Truck, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Business, Product, Review } from '../types';
import { ProductCard } from './ProductCard';
import { ReviewSection } from './ReviewSection';

interface BusinessOverlayProps {
  business: Business;
  products: Product[];
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  getItemQuantity: (productId: string) => number;
  user: any;
  newReview: { rating: number; comment: string };
  setNewReview: (review: { rating: number; comment: string }) => void;
  isSubmittingReview: boolean;
  onSubmitReview: () => void;
  onLogin: () => void;
  onProductClick: (product: Product) => void;
}

export function BusinessOverlay({
  business,
  products,
  reviews,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  getItemQuantity,
  user,
  newReview,
  setNewReview,
  isSubmittingReview,
  onSubmitReview,
  onLogin,
  onProductClick
}: BusinessOverlayProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-neutral-50 overflow-y-auto"
    >
      {/* Business Header */}
      <div className="relative h-72 bg-neutral-100 overflow-hidden">
         <img 
          src={business.logoUrl || `https://picsum.photos/seed/${business.id}/800`} 
          alt={business.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 left-4 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shrink-0 shadow-2xl">
            <img src={business.logoUrl || `https://picsum.photos/seed/${business.id}/200`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="mb-2">
            <span className="inline-block px-2 py-0.5 rounded-full bg-orange-600 text-[8px] font-black text-white uppercase mb-2 tracking-widest">
              {business.category}
            </span>
            <h2 className="text-3xl font-black text-white leading-tight drop-shadow-sm">{business.name}</h2>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 pb-40">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center border border-neutral-100">
            <span className="text-[10px] uppercase font-black text-neutral-400 mb-1 tracking-widest">Rating</span>
            <div className="flex items-center gap-1.5 font-black text-lg text-neutral-900 leading-none">
              <Star className="w-4 h-4 fill-orange-500 text-orange-500" /> {business.rating || '4.5'}
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center border border-neutral-100">
            <span className="text-[10px] uppercase font-black text-neutral-400 mb-1 tracking-widest">Estado</span>
            <div className={`font-black text-lg leading-none ${business.isOpen ? 'text-green-600' : 'text-red-600'}`}>
              {business.isOpen ? 'Abierto' : 'Cerrado'}
            </div>
          </div>
        </div>

        {/* Enhanced Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 mb-8 space-y-6">
          <div>
            <h4 className="text-[10px] uppercase font-black text-neutral-400 mb-2 tracking-widest">Acerca de</h4>
            <p className="text-sm text-neutral-800 font-medium leading-relaxed">
              {business.description || 'Este negocio no ha proporcionado una descripción todavía.'}
            </p>
          </div>
          
          <div className="space-y-4 pt-5 border-t border-neutral-50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] uppercase font-black text-neutral-400 block mb-0.5 tracking-wider">Horario de Atención</span>
                <p className="text-sm font-bold text-neutral-800 leading-normal">{business.schedule || 'Comunícate con el administrador para más información'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] uppercase font-black text-neutral-400 block mb-0.5 tracking-wider">Dirección</span>
                <p className="text-sm font-bold text-neutral-800 leading-normal">{business.address || 'Ubicación próximamente disponible en el mapa'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] uppercase font-black text-neutral-400 block mb-0.5 tracking-wider">Área de Entrega</span>
                <p className="text-sm font-bold text-neutral-800 leading-normal">{business.deliveryArea || business.deliveryZone || 'Consulta la zona de entrega'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] uppercase font-black text-neutral-400 block mb-0.5 tracking-wider">Envíos a partir de</span>
                <p className="text-sm font-bold text-neutral-800 leading-normal">{business.enviosAPartirDe || business.minDeliveryAmount || 'Consulta con el negocio'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 shadow-sm">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] uppercase font-black text-neutral-400 block mb-0.5 tracking-wider">Formas de Pago</span>
                {(() => {
                  const methods = business.paymentMethods || 
                                 (business.paymentMethod ? business.paymentMethod.split(',').map(s => s.trim()) : []);
                  return methods.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {methods.map((m: string) => (
                        <span key={m} className="px-2 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-700">{m}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 font-medium">Consulta con el negocio.</p>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-6 border-b border-neutral-100 px-2 overflow-x-auto scrollbar-hide">
          <button className="px-2 pb-3 text-xs font-black text-orange-600 border-b-2 border-orange-600 whitespace-nowrap tracking-widest">PRODUCTOS</button>
          <button 
            onClick={() => {
              const el = document.getElementById('reviews-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} 
            className="px-2 pb-3 text-xs font-black text-neutral-400 hover:text-neutral-600 whitespace-nowrap tracking-widest"
          >
            RESEÑAS ({reviews.length})
          </button>
        </div>
        
        <div className="grid gap-4 mb-12">
          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-dashed border-neutral-200 text-center">
              <ShoppingBag className="w-8 h-8 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm font-bold">Catálogo vacío por ahora.</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getItemQuantity(product.id)}
                isOpen={business.isOpen}
                onAdd={() => onAddToCart(product)}
                onRemove={() => onRemoveFromCart(product.id)}
                onSelect={() => onProductClick(product)}
              />
            ))
          )}
        </div>

        <ReviewSection
          user={user}
          reviews={reviews}
          newReview={newReview}
          setNewReview={setNewReview}
          isSubmittingReview={isSubmittingReview}
          onSubmitReview={onSubmitReview}
          onLogin={onLogin}
          businessRating={business.rating}
        />
      </div>
    </motion.div>
  );
}
