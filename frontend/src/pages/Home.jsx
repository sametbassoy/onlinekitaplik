import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { api } from '../api/axios';
import KitapKart from '../components/KitapKart.jsx';

export default function Home() {
  const populerQuery = useQuery({
    queryKey: ['kitaplar', 'populer'],
    queryFn: async () => {
      const res = await api.get('/api/kitaplar/populer?limit=8');
      return res.data?.data || [];
    },
  });

  const visitsQuery = useQuery({
    queryKey: ['ziyaretci'],
    queryFn: async () => {
      const res = await api.get('/api/ziyaretci');
      return res.data?.toplam;
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Online Kitaplık & Yorum Platformu
          </h1>
          <p className="mt-3 text-slate-300 leading-relaxed">
            Kitapları keşfet, yorum yaz, puan ver ve okuma listeni yönet.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/kitaplar"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
            >
              Kitaplara Git
            </Link>
            <Link
              to="/haberler"
              className="px-4 py-2 rounded-lg border border-slate-800 hover:bg-slate-900"
            >
              Haberleri Gör
            </Link>
          </div>

          <div className="mt-6 text-sm text-slate-400">
            Ziyaretçi: {visitsQuery.isLoading ? '...' : visitsQuery.data}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/50 to-slate-950 p-6">
          <div className="text-sm text-slate-400">Popüler Kitaplar</div>
          {populerQuery.isLoading ? (
            <div className="mt-4 text-slate-300">Yükleniyor...</div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {populerQuery.data?.map((k) => (
                <KitapKart key={k.id} kitap={k} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
