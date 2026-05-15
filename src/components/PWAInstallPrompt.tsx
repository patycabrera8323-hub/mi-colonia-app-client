import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<'android' | 'ios' | 'other'>('other');
  const [showGuide, setShowGuide] = useState(false);

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

    // Si no está instalada, mostramos el banner siempre después de 5 segundos
    if (!isPWA) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (platform === 'ios') {
      setShowGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Si no hay prompt automático, mostramos la guía manual para Android
      setShowGuide(true);
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
          <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl border border-orange-100 rounded-[2.5rem] p-5 shadow-[0_20px_50px_rgba(234,88,12,0.25)]">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Smartphone className="text-white w-7 h-7" />
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-tight">
                  ¡Instala Mi Colonia!
                </h4>
                <p className="text-[11px] font-medium text-neutral-500 mt-0.5 leading-tight">
                  Disfruta de una experiencia más rápida y segura desde tu pantalla de inicio.
                </p>
              </div>

              <button onClick={() => setShowPrompt(false)} className="p-2 text-neutral-300 hover:text-neutral-500">
                <X size={18} />
              </button>
            </div>

            <AnimatePresence>
              {showGuide ? (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 bg-orange-50 rounded-2xl p-4 border border-orange-100/50"
                >
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Instrucciones de instalación:</p>
                    {platform === 'ios' ? (
                      <>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-orange-800">
                          <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">1</div>
                          <span>Toca el botón <span className="bg-white px-2 py-0.5 rounded border border-orange-200">Compartir</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-orange-800">
                          <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">2</div>
                          <span>Selecciona <span className="bg-white px-2 py-0.5 rounded border border-orange-200">"Agregar a inicio"</span></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-orange-800">
                          <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">1</div>
                          <span>Toca los <span className="bg-white px-2 py-0.5 rounded border border-orange-200">3 puntos (⋮)</span> de Chrome</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold text-orange-800">
                          <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">2</div>
                          <span>Busca <span className="bg-white px-2 py-0.5 rounded border border-orange-200">"Instalar aplicación"</span></span>
                        </div>
                      </>
                    )}
                    <button 
                      onClick={() => setShowGuide(false)}
                      className="w-full mt-2 text-[10px] font-bold text-orange-400 underline"
                    >
                      Volver al botón
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="mt-4 w-full py-4 bg-neutral-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-95 transition-all shadow-xl shadow-black/10"
                >
                  <Download size={14} />
                  {platform === 'ios' ? 'Ver cómo instalar' : 'Instalar App Ahora'}
                </button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


