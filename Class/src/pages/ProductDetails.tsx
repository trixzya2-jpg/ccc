import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, Star, Share2, Ruler, Shield, RotateCcw, Truck, Heart, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { getDB } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext';
import { cn } from '@/src/lib/utils';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addToCart, wishlist, toggleWishlist } = useAppContext();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const db = await getDB();
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(data);
          if (data.sizes && data.sizes.length > 0) {
            setSelectedSize(data.sizes[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
       <h1 className="text-3xl font-display font-bold mb-4">ТОВАР НЕ НАЙДЕН</h1>
       <p className="text-zinc-500 mb-8 max-w-sm font-sans">К сожалению, запрашиваемый товар больше не доступен или был перемещен.</p>
       <Link to="/catalog" className="bg-primary text-secondary px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">Вернуться в каталог</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-10">
          <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
          <div className="w-1 h-1 bg-zinc-300 rounded-full" />
          <Link to={`/catalog?category=${product.category}`} className="hover:text-primary transition-colors lowercase">{product.category}</Link>
          <div className="w-1 h-1 bg-zinc-300 rounded-full" />
          <span className="text-secondary truncate italic">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="aspect-[4/5] rounded-[40px] overflow-hidden bg-zinc-50 relative group shadow-2xl"
            >
              <img 
                src={product.images[activeImage]} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={product.name} 
              />
              <button 
                onClick={() => toggleWishlist(product.id || '')}
                className={cn(
                  "absolute top-6 right-6 p-4 rounded-full backdrop-blur-md shadow-xl transition-all duration-300 transform",
                  wishlist.includes(product.id || '') 
                    ? "bg-primary text-white scale-110" 
                    : "bg-white/80 text-zinc-400 hover:text-red-500"
                )}
              >
                <Heart size={20} fill={wishlist.includes(product.id || '') ? "currentColor" : "none"} />
              </button>
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1",
                      activeImage === idx ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-transparent bg-zinc-50 hover:border-zinc-200"
                    )}
                  >
                    <img src={img} className="w-full h-full object-cover rounded-xl" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-primary">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-2">5.0 / 12 отзывов</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-secondary leading-tight uppercase tracking-tighter italic mb-6">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-display font-bold text-primary">
                  {product.price.toLocaleString()} ₽
                </span>
                <span className="text-zinc-300 line-through text-lg font-display">
                  {(product.price * 1.2).toLocaleString()} ₽
                </span>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10 p-8 bg-zinc-50 rounded-[40px] border border-zinc-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Выберите размер
                </h3>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:underline group"
                >
                  <Ruler size={16} className="group-hover:rotate-12 transition-transform" /> Таблица размеров
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold transition-all border-2",
                      selectedSize === size 
                        ? "bg-secondary text-white border-secondary shadow-xl shadow-secondary/20 scale-105" 
                        : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addToCart(product, selectedSize)}
                className="flex-grow bg-secondary text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 hover:bg-black hover:scale-[1.02] transition-all shadow-2xl shadow-secondary/20 group"
              >
                <ShoppingBag size={20} />
                Добавить в корзину
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => toggleWishlist(product.id || '')}
                className={cn(
                  "p-6 rounded-3xl border-2 transition-all flex items-center justify-center",
                  wishlist.includes(product.id || '') 
                    ? "bg-red-50 border-red-200 text-red-500 shadow-lg shadow-red-500/10" 
                    : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200 hover:bg-zinc-50"
                )}
              >
                <Heart size={24} fill={wishlist.includes(product.id || '') ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Description & Features */}
            <div className="space-y-10">
              <div className="bg-white border border-zinc-100 rounded-3xl p-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 border-b border-zinc-50 pb-2">Описание</h3>
                <p className="text-zinc-600 font-sans leading-relaxed text-sm italic">
                  {product.description}
                </p>
              </div>
              
              {product.features && (
                <div className="p-6 bg-secondary text-white rounded-[40px] shadow-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                     <Shield size={14} /> Особенности модели
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-zinc-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shrink-0 px-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-12 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 group">
                <div className="p-4 bg-zinc-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Гарантия</p>
                  <p className="text-[10px] text-zinc-400 font-sans">Безупречный крой</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-4 bg-zinc-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Доставка</p>
                  <p className="text-[10px] text-zinc-400 font-sans">Примерка на дому</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-4 bg-zinc-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Сервис</p>
                  <p className="text-[10px] text-zinc-400 font-sans">Подгонка по фигуре</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="fixed left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 top-10 md:top-1/2 md:-translate-y-1/2 w-full max-w-2xl bg-white rounded-[40px] p-6 md:p-12 z-[101] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 right-0 w-32 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
              <div className="relative">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-display font-black text-secondary italic uppercase tracking-tighter">ГИД ПО<span className="text-primary ml-2">РАЗМЕРАМ</span></h2>
                  <button onClick={() => setIsSizeGuideOpen(false)} className="p-3 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
                    <X size={24} />
                  </button>
                </div>
                
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-zinc-100">
                        <th className="py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Размер (RU)</th>
                        <th className="py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Плечи (см)</th>
                        <th className="py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Грудь (см)</th>
                        <th className="py-5 text-xs font-black uppercase tracking-widest text-zinc-400">Рукав (см)</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-secondary">
                      {[
                        { s: '48 (M)', p: '44', g: '96-100', r: '62' },
                        { s: '50 (L)', p: '46', g: '100-104', r: '63' },
                        { s: '52 (XL)', p: '48', g: '104-108', r: '64' },
                        { s: '54 (XXL)', p: '50', g: '108-112', r: '65' },
                        { s: '56 (3XL)', p: '52', g: '112-116', r: '66' }
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                          <td className="py-5 text-primary italic">{row.s}</td>
                          <td className="py-5">{row.p}</td>
                          <td className="py-5">{row.g}</td>
                          <td className="py-5">{row.r}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-12 p-8 bg-zinc-50 rounded-[30px] border border-dashed border-zinc-200">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0 text-primary">
                       <Ruler size={20} />
                    </div>
                    <div>
                      <p className="text-secondary font-bold text-sm mb-2 uppercase tracking-tight">Как мы измеряем?</p>
                      <p className="text-zinc-500 text-xs italic leading-relaxed">
                        Все замеры производятся по внешнему краю изделия в разложенном виде. Погрешность может составлять 1-2 см. Если вы сомневаетесь — наш специалист проведет замеры специально для вас по видеосвязи или WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
