import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Contacts() {
  const locations = [
    {
      name: 'Основной магазин',
      address: 'ул. Каландаришвили, 30, 2 этаж',
      phone: '+7 (999) 000-00-00',
      hours: '10:00 - 20:00'
    }
  ];

  return (
    <div className="bg-white pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-bold tracking-widest uppercase text-xs">Свяжитесь с нами</span>
          <h1 className="text-5xl font-display font-bold mt-4 mb-6">Адреса и контакты</h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-lg">
            Мы всегда рады видеть вас в наших магазинах. Подберем идеальный костюм и ответим на любые вопросы.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info cards */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-8">Наши филиалы</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {locations.map((loc, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-4 text-secondary">{loc.name}</h3>
                  <div className="space-y-3 text-sm text-zinc-600">
                    <p className="flex items-start gap-2">
                      <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                      {loc.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-primary shrink-0" />
                      {loc.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={16} className="text-primary shrink-0" />
                      {loc.hours}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-8 border-t border-zinc-100 mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-400">Единый телефон</h4>
                <p className="text-2xl font-display font-bold">+7 (999) 000-00-00</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-zinc-400">Email</h4>
                <p className="text-2xl font-display font-bold">hello@classicmoda.ru</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-secondary p-10 rounded-2xl text-white">
            <h2 className="text-3xl font-display font-bold mb-6">Напишите нам</h2>
            <p className="text-zinc-400 mb-10">Оставьте ваши контакты, и наш менеджер свяжется с вами в течение 15 минут.</p>
            
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Ваше имя</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Телефон</label>
                <input 
                  type="tel" 
                  className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Сообщение (необязательно)</label>
                <textarea 
                  rows={4}
                  className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
                  placeholder="Например: хочу забронировать костюм"
                ></textarea>
              </div>
              <button className="w-full bg-primary py-4 rounded-lg font-bold text-white hover:bg-white hover:text-secondary transition-all flex items-center justify-center gap-2">
                Отправить <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
