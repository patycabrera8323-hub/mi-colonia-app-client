import { 
  UtensilsCrossed, 
  HeartPulse, 
  ShoppingBag, 
  Wrench, 
  LayoutGrid 
} from 'lucide-react';
import { Category } from '../types';

const CATEGORIES: { name: Category; icon: any; color: string }[] = [
  { name: 'Todos', icon: LayoutGrid, color: 'bg-purple-500' },
  { name: 'Comida', icon: UtensilsCrossed, color: 'bg-pink-500' },
  { name: 'Salud', icon: HeartPulse, color: 'bg-orange-600' },
  { name: 'Retail', icon: ShoppingBag, color: 'bg-blue-600' },
  { name: 'Servicio', icon: Wrench, color: 'bg-cyan-600' },
];

interface CategoryFilterProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
}

export function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  return (
    <section className="mb-8">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className="flex flex-col items-center gap-2 group shrink-0"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              selectedCategory === cat.name 
                ? `${cat.color} text-white shadow-lg shadow-${cat.color.split('-')[1]}-500/30 scale-110` 
                : 'bg-white text-neutral-500 hover:bg-neutral-100'
            }`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <span className={`text-xs font-semibold ${selectedCategory === cat.name ? 'text-neutral-900' : 'text-neutral-500'}`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
