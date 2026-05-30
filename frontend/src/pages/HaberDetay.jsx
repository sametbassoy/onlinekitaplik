import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { api } from '../api/axios';

export default function HaberDetay() {
  const { slug } = useParams();

  const query = useQuery({
    queryKey: ['haber', slug],
    queryFn: async () => {
      const res = await api.get(`/api/haberler/${slug}`);
      return res.data?.data;
    },
  });

  const haber = query.data;

  const resimUrl = useMemo(() => {
    if (!haber?.resim) return null;
    return (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + haber.resim;
  }, [haber]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {query.isLoading ? (
        <div className="text-slate-300">Yükleniyor...</div>
      ) : !haber ? (
        <div className="text-slate-300">Bulunamadı</div>
      ) : (
        <>
          <div className="text-xs text-slate-500">{new Date(haber.created_at).toLocaleString()}</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{haber.baslik}</h1>
          <div className="mt-2 text-sm text-slate-400">Kategori: {haber.kategori}</div>

          {resimUrl && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-slate-800">
              <img src={resimUrl} alt={haber.baslik} className="w-full h-auto" />
            </div>
          )}

          <div className="mt-6 whitespace-pre-wrap leading-relaxed text-slate-200">
            {haber.icerik}
          </div>
        </>
      )}
    </div>
  );
}
