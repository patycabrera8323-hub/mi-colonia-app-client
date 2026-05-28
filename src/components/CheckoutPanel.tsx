import { X, Truck, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem, Business } from '../types';

interface CheckoutPanelProps {
  cart: CartItem[];
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  business: Business;
}

export function CheckoutPanel({
  cart,
  deliveryAddress,
  setDeliveryAddress,
  paymentMethod,
  setPaymentMethod,
  onClose,
  onConfirm,
  orderNotes,
  setOrderNotes,
  business
}: CheckoutPanelProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tipAmount = subtotal >= 100 ? 25 : 20;
  const total = subtotal + tipAmount;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[60] bg-white flex flex-col"
    >
      <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-xl font-black text-neutral-900 uppercase">Confirmar Pedido</h3>
        <button onClick={onClose} className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
          <X className="w-5 h-5 text-neutral-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <label className="text-[10px] font-black text-neutral-400 uppercase block mb-3 tracking-widest">¿Dónde entregamos?</label>
          <div className="relative">
            <Truck className="absolute left-4 top-4 w-5 h-5 text-orange-600" />
            <textarea 
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Ej: Calle 5 #123, Depto 4B..."
              className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl p-4 pl-12 text-sm font-bold focus:border-orange-500 outline-none min-h-[100px] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-neutral-400 uppercase block mb-3 tracking-widest">¿Algún comentario o nota especial?</label>
          <div className="relative">
            <textarea 
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="Ej: Tocar timbre fuerte, sin cebolla, etc..."
              className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl p-4 text-sm font-bold focus:border-orange-500 outline-none min-h-[80px] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-neutral-400 uppercase block mb-3 tracking-widest">Forma de Pago</label>
          <div className="grid grid-cols-2 gap-3">
            {['Efectivo', 'Transferencia', 'Tarjeta'].map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`p-4 rounded-2xl text-xs font-black border-2 transition-all ${
                  paymentMethod === m 
                    ? 'border-orange-600 bg-orange-50 text-orange-600' 
                    : 'border-neutral-100 bg-white text-neutral-400'
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-100">
           <div className="flex justify-between mb-2">
             <span className="text-xs font-bold text-neutral-500">Subtotal</span>
             <span className="text-xs font-black text-neutral-900">${subtotal.toLocaleString()}</span>
           </div>
           <div className="flex justify-between mb-4">
             <span className="text-xs font-bold text-neutral-500">Propina Sugerida</span>
             <span className="text-xs font-black text-neutral-900">${tipAmount.toLocaleString()}</span>
           </div>
           <div className="border-t border-neutral-200 pt-4 flex justify-between">
             <span className="text-sm font-black text-neutral-900">TOTAL</span>
             <span className="text-lg font-black text-orange-600">${total.toLocaleString()}</span>
           </div>
        </div>
      </div>

      <div className="p-6 pb-10">
        <button 
          onClick={onConfirm}
          disabled={!deliveryAddress || !paymentMethod}
          className="w-full bg-orange-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
        >
          {business.orderSystem === 'internal' ? (
            <>
              <Truck className="w-5 h-5" />
              CONFIRMAR PEDIDO
            </>
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              PEDIR POR WHATSAPP
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
