import { Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  isOpen: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onSelect: () => void;
}

export function ProductCard({ product, quantity, isOpen, onAdd, onRemove, onSelect }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-3 shadow-sm border border-neutral-100 flex gap-4 items-start relative overflow-hidden transition-all duration-300"
    >
      <div 
        className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-neutral-50 shadow-inner cursor-pointer"
        onClick={onSelect}
      >
        <img 
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/200`} 
          alt={product.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-sm font-black text-neutral-900 mb-0.5 truncate leading-tight uppercase tracking-tight">{product.name}</h4>
        <p className="text-[11px] text-neutral-500 font-medium line-clamp-2 mb-2 leading-snug">{product.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-black text-orange-600 tracking-tight">${product.price.toLocaleString()}</span>
          
          <div className="flex items-center gap-1.5">
            {quantity > 0 ? (
              <div className="flex items-center bg-neutral-100 rounded-xl p-0.5 gap-2 border border-neutral-200/50">
                <button 
                  onClick={onRemove}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white text-orange-600 shadow-sm active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-black min-w-[16px] text-center">
                  {quantity}
                </span>
                <button 
                  disabled={!product.isAvailable || !isOpen}
                  onClick={onAdd}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm active:scale-90 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                disabled={!product.isAvailable || !isOpen}
                onClick={onAdd}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-black transition-all shadow-lg shadow-orange-500/10 ${
                  product.isAvailable && isOpen
                    ? 'bg-orange-600 text-white active:scale-95' 
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Plus className="w-3 h-3" />
                {isOpen ? (product.isAvailable ? 'PEDIR' : 'AGOTADO') : 'CERRADO'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
