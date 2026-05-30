import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { api } from '../../api/axios';

const Card = ({ title, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
    <div className="text-xs text-slate-500">{title}</div>
    <div className="mt-2 text-2xl font-semibold">{value}</div>
  </div>
);

export default function AdminPanel() {
  const query = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await api.get('/api/admin/dashboard');
      return res.data?.data;
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-400">Yönetim ve özet</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/kitaplar">Kitaplar</Link>
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/yazarlar">Yazarlar</Link>
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/kategoriler">Kategoriler</Link>
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/haberler">Haberler</Link>
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/galeri">Galeri</Link>
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/yorumlar">Yorumlar</Link>
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/sorular">Sorular</Link>
          <Link className="px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900" to="/admin/kullanicilar">Kullanıcılar</Link>
        </div>
      </div>

      {query.isLoading ? (
        <div className="mt-8 text-slate-300">Yükleniyor...</div>
      ) : query.isError ? (
        <div className="mt-8 rounded-2xl border border-red-900/60 bg-red-950/30 p-5 text-sm text-red-200">
          {query.error?.response?.data?.message || query.error?.message || 'Dashboard yüklenemedi'}
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Kullanıcı" value={query.data?.kullanicilar ?? 0} />
          <Card title="Kitap" value={query.data?.kitaplar ?? 0} />
          <Card title="Haber" value={query.data?.haberler ?? 0} />
          <Card title="Galeri" value={query.data?.galeri ?? 0} />
          <Card title="Online Kullanıcı" value={query.data?.onlineKullanicilar ?? 0} />
          <Card title="Bekleyen Yorum" value={query.data?.bekleyenYorumlar ?? 0} />
          <Card title="Bekleyen Soru" value={query.data?.bekleyenSorular ?? 0} />
          <Card title="Ziyaretçi" value={query.data?.ziyaretciToplam ?? 0} />
        </div>
      )}
    </div>
  );
}
