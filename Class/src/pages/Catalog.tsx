import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, ShoppingBag, Eye, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { getDB } from '../services/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext';
import { cn } from '@/src/lib/utils';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [brandFilter, setBrandFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, toggleWishlist, addToCart } = useAppContext();
  
  const currentCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    const fetchProducts = async () => {
      const db = await getDB();
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const items: Product[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(items);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Все товары', id: 'all' },
    { name: 'Костюмы', id: 'suits' },
    { name: 'Рубашки', id: 'shirts' },
    { name: 'Аксессуары', id: 'accessories' },
    { name: 'Обувь', id: 'shoes' },
  ];

  const brands = ['all', ...Array.from(new Set(products.map(p => (p as any).brand).filter(Boolean)))];
  const sizes = ['all', ...Array.from(new Set(products.flatMap(p => p.sizes || [])))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = brandFilter === 'all' || (p as any).brand === brandFilter;
    const matchesSize = sizeFilter === 'all' || p.sizes?.includes(sizeFilter);
    return matchesCategory && matchesSearch && matchesBrand && matchesSize;
  });

  return (
    <div className="bg-zinc-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-secondary mb-4 uppercase tracking-tighter italic">
              КАТАЛОГ<span className="text-primary ml-2">2026</span>
            </h1>
            <p className="text-zinc-500 max-w-md font-sans">
              Наша коллекция объединяет безупречный крой и современные материалы. 
              Найдите свой идеальный образ для любого случая.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl w-full md:w-64 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all font-bold uppercase text-[10px] tracking-widest text-secondary"
            >
              <SlidersHorizontal size={16} /> Фильтры
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className={cn(
            "lg:w-64 space-y-8",
            isFilterOpen ? "block" : "hidden lg:block"
          )}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-2">
                <Filter size={14} /> Категории
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams({ category: cat.id })}
                    className={cn(
                      "text-left px-4 py-3 rounded-xl transition-all font-bold uppercase text-[11px] tracking-widest",
                      currentCategory === cat.id 
                        ? "bg-secondary text-white shadow-lg" 
                        : "hover:bg-zinc-100 text-zinc-600"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
                        <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Бренд</h3>
              <select value={brandFilter} onChange={(e)=>setBrandFilter(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
                {brands.map((b) => <option key={b} value={b}>{b === 'all' ? 'Все бренды' : b}</option>)}
              </select>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">Размер</h3>
              <select value={sizeFilter} onChange={(e)=>setSizeFilter(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
                {sizes.map((sz) => <option key={sz} value={sz}>{sz === 'all' ? 'Все размеры' : sz}</option>)}
              </select>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl h-[450px] border border-zinc-100"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -5 }}
                      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 flex flex-col relative"
                    >
                      {/* Favorite Button */}
                      <button 
                        onClick={() => toggleWishlist(product.id || '')}
                        className={cn(
                          "absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md transition-all duration-300",
                          wishlist.includes(product.id || '') 
                            ? "bg-primary text-white scale-110 shadow-lg" 
                            : "bg-white/80 text-zinc-400 hover:text-red-500"
                        )}
                      >
                        <Heart size={18} fill={wishlist.includes(product.id || '') ? "currentColor" : "none"} />
                      </button>

                      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/5]">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-500" />
                        
                        {/* Hover Quick Actions */}
                        <div className="absolute bottom-4 inset-x-4 translate-y-12 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex gap-2">
                           <button 
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(product);
                            }}
                            className="bg-secondary text-white flex-grow py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black shadow-lg"
                           >
                             <ShoppingBag size={14} /> В корзину
                           </button>
                           <Link 
                            to={`/product/${product.id}`}
                            className="bg-white text-secondary p-3 rounded-xl hover:bg-zinc-50 shadow-lg"
                           >
                             <Eye size={18} />
                           </Link>
                        </div>
                      </Link>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="mb-auto">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-2 block">
                            {product.category}
                          </span>
                          <h3 className="font-display font-bold text-lg text-secondary group-hover:text-primary transition-colors line-clamp-1 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed font-sans opacity-70">
                            {product.description}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-xl font-display font-bold text-secondary">
                            {product.price.toLocaleString()} ₽
                          </span>
                          <div className="flex items-center gap-1">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              product.stock > 0 ? "bg-green-500" : "bg-red-500"
                            )} />
                            <span className="text-[9px] font-bold uppercase text-zinc-400">
                              {product.stock > 0 ? 'В наличии' : 'Ожидается'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="bg-zinc-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2 uppercase tracking-tighter">Ничего не найдено</h3>
                <p className="text-zinc-500 mb-8">Попробуйте изменить параметры поиска или фильтры.</p>
                <button 
                  onClick={() => {
                    setSearchParams({ category: 'all' });
                    setSearchQuery('');
                  }}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  Сбросить всё
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
