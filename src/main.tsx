import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Toaster } from 'sonner';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Auto-actualización: cuando hay una nueva versión de la app,
// el Service Worker la toma de inmediato y recarga la página de forma transparente.
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Nueva versión disponible → recargar automáticamente
    console.log('[SW] Nueva versión disponible. Actualizando...');
    window.location.reload();
  },
  onOfflineReady() {
    console.log('[SW] App lista para funcionar sin internet.');
  },
  onRegisteredSW(_swScriptUrl, registration) {
    if (!registration) return;
    // Revisar actualizaciones cada 60 segundos
    setInterval(() => {
      registration.update();
    }, 60 * 1000);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" richColors />
  </StrictMode>,
);
