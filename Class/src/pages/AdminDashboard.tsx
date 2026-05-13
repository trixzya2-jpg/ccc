import React, { useState, useEffect } from 'react';
import { getDB, getAuthService } from '../services/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Package, Image, Tag, DollarSign, LayoutDashboard } from 'lucide-react';
import { Product } from '../types';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tab, setTab] = useState<'products'|'orders'|'stats'>('products');
  const [orders, setOrders] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'suits',
    image: '',
    stock: 0,
    sizes: ''
  });

  useEffect(() => {
    let unsubscribe: any;
    const setup = async () => {
      const auth = await getAuthService();
      if (!auth) {
        setLoading(false);
        return;
      }
      
      unsubscribe = onAuthStateChanged(auth, (u) => {
        if (u) {
          setUser(u);
          fetchProducts();
          fetchOrders();
        } else {
          navigate('/admin');
        }
      });
    };
    
    setup();
    return () => unsubscribe && unsubscribe();
  }, [navigate]);

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

  const fetchOrders = async () => {
    const db = await getDB();
    if (!db) return;
    try {
      const snap = await getDocs(query(collection(db, 'orders')));
      const items:any[] = [];
      snap.forEach(d => items.push({id:d.id, ...d.data()}));
      setOrders(items);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    const auth = await getAuthService();
    if (auth) {
      signOut(auth).then(() => navigate('/admin'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const db = await getDB();
    if (!db) return;

    const productData = {
      ...formData,
      images: [formData.image],
      sizes: formData.sizes.split(',').map(s => s.trim()),
      updatedAt: Date.now()
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: Date.now()
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: 0, category: 'suits', image: '', stock: 0, sizes: '' });
    setEditingProduct(null);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.images[0] || '',
      stock: p.stock,
      sizes: p.sizes.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены?')) return;
    const db = await getDB();
    if (!db) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white hidden md:flex flex-col pt-24">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl">
             <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center text-xl font-bold">
               {user?.email?.charAt(0).toUpperCase()}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold truncate">{user?.displayName || 'Admin'}</p>
               <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
             </div>
          </div>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          <button onClick={() => setTab('products')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold ${tab==='products' ? 'bg-primary text-white':'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><LayoutDashboard size={20} /> Товары</button>
          <button onClick={() => setTab('orders')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${tab==='orders' ? 'bg-primary text-white':'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><Package size={20} /> Заказы</button>
          <button onClick={() => setTab('stats')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${tab==='stats' ? 'bg-primary text-white':'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}><DollarSign size={20} /> Статистика</button>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut size={20} /> Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-display font-bold text-secondary">Управление товарами</h1>
            <button 
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={20} /> Добавить товар
            </button>
          </div>

          {tab === 'orders' && <div className='bg-white rounded-2xl shadow-xl border p-6 mb-6'><h2 className='font-bold mb-4'>Управление заказами</h2><div className='space-y-3'>{orders.length===0 ? 'Заказов пока нет' : orders.map(o => <div key={o.id} className='border rounded-xl p-3 flex justify-between'><span>{o.customerName || o.email || 'Клиент'}</span><span>{o.status || 'new'}</span></div>)}</div></div>}
          {tab === 'stats' && <div className='bg-white rounded-2xl shadow-xl border p-6 mb-6'><h2 className='font-bold mb-4'>Статистика продаж</h2><p>Всего заказов: {orders.length}</p><p>Оборот: {orders.reduce((s,o)=> s + (o.total || 0), 0).toLocaleString()} ₽</p></div>}
          {tab === 'products' && <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Товар</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Категория</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Цена</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Наличие</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 text-sm">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-zinc-500 italic">
                      Нет товаров в базе данных. Добавьте первый товар!
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover" alt="" />
                          <span className="font-bold text-secondary">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">{p.category}</td>
                      <td className="px-6 py-4 font-bold">{p.price.toLocaleString()} ₽</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.stock} шт.
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 shrink-0">
                          <button onClick={() => handleEdit(p)} className="p-2 text-zinc-400 hover:text-primary transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-display font-bold mb-8 text-secondary">
              {editingProduct ? 'Редактировать товар' : 'Новый товар'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                    <Tag size={14} /> Название
                  </label>
                  <input 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Категория</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="suits">Костюмы</option>
                    <option value="shirts">Рубашки</option>
                    <option value="accessories">Аксессуары</option>
                    <option value="shoes">Обувь</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Описание</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                    <DollarSign size={14} /> Цена (₽)
                  </label>
                  <input 
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Наличие (шт)</label>
                  <input 
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                  <Image size={14} /> Ссылка на изображение
                </label>
                <input 
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Размеры (через запятую)</label>
                <input 
                  value={formData.sizes}
                  onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="48, 50, 52"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow py-4 bg-zinc-100 rounded-xl font-bold text-secondary hover:bg-zinc-200 transition-all"
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg shadow-primary/30 transition-all"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
