import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, Smartphone, ArrowRight, Star } from 'lucide-react';

export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró antes
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome_MiColonia');
    if (!hasSeenWelcome) {
      setIsVisible(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleStart = () => {
    localStorage.setItem('hasSeenWelcome_MiColonia', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 500); // Dar tiempo a la animación de salida
  };

  if (!isVisible) return null;

  const features = [
    {
      icon: <Zap className="text-orange-500" />,
      title: "Ultra Rápida",
      desc: "Navega y pide en segundos sin esperas."
    },
    {
      icon: <Smartphone className="text-amber-500" />,
      title: "Espacio Cero",
      desc: "No llena la memoria de tu celular. Es ligera y potente."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" />,
      title: "Segura y Confiable",
      desc: "Tecnología de última generación sin descargas pesadas."
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-between p-8 overflow-hidden"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[50%] bg-orange-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[50%] bg-amber-50 rounded-full blur-[120px] opacity-60" />
          </div>

          <div className="w-full max-w-sm flex flex-col items-center mt-12">
            {/* Logo area */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-200">
                <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain brightness-0 invert" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h1 className="text-3xl font-black text-neutral-900 leading-tight">
                Bienvenido a <br/>
                <span className="text-orange-600">Mi Colonia App</span>
              </h1>
              <p className="text-neutral-500 text-sm mt-4 font-medium px-4">
                La forma más inteligente y ligera de pedir en tu colonia. Sin descargar nada pesado.
              </p>
            </motion.div>

            {/* Features list */}
            <div className="w-full space-y-6 mt-12 px-2">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex items-start gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight">{f.title}</h3>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="w-full max-w-sm pb-8"
          >
            <button
              onClick={handleStart}
              className="w-full py-5 bg-neutral-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-orange-600 active:scale-95 transition-all shadow-2xl shadow-black/10"
            >
              Comenzar Experiencia
              <ArrowRight size={16} />
            </button>
            <p className="text-center text-[9px] text-neutral-400 mt-4 font-bold uppercase tracking-widest">
              Tecnología PWA Premium • Mi Colonia 2026
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
