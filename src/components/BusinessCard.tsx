import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Business } from '../types';

interface BusinessCardProps {
  biz: Business;
  onClick: () => void;
}

export function BusinessCard({ biz, onClick }: BusinessCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group cursor-pointer"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-sm group-hover:shadow-md group-hover:border-orange-200 transition-all duration-300">
          <img 
            src={biz.logoUrl || `https://picsum.photos/seed/${biz.id}/200`} 
            alt={biz.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Open/Closed Indicator */}
        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
          biz.isOpen ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="w-1 bg-white rounded-full h-1 animate-pulse" />
        </div>
        
        {/* Pending Badge */}
        {!biz.payment_verified && (
          <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm transform scale-110">
            PENDIENTE
          </div>
        )}
      </div>
      
      <div className="text-center w-full px-1">
        <h3 className="text-[9px] font-black uppercase tracking-tight text-neutral-900 line-clamp-1 group-hover:text-orange-600 transition-colors leading-tight">
          {biz.name}
        </h3>
        <div className="flex items-center justify-center gap-0.5">
           <Star className="w-2 h-2 fill-orange-500 text-orange-500" />
           <span className="text-[8px] font-black text-neutral-500">
             {biz.rating || '4.5'}
           </span>
        </div>
      </div>
    </motion.div>
  );
}
