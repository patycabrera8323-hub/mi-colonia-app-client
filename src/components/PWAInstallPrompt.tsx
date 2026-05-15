import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');

  useEffect(() => {
    // Detectar plataforma
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');

    // Verificar si ya está instalada
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone;
    
    setIsStandalone(isPWA);

    // Lógica para Android/Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    // Para iOS, mostramos el prompt manualmente después de un tiempo si no es PWA
    if (isIOS && !isPWA) {
      setTimeout(() => setShowPrompt(true), 4000);
    }

    // Diagnóstico: si después de 10s no hay prompt en Android, mostrar ayuda manual
    const debugTimer = setTimeout(() => {
      if (isAndroid && !isPWA && !deferredPrompt) {
        setShowPrompt(true);
      }
    }, 10000);

    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(debugTimer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Para instalar en este equipo: Toca los 3 puntos de Chrome y selecciona 'Instalar aplicación' o 'Agregar a la pantalla principal'.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
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
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl border border-orange-100 rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(234,88,12,0.2)]">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Smartphone className="text-white w-7 h-7" />
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-tight">
                  {platform === 'ios' ? 'Instala en tu iPhone' : '¡Lleva Mi Colonia contigo!'}
                </h4>
                <p className="text-[11px] font-medium text-neutral-500 mt-0.5 leading-tight">
                  {platform === 'ios' 
                    ? 'Sigue los pasos para agregar a tu pantalla de inicio.' 
                    : 'Instala nuestra App para una experiencia más rápida.'}
                </p>
              </div>

              <button onClick={() => setShowPrompt(false)} className="p-2 text-neutral-300 hover:text-neutral-500">
                <X size={18} />
              </button>
            </div>

            {platform === 'ios' ? (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 border border-orange-100/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-orange-800">
                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">1</div>
                    <span>Toca el botón <span className="bg-white px-2 py-0.5 rounded border border-orange-200">Compartir</span> (cuadrado con flecha)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-orange-800">
                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">2</div>
                    <span>Selecciona <span className="bg-white px-2 py-0.5 rounded border border-orange-200">"Agregar a inicio"</span></span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="mt-4 w-full py-4 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                <Download size={14} />
                Instalar App Ahora
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

