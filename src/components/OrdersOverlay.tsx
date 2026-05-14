import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  Bike, 
  Package 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  id: string;
  clientId: string;
  storeId: string;
  storeName?: string;
  status: 'pending' | 'confirmed' | 'accepted' | 'preparing' | 'on_route' | 'delivered' | 'cancelled' | 'completed';
  items: OrderItem[];
  total: number;
  createdAt: any;
  notes?: string;
}

const statusConfig = {
  pending:   { label: 'Pendiente',         icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-50' },
  confirmed: { label: 'Confirmado',        icon: CheckCircle2, color: 'text-teal-500',    bg: 'bg-teal-50' },
  accepted:  { label: 'Buscando Repartidor', icon: Bike,         color: 'text-blue-500',    bg: 'bg-blue-50' },
  preparing: { label: 'En Preparación',    icon: ChefHat,      color: 'text-orange-500',  bg: 'bg-orange-50' },
  on_route:  { label: 'En Camino',         icon: Truck,        color: 'text-purple-500',  bg: 'bg-purple-50' },
  delivered: { label: '¡Entregado!',       icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  completed: { label: 'Finalizado',        icon: ShoppingBag,  color: 'text-neutral-400', bg: 'bg-neutral-50' },
  cancelled: { label: 'Cancelado',         icon: X,            color: 'text-red-500',     bg: 'bg-red-50' },
};

interface OrdersOverlayProps {
  orders: OrderData[];
  onClose: () => void;
}

export function OrdersOverlay({ orders, onClose }: OrdersOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-md rounded-t-[3rem] p-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Mis Pedidos</h2>
            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">Estado en tiempo real</p>
          </div>
          <button onClick={onClose} className="p-3 bg-neutral-100 rounded-2xl text-neutral-400 hover:text-neutral-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-16 h-16 text-neutral-100 mx-auto mb-4" />
            <p className="text-neutral-400 font-bold">No tienes pedidos activos</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon;

              return (
                <div key={order.id} className="bg-neutral-50 border border-neutral-100 rounded-[2rem] p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">ID: {order.id.slice(0, 6)}</p>
                      <h3 className="font-black text-neutral-900 uppercase">{order.storeName || 'Tienda'}</h3>
                    </div>
                    <div className={cn("px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider", config.bg, config.color)}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {config.label}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs font-bold text-neutral-600">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Total Pagado</span>
                    <span className="text-lg font-black text-orange-600">${order.total.toLocaleString()}</span>
                  </div>

                  {/* Progress bar for the 7 steps (simplified) */}
                  <div className="mt-6 flex gap-1">
                    {['pending', 'confirmed', 'accepted', 'preparing', 'on_route', 'delivered', 'completed'].map((s, idx) => {
                      const statuses = ['pending', 'confirmed', 'accepted', 'preparing', 'on_route', 'delivered', 'completed'];
                      const currentIdx = statuses.indexOf(order.status);
                      const isPast = idx <= currentIdx;
                      return (
                        <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", isPast ? "bg-orange-500" : "bg-neutral-200")} />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
