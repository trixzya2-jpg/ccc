import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { getAuthService, getDB } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', city: 'Улан-Удэ' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = await getAuthService();
    const db = await getDB();
    if (!auth || !db) return setError('Сервис временно недоступен');
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: `${form.firstName} ${form.lastName}`.trim() });
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          city: form.city,
          roles: ['customer'],
          firstOrderDiscountUsed: false,
          createdAt: Date.now()
        });
      }
      navigate('/catalog');
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-zinc-100">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} /> Вернуться на главную
        </Link>
        <h1 className="text-3xl font-display font-bold text-secondary mb-2">{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>
        <p className="text-zinc-500 text-sm mb-6">Личный кабинет «Классика Мода»</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <input required placeholder="Имя" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} className="w-full border rounded-xl p-3" />
              <input required placeholder="Фамилия" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} className="w-full border rounded-xl p-3" />
              <input placeholder="Телефон" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border rounded-xl p-3" />
            </>
          )}
          <input type="email" required placeholder="E-mail" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border rounded-xl p-3" />
          <input type="password" required minLength={6} placeholder="Пароль" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full border rounded-xl p-3" />
          <button disabled={loading} className="w-full bg-secondary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            {mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />} {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-4 text-primary text-sm">
          {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}
