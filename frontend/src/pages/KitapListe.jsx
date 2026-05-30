import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { api } from '../api/axios';
import KitapKart from '../components/KitapKart.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';

export default function KitapListe() {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get('page') || '1');
  const q = params.get('q') || '';

  const [localQ, setLocalQ] = useState(q);

  const queryKey = useMemo(() => ['kitaplar', { page, q }], [page, q]);

  const kitaplarQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get('/api/kitaplar', { params: { page, limit: 12, q } });
      return res.data;
    },
  });

  const onSearch = (text) => {
    setLocalQ(text);
    const next = new URLSearchParams(params);
    if (text) next.set('q', text);
    else next.delete('q');
    next.set('page', '1');
    setParams(next);
  };

  const onPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
  };

  const data = kitaplarQuery.data?.data || [];
  const totalPages = kitaplarQuery.data?.pagination?.totalPages || 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Kitaplar</h1>
          <p className="mt-1 text-slate-400 text-sm">Arama ve keşif</p>
        </div>
        <div className="w-full md:w-[420px]">
          <SearchBar initialValue={localQ} onSearch={onSearch} />
        </div>
      </div>

      {kitaplarQuery.isLoading ? (
        <div className="mt-8 text-slate-300">Yükleniyor...</div>
      ) : (
        <>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.map((k) => (
              <KitapKart key={k.id} kitap={k} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPage={onPage} />
        </>
      )}
    </div>
  );
}
