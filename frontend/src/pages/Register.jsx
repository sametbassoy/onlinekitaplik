import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [kullanici_adi, setKullaniciAdi] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ kullanici_adi, email, sifre });
      nav('/');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Kayıt başarısız';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Kayıt</h1>
      <p className="mt-2 text-sm text-slate-400">
        Zaten hesabın var mı?{' '}
        <Link className="text-indigo-300 hover:text-indigo-200" to="/login">
          Giriş yap
        </Link>
      </p>

      <form onSubmit={submit} className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
        {error && <div className="mb-3 text-sm text-red-300">{error}</div>}

        <label className="block text-sm text-slate-300">Kullanıcı Adı</label>
        <input
          value={kullanici_adi}
          onChange={(e) => setKullaniciAdi(e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <label className="block mt-4 text-sm text-slate-300">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <label className="block mt-4 text-sm text-slate-300">Şifre</label>
        <input
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
          type="password"
          className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />

        <button
          disabled={loading}
          className="mt-5 w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}
