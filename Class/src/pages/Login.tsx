import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, ArrowLeft } from 'lucide-react';
import { getAuthService, getDB } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const auth = await getAuthService();
    const db = await getDB();
    
    if (!auth || !db) {
      setError('Система авторизации не готова. Пожалуйста, попробуйте позже.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          roles: ['customer'],
          createdAt: Date.now()
        });
      }
      
      navigate('/catalog');
    } catch (err: any) {
      setError('Ошибка при входе: ' + (err.message || 'Неизвестная ошибка'));
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
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 text-primary">
            <User size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Добро пожаловать</h1>
          <p className="text-zinc-500 text-sm">Войдите, чтобы сохранять понравившиеся товары и видеть историю заказов.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-secondary text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
          )}
          Войти через Google
        </button>

        <p className="mt-8 text-center text-xs text-zinc-400 leading-relaxed uppercase tracking-widest">
          Ваши данные под защитой <br /> Google Security
        </p>
      </div>
    </div>
  );
}
