import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { api } from '../api/axios';

export default function YazarProfil() {
  const { slug } = useParams();

  const query = useQuery({
    queryKey: ['yazar', slug],
    queryFn: async () => {
      const res = await api.get(`/api/yazarlar/${slug}`);
      return res.data?.data;
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {query.isLoading ? (
        <div className="text-slate-300">Yükleniyor...</div>
      ) : !query.data ? (
        <div className="text-slate-300">Bulunamadı</div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
          <div className="flex items-start gap-5">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
              {query.data.foto ? (
                <img
                  src={(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + query.data.foto}
                  alt={query.data.ad}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">Foto yok</div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{query.data.ad}</h1>
              <div className="mt-3 text-slate-300 whitespace-pre-wrap leading-relaxed">
                {query.data.biyografi || 'Biyografi yok'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
