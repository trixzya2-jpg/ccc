import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, cartTotal } = useAppContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="text-xl font-bold font-display uppercase tracking-tight">Корзина</h2>
                <span className="bg-zinc-100 text-zinc-500 text-xs px-2 py-0.5 rounded-full font-bold">
                  {cart.length}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-6 bg-zinc-50 rounded-full text-zinc-300">
                    <ShoppingBag size={48} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Ваша корзина пуста</h3>
                    <p className="text-zinc-400 text-sm">Самое время добавить в неё что-нибудь элегантное</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    В каталог
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-zinc-100 rounded-xl overflow-hidden shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-sm line-clamp-1 mb-1">{item.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                          {item.selectedSize && <span>Размер: {item.selectedSize}</span>}
                          {item.selectedColor && <span>• {item.selectedColor}</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{item.price.toLocaleString()} ₽</span>
                        <div className="flex items-center gap-3">
                           <span className="text-xs text-zinc-400">× {item.quantity}</span>
                           <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-100 space-y-4 bg-zinc-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-medium font-sans">Итого:</span>
                  <span className="text-2xl font-bold font-display">{cartTotal.toLocaleString()} ₽</span>
                </div>
                <button className="w-full bg-secondary text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all group">
                  Оформить заказ
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onClose}
                  className="w-full text-zinc-400 font-bold uppercase text-[10px] tracking-widest text-center hover:text-primary transition-colors"
                >
                  Продолжить покупки
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
