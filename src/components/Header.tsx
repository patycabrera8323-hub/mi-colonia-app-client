import { Search } from 'lucide-react';
import { auth } from '../lib/firebase';

interface HeaderProps {
  user: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogin: () => void;
  onTitleClick: () => void;
  isAdminModeActive: boolean;
}

export function Header({ user, searchQuery, setSearchQuery, onLogin, onTitleClick, isAdminModeActive }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 py-4 border-b border-neutral-100">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div 
            onClick={onTitleClick}
            className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          >
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-black tracking-tight text-neutral-900">
              MI <span className="text-orange-600">COLONIA</span>
            </h1>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              {isAdminModeActive && (
                <span className="text-[7px] font-black bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Admin Active</span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-neutral-400 hidden sm:block">{user.displayName}</span>
                <button 
                  onClick={() => auth.signOut()}
                  className="w-8 h-8 rounded-full border-2 border-orange-200 overflow-hidden shadow-sm active:scale-95 transition-transform"
                >
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-full h-full object-cover" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="text-[10px] font-black uppercase text-neutral-400 hover:text-orange-600 transition-colors"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Busca comida, tiendas..."
            className="w-full bg-neutral-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}
