import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { api } from '../api/axios';

export default function Galeri() {
  const query = useQuery({
    queryKey: ['galeri'],
    queryFn: async () => {
      const res = await api.get('/api/galeri');
      return res.data?.data || [];
    },
  });

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Galeri</h1>

      {query.isLoading ? (
        <div className="mt-6 text-slate-300">Yükleniyor...</div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {query.data?.map((g) => (
            <div key={g.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-900">
                <img src={base + g.resim_yolu} alt={g.baslik} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="font-medium">{g.baslik}</div>
                <div className="mt-1 text-xs text-slate-500">{new Date(g.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
          {!query.data?.length && <div className="text-slate-400">Kayıt yok.</div>}
        </div>
      )}
    </div>
  );
}
