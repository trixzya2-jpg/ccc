import React, { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem('cookie-consent') !== 'accepted');
  }, []);

  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-secondary text-white p-4 rounded-2xl z-[70] shadow-2xl">
      <p className="text-sm">Мы используем cookie для корзины, авторизации и персональных предложений.</p>
      <button onClick={() => { localStorage.setItem('cookie-consent', 'accepted'); setOpen(false); }} className="mt-3 bg-primary text-secondary font-bold px-4 py-2 rounded-lg">Принять</button>
    </div>
  );
}
