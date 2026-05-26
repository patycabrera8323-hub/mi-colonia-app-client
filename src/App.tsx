import { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  X,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection,
  query,
  onSnapshot,
  doc,
  limit,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { Business, Product, Category, CartItem, Review, Promotion } from './types';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'sonner';

// Components
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { BusinessCard } from './components/BusinessCard';
import { BusinessOverlay } from './components/BusinessOverlay';
import { CheckoutPanel } from './components/CheckoutPanel';
import { OrdersOverlay, OrderData } from './components/OrdersOverlay';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PromotionalCarousel } from './components/PromotionalCarousel';

const SOUNDS = {
  preparing: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  on_route: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  delivered: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  default: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  // Add a safety check for initialization
  const [initError, setInitError] = useState<string | null>(null);
  
  // Existing states...
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessPromotions, setBusinessPromotions] = useState<Promotion[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [isAdminModeActive, setIsAdminModeActive] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const prevOrdersRef = useMemo(() => ({ current: [] as OrderData[] }), []);

  // Auth listener
  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
      // Reset admin mode on logout
      if (!u) {
        setIsAdminModeActive(false);
        setOrders([]);
      }
    });
  }, []);

  // Notification permissions
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Notification utility
  const sendNotification = (title: string, body: string, soundType?: 'preparing' | 'on_route' | 'delivered') => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    try {
      const soundUrl = soundType ? SOUNDS[soundType] : SOUNDS.default;
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (ae) {}

    try {
      const n = new Notification(title, { body, icon: '/logo.png' });
      setTimeout(() => n.close(), 5000);
    } catch (e) {
      console.warn("Error showing notification:", e);
    }
  };

  // Order status listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('clientId', 'in', [user.displayName || '', user.email || '', user.uid]),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: OrderData[] = [];
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const newData = change.doc.data() as OrderData;
          const oldData = prevOrdersRef.current.find(o => o.id === change.doc.id);
          
          if (oldData && oldData.status !== newData.status) {
            if (newData.status === 'confirmed' || newData.status === 'preparing') {
              sendNotification(
                '👨‍🍳 ¡Pedido Aceptado y Preparando!',
                `Tienda: ${newData.storeName || 'Negocio'}`,
                'preparing'
              );
            } else if (newData.status === 'on_route') {
              sendNotification(
                '🛵 ¡Finalizado en ruta o en camino!',
                `Tienda: ${newData.storeName || 'Negocio'}`,
                'on_route'
              );
            } else if (newData.status === 'delivered' || newData.status === 'completed') {
              sendNotification(
                '✅ ¡Pedido Entregado! Gracias por tu compra',
                `Tienda: ${newData.storeName || 'Negocio'}`,
                'delivered'
              );
            }
          }
        }
      });

      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as OrderData);
      });

      prevOrdersRef.current = ordersData;
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleTitleClick = () => {
    if (user?.email !== 'jicr109@gmail.com') return;
    
    setAdminClickCount(prev => {
      if (prev + 1 >= 5) {
        setIsAdminModeActive(!isAdminModeActive);
        toast.info(isAdminModeActive ? 'Modo Administrador desactivado' : 'Modo Administrador activado');
        return 0;
      }
      return prev + 1;
    });
  };

  // Fetch businesses
  useEffect(() => {
    setIsLoading(true);
    
    // PRODUCTION IMPROVEMENT (Point 2): Only show verified businesses to public
    let q = query(collection(db, 'businesses'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let bizData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Business));
      
      // Filter logic: Only show verified businesses to public
      // Also hide businesses with "Admin" in name unless Admin Mode is active
      if (!isAdminModeActive) {
        bizData = bizData.filter(b => 
          b.payment_verified === true && !(b.name || '').toLowerCase().includes('admin')
        );
      }

      setBusinesses(bizData);
      setIsLoading(false);
      setErrorDetails(null);
    }, (error) => {
      console.error("Error al cargar negocios:", error);
      setErrorDetails(`Error al leer negocios: ${error.message}.`);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user, isAdminModeActive]);

  // Fetch products, reviews, and promotions when business is selected
  useEffect(() => {
    if (!selectedBusiness) {
      setProducts([]);
      setReviews([]);
      setBusinessPromotions([]);
      return;
    }

    const productsRef = collection(db, 'businesses', selectedBusiness.id, 'products');
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      const prodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prodData);
    }, (error) => {
      console.error(error);
    });

    const reviewsRef = query(
      collection(db, 'businesses', selectedBusiness.id, 'reviews')
    );
    const unsubReviews = onSnapshot(reviewsRef, (snapshot) => {
      const reviewData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      const sorted = reviewData.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setReviews(sorted);
    }, (error) => {
      console.error(error);
    });

    const promotionsRef = query(
      collection(db, 'promotions'),
      where('businessId', '==', selectedBusiness.id),
      where('active', '==', true)
    );
    const unsubPromotions = onSnapshot(promotionsRef, (snapshot) => {
      const promoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));
      setBusinessPromotions(promoData);
    }, (error) => {
      console.error("Error fetching promotions for business:", error);
    });

    return () => {
      unsubProducts();
      unsubReviews();
      unsubPromotions();
    };
  }, [selectedBusiness]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const matchesCategory = selectedCategory === 'Todos' || 
                             (b.category || '').trim().toLowerCase() === selectedCategory.trim().toLowerCase();
      
      const matchesSearch = (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (b.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [businesses, selectedCategory, searchQuery]);

  const handleWhatsAppOrder = (business: Business) => {
    if (!business.isOpen || cart.length === 0) return;

    const itemsList = cart.map(item => `*${item.quantity}x* ${item.product.name} (_$${item.product.price.toLocaleString()}_)`).join('\n');
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tipAmount = subtotal >= 100 ? subtotal * 0.18 : 15;
    const total = subtotal + tipAmount;
    
    const message = `¡Hola! Me gustaría hacer un pedido en NegocioYa para *${business.name}*:\n\n${itemsList}\n\n*Dirección de entrega:* ${deliveryAddress}${orderNotes ? `\n*Notas:* ${orderNotes}` : ''}\n*Forma de pago:* ${paymentMethod}\n\n*Subtotal:* $${subtotal.toLocaleString()}\n*Propina (Repartidor):* $${tipAmount.toLocaleString()}\n━━━━━━━━━━━━━━\n*Total a pagar: $${total.toLocaleString()}*\n━━━━━━━━━━━━━━\n\n¿Me confirmarían el pedido?`;
    const phone = (business.phone || '').replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    toast.info('Redirigiendo a WhatsApp...');
  };

  const createInternalOrder = async (business: Business) => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar un pedido interno');
      handleLogin();
      return;
    }

    if (cart.length === 0) return;

    try {
      const orderData = {
        clientId: user.displayName || user.email || user.uid,
        storeId: business.id,
        storeName: business.name,
        status: 'pending',
        deliveryLocation: {
          address: deliveryAddress,
          lat: 0, // In a real app, we would get this from a map
          lng: 0
        },
        pickupLocation: {
          address: business.address || 'Tienda',
          lat: business.lat || 0,
          lng: business.lng || 0
        },
        items: cart.map(item => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: cartTotal,
        paymentMethod: paymentMethod,
        notes: orderNotes,
        createdAt: serverTimestamp(),
        driverId: null
      };

      await addDoc(collection(db, 'orders'), orderData);
      setCart([]);
      setOrderNotes('');
      setIsCheckoutOpen(false);
      setSelectedBusiness(null);
      toast.success('¡Pedido realizado con éxito! Un repartidor lo tomará pronto.');
    } catch (error) {
      console.error("Error creating internal order:", error);
      toast.error('Error al procesar el pedido. Intenta de nuevo.');
    }
  };

  const handleOrderSubmission = (business: Business) => {
    if (business.orderSystem === 'internal') {
      createInternalOrder(business);
    } else {
      handleWhatsAppOrder(business);
    }
  };

  const addToCart = (product: Product) => {

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`${product.name} agregado al carrito`);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('¡Sesión iniciada correctamente!');
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return;
      }
      toast.error('Error al iniciar sesión');
      console.error("Login Error:", error);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedBusiness || !auth.currentUser) return;
    if (!newReview.comment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const reviewsRef = collection(db, 'businesses', selectedBusiness.id, 'reviews');
      await addDoc(reviewsRef, {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Vecino',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp()
      });
      setNewReview({ rating: 5, comment: '' });
      toast.success('¡Reseña publicada! Gracias por tu opinión.');
    } catch (error) {
      toast.error('Error al publicar la reseña');
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getItemQuantity = (productId: string) => {
    return cart.find(item => item.product.id === productId)?.quantity || 0;
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTipAmount = cartSubtotal > 0 ? (cartSubtotal >= 100 ? cartSubtotal * 0.18 : 15) : 0;
  const cartTotal = cartSubtotal + cartTipAmount;

  return (
    <>
      <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      
      {!showWelcome && (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 pb-10">
          <Header 
            user={user} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onLogin={handleLogin} 
            onTitleClick={handleTitleClick}
            isAdminModeActive={isAdminModeActive}
          />

      {/* Orders floating button */}
      {user && orders.length > 0 && (
        <button 
          onClick={() => setIsOrdersOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs font-black uppercase tracking-widest pr-2">Mis Pedidos ({orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length})</span>
        </button>
      )}

      <main className="max-w-md mx-auto px-4 mt-6">
        {/* 🔥 Carrusel de Promociones */}
        <PromotionalCarousel onBusinessSelect={(bizId) => {
          const found = businesses.find(b => b.id === bizId);
          if (found) setSelectedBusiness(found);
        }} />

        <CategoryFilter 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />

        {/* Popular Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-orange-600 flex items-center gap-2">
              Populares Cerca <span className="animate-pulse">🔥</span>
            </h2>
            <button className="text-xs font-bold text-neutral-400">Ver todos</button>
          </div>

          <div className="grid grid-cols-4 gap-x-2 gap-y-6">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm" />
                    <div className="w-10 h-1.5 bg-neutral-200 rounded" />
                  </div>
                ))
              ) : errorDetails ? (
                <div className="col-span-full bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                  <p className="text-red-700 text-[10px] font-bold mb-1">Problema</p>
                  <p className="text-red-600 text-[8px]">{errorDetails}</p>
                </div>
              ) : filteredBusinesses.length === 0 ? (
                <div className="col-span-full py-16 px-4 bg-white rounded-3xl border border-dashed border-neutral-200 text-center">
                  <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-6 h-6 text-neutral-200" />
                  </div>
                  <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-1">Sin negocios</p>
                  <p className="text-neutral-400 text-[10px] leading-relaxed">
                    No hay negocios disponibles en este momento.
                  </p>
                </div>
              ) : (
                filteredBusinesses.map((biz) => (
                  <BusinessCard 
                    key={biz.id} 
                    biz={biz} 
                    onClick={() => setSelectedBusiness(biz)} 
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      
      <div className="max-w-md mx-auto px-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      <footer className="max-w-md mx-auto px-6 py-8 text-center">
        <div className="mb-8">
          <button 
            onClick={() => window.open('https://mi-colonia-admin.pages.dev/', '_blank')}
            className="inline-flex flex-col items-center gap-0.5 group"
          >
            <span className="text-[7px] font-bold text-neutral-500 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
              ¿Quieres que tu negocio crezca y tener más exposición? Contáctanos
            </span>
            <span className="text-[9px] font-black text-orange-600 group-hover:text-neutral-900 border-b border-orange-200 group-hover:border-neutral-900 transition-all uppercase tracking-[0.2em] mt-1">
              Click aquí
            </span>
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-1.5 opacity-80 hover:opacity-100 transition-all duration-500">
          <img src="/searmo-logo.png" alt="Searmo" className="h-5 w-auto object-contain" />
          <p className="text-[6px] font-bold uppercase tracking-[0.5em] text-neutral-500">Powered by Searmo</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedBusiness && (
          <BusinessOverlay
            business={selectedBusiness}
            products={products}
            reviews={reviews}
            promotions={businessPromotions}
            onClose={() => setSelectedBusiness(null)}
            onAddToCart={addToCart}
            onRemoveFromCart={removeFromCart}
            getItemQuantity={getItemQuantity}
            user={user}
            newReview={newReview}
            setNewReview={setNewReview}
            isSubmittingReview={isSubmittingReview}
            onSubmitReview={handleSubmitReview}
            onLogin={handleLogin}
            onProductClick={(product) => {
              setSelectedProduct(product);
              updateDoc(doc(db, 'businesses', selectedBusiness.id, 'products', product.id), {
                viewCount: increment(1)
              }).catch(err => console.error(err));
              setIsProductModalOpen(true);
            }}
            cartCount={cartCount}
            cartTotal={cartTotal}
            onCheckout={() => setIsCheckoutOpen(true)}
            onClearCart={() => setCart([])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProductModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm relative shadow-2xl overflow-hidden"
            >
              <button onClick={() => setIsProductModalOpen(false)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 shadow-md"><X className="w-4 h-4" /></button>
              
              {/* 3D viewer or image */}
              {selectedProduct.modelUrl ? (
                <div className="w-full h-64 bg-neutral-50 relative">
                  {/* @ts-ignore */}
                  <model-viewer
                    src={selectedProduct.modelUrl}
                    alt={selectedProduct.name}
                    auto-rotate
                    camera-controls
                    ar
                    style={{ width: '100%', height: '100%', background: 'transparent' }}
                  />
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-widest flex items-center gap-1 shadow-lg">
                    ✦ Vista 3D — Gira con tu dedo
                  </div>
                </div>
              ) : (
                <div className="w-full h-56 bg-neutral-100 overflow-hidden">
                  <img
                    src={selectedProduct.imageUrl || `https://picsum.photos/seed/${selectedProduct.id}/400`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-5">
                <h3 className="text-xl font-black text-neutral-900 mb-1">{selectedProduct.name}</h3>
                <p className="text-sm font-bold text-neutral-400 mb-3">Visto {(products.find(p => p.id === selectedProduct.id)?.viewCount) || 0} veces</p>
                <p className="text-neutral-500 mb-5 text-sm leading-relaxed">{selectedProduct.description}</p>
                <div className="flex items-center justify-between">
                   <p className="text-2xl font-black text-orange-600">${selectedProduct.price.toLocaleString()}</p>
                   <button onClick={() => {addToCart(selectedProduct); setIsProductModalOpen(false);}} className="bg-orange-600 text-white py-3 px-8 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-orange-500/20">PEDIR</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && selectedBusiness && (
          <CheckoutPanel
            cart={cart}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onClose={() => setIsCheckoutOpen(false)}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            onConfirm={() => {
              handleOrderSubmission(selectedBusiness);
            }}
            business={selectedBusiness}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOrdersOpen && (
          <OrdersOverlay 
            orders={orders} 
            onClose={() => setIsOrdersOpen(false)} 
          />
        )}
      </AnimatePresence>

      <PWAInstallPrompt />
        </div>
      )}
    </>
  );
}
