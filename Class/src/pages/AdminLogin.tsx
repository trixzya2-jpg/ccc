import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert } from 'lucide-react';
import { getAuthService } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const auth = await getAuthService();
    if (!auth) {
      setError('Система авторизации не готова. Пожалуйста, попробуйте позже.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // In a real app, we would check if the user's email is in an admin list
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Ошибка при входе: ' + (err.message || 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-zinc-100">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6 text-primary">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-display font-bold text-secondary mb-2">Панель управления</h1>
          <p className="text-zinc-500 text-sm">Доступ только для уполномоченных сотрудников "Классика Мода"</p>
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
            <LogIn size={20} />
          )}
          Войти через Google
        </button>

        <p className="mt-8 text-center text-xs text-zinc-400 leading-relaxed uppercase tracking-widest">
          Безопасное соединение <br /> SSL Protected
        </p>
      </div>
    </div>
  );
}
