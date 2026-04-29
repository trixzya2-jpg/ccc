import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Phone, MapPin, LogOut, Search, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { getAuthService } from '@/src/services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useAppContext } from '../context/AppContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const { cartCount, wishlist } = useAppContext();

  useEffect(() => {
    let unsubscribe: any;
    const initAuth = async () => {
      const auth = await getAuthService();
      if (auth) {
        unsubscribe = onAuthStateChanged(auth, (u) => {
          setUser(u);
        });
      }
    };
    initAuth();
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = await getAuthService();
    if (auth) {
      await signOut(auth);
    }
  };

  const navLinks = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 font-sans transition-all duration-300">
        {/* Top bar */}
        <div className="hidden md:flex bg-secondary text-white py-2 px-4 justify-between items-center text-[10px] tracking-widest uppercase font-bold">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone size={12} className="text-primary" /> +7 (999) 000-00-00</span>
            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> Улан-Удэ, ул. Каландаришвили, 30</span>
          </div>
          <div className="flex gap-6">
            <Link to="/admin" className="hover:text-primary transition-colors">Сотрудникам</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex flex-col group">
              <span className="text-xl md:text-2xl font-display font-black tracking-tighter leading-none group-hover:text-primary transition-colors italic">
                КЛАССИКА<span className="text-primary px-1">МОДА</span>
              </span>
              <span className="text-[8px] tracking-[0.4em] font-black text-zinc-400 uppercase mt-1">Authentic Menswear</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative py-1",
                    location.pathname === link.path ? "text-primary after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-zinc-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center gap-6">
              <div className="relative group/search">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-zinc-600 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Search size={20} />
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute right-full mr-2 top-1/2 -translate-y-1/2 overflow-hidden"
                    >
                      <input 
                        type="text" 
                        placeholder="Поиск костюма..." 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-full py-1.5 px-4 text-xs font-sans outline-none focus:ring-1 focus:ring-primary/20"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="text-zinc-600 hover:text-primary transition-colors relative">
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-zinc-600 hover:text-primary transition-colors relative"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center gap-4 border-l border-zinc-100 pl-6">
                  <Link to="/profile" className="text-zinc-600 hover:text-primary transition-colors flex items-center gap-2 group">
                     <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 group-hover:border-primary transition-colors">
                       {user.photoURL ? <img src={user.photoURL} alt="" /> : <User size={16} />}
                     </div>
                  </Link>
                  <button onClick={handleLogout} className="text-zinc-300 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-zinc-600 hover:text-primary transition-colors flex items-center gap-2 border-l border-zinc-100 pl-6">
                  <div className="p-2 bg-zinc-50 rounded-full group-hover:bg-primary/10 transition-colors">
                    <User size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Войти</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-zinc-600 relative"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-zinc-600 p-1"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-zinc-100 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-8 space-y-6">
                <div className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="block text-2xl font-display font-bold text-secondary hover:text-primary uppercase tracking-tighter"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-zinc-100 flex flex-col gap-6">
                   {user ? (
                     <div className="space-y-4">
                       <Link to="/profile" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 text-primary">
                         <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200">
                           {user.photoURL ? <img src={user.photoURL} alt="" /> : <User size={20} />}
                         </div>
                         Профиль
                       </Link>
                       <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 text-red-500">
                          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <LogOut size={20} />
                          </div>
                          Выйти из аккаунта
                       </button>
                     </div>
                   ) : (
                     <Link to="/login" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest flex items-center gap-3 text-secondary">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                          <User size={20} />
                        </div>
                        Войти в кабинет
                     </Link>
                   )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
