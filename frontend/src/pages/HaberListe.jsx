import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { api } from '../api/axios';
import Pagination from '../components/Pagination.jsx';

export default function HaberListe() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') || '1');
  const kategori = params.get('kategori') || '';

  const queryKey = useMemo(() => ['haberler', { page, kategori }], [page, kategori]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get('/api/haberler', {
        params: {
          page,
          limit: 10,
          kategori: kategori || undefined,
        },
      });
      return res.data;
    },
  });

  const totalPages = query.data?.pagination?.totalPages || 1;

  const setKategori = (k) => {
    const next = new URLSearchParams(params);
    if (k) next.set('kategori', k);
    else next.delete('kategori');
    next.set('page', '1');
    setParams(next);
  };

  const onPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Haberler</h1>
          <p className="mt-1 text-sm text-slate-400">Haber / Duyuru</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setKategori('')}
            className={`px-3 py-2 rounded-lg border border-slate-800 ${!kategori ? 'bg-slate-900' : 'hover:bg-slate-900'}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setKategori('haber')}
            className={`px-3 py-2 rounded-lg border border-slate-800 ${kategori === 'haber' ? 'bg-slate-900' : 'hover:bg-slate-900'}`}
          >
            Haber
          </button>
          <button
            onClick={() => setKategori('duyuru')}
            className={`px-3 py-2 rounded-lg border border-slate-800 ${kategori === 'duyuru' ? 'bg-slate-900' : 'hover:bg-slate-900'}`}
          >
            Duyuru
          </button>
        </div>
      </div>

      {query.isLoading ? (
        <div className="mt-8 text-slate-300">Yükleniyor...</div>
      ) : (
        <div className="mt-8 grid gap-4">
          {query.data?.data?.map((h) => (
            <Link
              key={h.id}
              to={`/haber/${h.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition p-5"
            >
              <div className="text-xs text-slate-500">{new Date(h.created_at).toLocaleString()}</div>
              <div className="mt-2 font-medium text-lg">{h.baslik}</div>
              <div className="mt-1 text-sm text-slate-400">Kategori: {h.kategori}</div>
            </Link>
          ))}

          {!query.data?.data?.length && <div className="text-slate-400">Kayıt yok.</div>}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPage={onPage} />
    </div>
  );
}
