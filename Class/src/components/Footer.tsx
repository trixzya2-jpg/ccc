import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail, ChevronRight, ShoppingBag } from 'lucide-react';
import { STORE_NAME } from '../constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white pt-24 pb-12 overflow-hidden relative font-sans">
      {/* Visual Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link to="/" className="flex flex-col group">
              <span className="text-3xl font-display font-black tracking-tighter leading-none italic group-hover:text-primary transition-colors">
                КЛАССИКА<span className="text-primary px-1">МОДА</span>
              </span>
              <span className="text-[10px] tracking-[0.4em] font-black text-zinc-500 uppercase mt-2">Authentic Menswear</span>
            </Link>
            <p className="text-zinc-400 text-sm font-sans leading-relaxed italic">
              Мы создаем не просто одежду, а образ жизни. Безупречный крой и внимание к каждой детали для тех, кто не ищет компромиссов в стиле.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl">
                <Instagram size={20} />
              </a>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 italic font-black text-xs">
                VK
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 italic font-black text-xs">
                TG
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-10 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-primary" /> Навигация
            </h4>
            <ul className="space-y-4">
              {[
                { name: 'Главная', path: '/' },
                { name: 'Каталог', path: '/catalog' },
                { name: 'Новинки', path: '/catalog?category=suits' },
                { name: 'Контакты', path: '/contacts' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2 group">
                    <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-10 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-primary" /> Контакты
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Адрес</p>
                  <p className="text-sm text-zinc-300 font-sans italic">Улан-Удэ, ул. Каландаришвили, 30</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                 <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Телефон</p>
                  <p className="text-sm text-zinc-300 font-sans font-bold">+7 (999) 000-00-00</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">E-mail</p>
                  <p className="text-sm text-zinc-300 font-sans">luxury@classicfashion.ru</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / App Info */}
          <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShoppingBag size={100} />
             </div>
             <h4 className="text-xl font-display font-black italic uppercase tracking-tighter mb-4 leading-tight">
               ПРИСОЕДИНЯЙТЕСЬ К КЛУБУ
             </h4>
             <p className="text-zinc-500 text-[10px] font-sans leading-relaxed mb-8 uppercase tracking-widest font-bold">
               Эксклюзивные предложения для ценителей классики.
             </p>
             <Link to="/login" className="w-full py-4 bg-primary text-secondary rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
               Вступить в клуб
             </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; {currentYear} {STORE_NAME}. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
          </p>
          <div className="flex gap-8 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
