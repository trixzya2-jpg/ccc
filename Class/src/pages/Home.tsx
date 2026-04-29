import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Award, ShieldCheck, Truck, PlayCircle, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_NAME } from '../constants';
import { getDB } from '../services/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { Product } from '../types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchFeatured = async () => {
      const db = await getDB();
      if (!db) return;
      try {
        const q = query(collection(db, 'products'), limit(4));
        const snap = await getDocs(q);
        const items: Product[] = [];
        snap.forEach(doc => items.push({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(items);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Костюмы', image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000', slug: 'suits', desc: 'Безупречный крой для важных событий' },
    { name: 'Рубашки', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000', slug: 'shirts', desc: 'Комфорт и стиль на каждый день' },
    { name: 'Аксессуары', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000', slug: 'accessories', desc: 'Детали, которые создают образ' },
  ];

  const journalPosts = [
    { title: 'Как выбрать идеальный костюм-тройку', date: '12 Апр 2026', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600' },
    { title: 'Тренды мужской моды: Весна 2026', date: '05 Апр 2026', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600' },
    { title: 'Искусство завязывания галстука', date: '28 Мар 2026', image: 'https://images.unsplash.com/photo-1523268755815-fe7c372a0349?q=80&w=600' },
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2000" 
            className="w-full h-full object-cover scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="max-w-2xl text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-0.5 bg-primary" />
              <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-primary">Премиум Коллекция 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black leading-[0.9] mb-8 uppercase tracking-tighter italic">
              ИСКУССТВО<br />
              <span className="text-primary">БЫТЬ</span><br />
              ДЖЕНТЛЬМЕНОМ
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-lg leading-relaxed font-sans">
              Одежда, которая говорит о вашем статусе без лишних слов. Откройте для себя мир высокой мужской моды в Улан-Удэ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="px-10 py-5 bg-primary text-secondary font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                Смотреть каталог <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-10 py-5 border-2 border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-secondary transition-all flex items-center justify-center gap-2">
                <PlayCircle size={18} /> О бренде
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/30">
          <div className="w-0.5 h-16 bg-gradient-to-b from-white/50 to-transparent mb-2" />
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Листайте вниз</span>
        </div>
      </section>

      {/* Featured Statistics / Philosophy */}
      <section className="py-12 md:py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: <Award size={32} />, label: 'Премиум бренды', sub: 'Только лучшие лекала' },
              { icon: <ShieldCheck size={32} />, label: 'Гарантия качества', sub: '100% натуральные ткани' },
              { icon: <Truck size={32} />, label: 'Примерка у вас', sub: 'Бесплатная доставка по городу' },
              { icon: <Star size={32} />, label: 'Индивидуальный крой', sub: 'Подгонка по вашей фигуре' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="text-center p-6 md:p-8 bg-white rounded-[30px] md:rounded-[40px] shadow-xl shadow-zinc-200/50 border border-zinc-100 flex flex-col items-center"
              >
                <div className="text-primary mb-6 p-4 bg-primary/10 rounded-2xl md:rounded-3xl">{item.icon}</div>
                <h4 className="font-bold text-secondary mb-2 uppercase tracking-tighter text-sm md:text-lg leading-tight">{item.label}</h4>
                <p className="text-zinc-400 text-[10px] font-sans tracking-wide">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-4">
            <div className="text-center md:text-left">
              <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Ваш гардероб</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-secondary uppercase tracking-tighter mt-2 italic">ВЫБЕРИТЕ<span className="text-primary ml-2">СТИЛЬ</span></h2>
            </div>
            <Link to="/catalog" className="text-sm font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors uppercase tracking-widest">Все категории</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative h-[450px] md:h-[600px] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl"
              >
                <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent opacity-80" />
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">{category.desc}</span>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 uppercase tracking-tighter italic">{category.name}</h3>
                  <Link 
                    to={`/catalog?category=${category.slug}`}
                    className="w-14 h-14 md:w-16 h-16 bg-white rounded-full flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-all shadow-xl"
                  >
                    <ArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter mb-4 italic">НОВИНКИ<span className="text-primary ml-4">СЕЗОНА</span></h2>
              <p className="text-zinc-400 max-w-md font-sans">Самые свежие поступления прямиком с последних показов. Ограниченные серии.</p>
            </div>
            <Link to="/catalog" className="px-10 py-4 bg-white text-secondary rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">Смотреть все</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group bg-white/5 backdrop-blur-md rounded-[30px] md:rounded-[40px] p-4 border border-white/5 hover:border-primary/30 transition-all"
              >
                <div className="aspect-[3/4] rounded-[24px] md:rounded-[30px] overflow-hidden mb-6 relative">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link to={`/product/${product.id}`} className="p-4 bg-white text-secondary rounded-full hover:bg-primary hover:text-white transition-all">
                      <ShoppingBag size={20} />
                    </Link>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h4 className="font-bold text-base md:text-lg mb-1 truncate group-hover:text-primary transition-colors italic uppercase tracking-tighter">{product.name}</h4>
                  <p className="text-primary font-black text-lg md:text-xl font-display">{product.price.toLocaleString()} ₽</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Journal Section */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-6">
              <BookOpen size={24} />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-secondary uppercase tracking-tighter italic">ЖУРНАЛ<span className="text-primary ml-2">КЛАССИКИ</span></h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto font-sans italic px-4">Советы по стилю, правила этикета и главные новости мира мужской моды</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {journalPosts.map((post, i) => (
              <motion.article 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[30px] md:rounded-[40px] overflow-hidden shadow-xl shadow-zinc-200/50 group flex flex-col"
              >
                <div className="h-48 md:h-64 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                    {post.date}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-lg md:text-xl font-bold text-secondary mb-6 line-clamp-2 hover:text-primary transition-colors leading-tight italic uppercase tracking-tighter">{post.title}</h3>
                  <div className="mt-auto">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-all group-hover:gap-4">
                      Читать статью <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="container mx-auto px-0">
          <div className="bg-primary rounded-[30px] md:rounded-[60px] p-8 md:p-24 relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 max-w-2xl text-secondary">
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-8 italic leading-none">ПОЛУЧИТЕ<br /><span className="text-white">СКИДКУ 10%</span><br />НА ПЕРВЫЙ КОСТЮМ</h2>
              <p className="text-base md:text-lg mb-10 text-secondary/80 font-sans tracking-tight">Подпишитесь на наши новости и получите привилегии члена закрытого клуба джентльменов.</p>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={e => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Ваш e-mail" 
                  className="flex-grow px-8 py-4 md:py-5 rounded-full bg-white/40 border-2 border-white/50 backdrop-blur-md text-secondary placeholder:text-secondary/50 outline-none focus:bg-white transition-all font-bold"
                />
                <button className="px-10 py-4 md:py-5 bg-secondary text-white rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-all shadow-xl">
                  Подписаться
                </button>
              </form>
            </div>
            
            {/* Visual element */}
            <div className="absolute right-0 bottom-0 hidden lg:block translate-y-20 translate-x-20 opacity-20 rotate-12">
               <ShoppingBag size={400} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
