import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuthService, getDB } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User, Package, Heart, Settings, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe: any;
    const init = async () => {
      const auth = await getAuthService();
      const db = await getDB();
      
      if (!auth || !db) {
        setLoading(false);
        return;
      }

      unsubscribe = onAuthStateChanged(auth, async (u) => {
        if (u) {
          setUser(u);
          const userRef = doc(db, 'users', u.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setDbUser(userSnap.data());
          }
          setLoading(false);
        } else {
          navigate('/login');
        }
      });
    };
    init();
    return () => unsubscribe && unsubscribe();
  }, [navigate]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100 flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-primary" />
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl font-display font-bold text-secondary mb-1">
              {user?.displayName || 'Клиент Классики'}
            </h1>
            <p className="text-zinc-500 mb-4">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest rounded-full">
                {dbUser?.roles?.[0] || 'customer'}
              </span>
              <span className="px-3 py-1 bg-zinc-100 text-zinc-500 text-[10px] uppercase font-bold tracking-widest rounded-full">
                ID: {user?.uid.substring(0, 8)}
              </span>
            </div>
          </div>
          <button className="p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all text-zinc-400">
            <Settings size={20} />
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order history placeholder */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Package size={24} />
              </div>
              <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Все заказы</button>
            </div>
            <h3 className="text-xl font-bold mb-2">Заказы</h3>
            <p className="text-zinc-500 text-sm mb-6">История ваших покупок и статус текущих заказов.</p>
            <div className="py-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
               <p className="text-zinc-400 text-sm">У вас пока нет заказов</p>
               <Link to="/catalog" className="text-primary text-xs font-bold uppercase mt-2 inline-block">В каталог</Link>
            </div>
          </motion.div>

          {/* Favorites placeholder */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100"
          >
             <div className="flex justify-between items-center mb-6">
              <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                <Heart size={24} />
              </div>
              <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Перейти</button>
            </div>
            <h3 className="text-xl font-bold mb-2">Избранное</h3>
            <p className="text-zinc-500 text-sm mb-6">Товары, которые вы сохранили для будущих покупок.</p>
             <div className="py-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
               <p className="text-zinc-400 text-sm">Список пуст</p>
            </div>
          </motion.div>
        </div>

        {/* Support section */}
        <div className="mt-10 bg-secondary rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-display font-bold mb-2">Нужна помощь специалиста?</h3>
            <p className="text-zinc-400">Наши менеджеры всегда готовы помочь вам с выбором или заказом.</p>
          </div>
          <Link to="/contacts" className="px-8 py-4 bg-primary rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2">
            <ShoppingBag size={20} /> Связаться с нами
          </Link>
        </div>
      </div>
    </div>
  );
}
