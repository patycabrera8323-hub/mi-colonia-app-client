import { ArrowLeft, Star, Clock, MapPin, Truck, ShoppingBag, X, Sparkles, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Business, Product, Review, Promotion } from '../types';
import { ProductCard } from './ProductCard';
import { ReviewSection } from './ReviewSection';

interface BusinessOverlayProps {
  business: Business;
  products: Product[];
  reviews: Review[];
  promotions: Promotion[];
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
  cartCount: number;
  cartTotal: number;
  onCheckout: () => void;
  onClearCart: () => void;
}

export function BusinessOverlay({
  business,
  products,
  reviews,
  promotions,
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
  onProductClick,
  cartCount,
  cartTotal,
  onCheckout,
  onClearCart
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

        {/* 🔥 Promociones Especiales */}
        {promotions && promotions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-1.5 px-1">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse animate-duration-1000" /> Promociones Especiales
            </h3>
            
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-hide">
              {promotions.map((promo) => {
                const promoQty = getItemQuantity(`promo_${promo.id}`);
                const hasPrice = promo.price !== undefined && promo.price !== null && promo.price > 0;
                
                return (
                  <div 
                    key={promo.id} 
                    className="w-72 bg-white rounded-3xl border border-neutral-200/50 shadow-sm shrink-0 snap-start overflow-hidden flex flex-col group hover:border-orange-200 transition-all duration-300"
                  >
                    {/* Banner Image */}
                    <div className="w-full h-32 bg-neutral-100 overflow-hidden relative">
                      <img 
                        src={promo.imageUrl} 
                        alt={promo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {hasPrice && (
                        <div className="absolute top-3 right-3 bg-neutral-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-2xl text-[10px] font-black tracking-tight shadow-md">
                          ${promo.price?.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-black text-neutral-900 line-clamp-1 uppercase tracking-tight">
                          {promo.title}
                        </h4>
                        {promo.description && (
                          <p className="text-[10px] text-neutral-500 font-medium line-clamp-2 mt-1 leading-snug">
                            {promo.description}
                          </p>
                        )}
                      </div>

                      {/* Add to Cart button */}
                      {hasPrice && (
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-50">
                          <span className="text-[10px] uppercase font-black text-neutral-400 tracking-wider">¿Ordenar?</span>
                          
                          {promoQty > 0 ? (
                            <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 gap-2 border border-neutral-200/50">
                              <button 
                                onClick={() => onRemoveFromCart(`promo_${promo.id}`)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm active:scale-90"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black min-w-[16px] text-center">
                                {promoQty}
                              </span>
                              <button 
                                disabled={!business.isOpen}
                                onClick={() => onAddToCart({
                                  id: `promo_${promo.id}`,
                                  name: `[PROMO] ${promo.title}`,
                                  description: promo.description || 'Promoción especial',
                                  price: promo.price || 0,
                                  imageUrl: promo.imageUrl,
                                  isAvailable: true
                                })}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm active:scale-90 disabled:opacity-50"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={!business.isOpen}
                              onClick={() => onAddToCart({
                                id: `promo_${promo.id}`,
                                name: `[PROMO] ${promo.title}`,
                                description: promo.description || 'Promoción especial',
                                price: promo.price || 0,
                                imageUrl: promo.imageUrl,
                                isAvailable: true
                              })}
                              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-all"
                            >
                              Agregar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {promotions && promotions.length > 0 && (
          <div className="pt-2 pb-1 border-t border-neutral-100/70 mb-6 mt-4 flex items-center justify-between">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1 shrink-0">
              📦 Menú de Productos
            </span>
            <div className="flex-grow border-t border-neutral-100/70 ml-4"></div>
          </div>
        )}
        
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

      {/* Floating Cart Button INSIDE Overlay */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-[70] flex justify-center"
          >
            <div className="w-full max-w-md bg-neutral-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-neutral-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-neutral-900">
                    {cartCount}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-neutral-400">Tu Pedido</p>
                  <p className="text-sm font-black">${cartTotal.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={onClearCart}
                  className="px-4 py-3 rounded-2xl text-xs font-black bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                  Limpiar
                </button>
                <button 
                  onClick={onCheckout}
                  className="px-6 py-3 bg-[#00684a] rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-900/20"
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
