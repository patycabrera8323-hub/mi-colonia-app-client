import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada o en modo standalone
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone || 
                  document.referrer.includes('android-app://');
    
    setIsStandalone(isPWA);

    const handler = (e: Event) => {
      // Prevenir que el navegador muestre su propio prompt
      e.preventDefault();
      // Guardar el evento para dispararlo luego
      setDeferredPrompt(e);
      // Mostrar nuestro banner después de un pequeño delay para no ser invasivos
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt del navegador
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-[9999] md:left-auto md:right-8 md:w-96"
        >
          <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-orange-100 rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(234,88,12,0.15)] group">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors" />
            
            <div className="flex items-center gap-4">
              {/* Icon container */}
              <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Smartphone className="text-white w-7 h-7" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
                </motion.div>
              </div>

              {/* Text content */}
              <div className="flex-1">
                <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-tight">
                  ¡Lleva Mi Colonia contigo!
                </h4>
                <p className="text-[11px] font-medium text-neutral-500 mt-0.5 leading-tight">
                  Instala nuestra App para una experiencia más rápida y segura.
                </p>
              </div>

              {/* Close button */}
              <button 
                onClick={() => setShowPrompt(false)}
                className="p-2 text-neutral-300 hover:text-neutral-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Action button */}
            <button
              onClick={handleInstallClick}
              className="mt-4 w-full py-3.5 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-95 transition-all shadow-xl shadow-black/10"
            >
              <Download size={14} />
              Instalar App Ahora
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
