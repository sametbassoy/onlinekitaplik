import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';

export default function YorumYonetim() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('0');

  const listQuery = useQuery({
    queryKey: ['admin', 'yorumlar', { filter }],
    queryFn: async () => {
      const res = await api.get('/api/admin/yorumlar', {
        params: { onaylandi: filter === '' ? undefined : Number(filter) },
      });
      return res.data?.data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/api/yorumlar/${id}/onayla`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'yorumlar'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/yorumlar/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'yorumlar'] });
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Yorum Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-400">Onayla / Sil</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Filtre</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
          >
            <option value="0">Bekleyen</option>
            <option value="1">Onaylı</option>
          </select>
        </div>
      </div>

      {listQuery.isLoading ? (
        <div className="mt-6 text-slate-300">Yükleniyor...</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {listQuery.data?.map((y) => (
            <div key={y.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <div className="text-sm text-slate-300">
                {y.kullanici_adi} • {y.kitap_baslik}
              </div>
              <div className="mt-2 text-slate-200 whitespace-pre-wrap">{y.yorum}</div>
              <div className="mt-3 text-xs text-slate-500">Puan: {y.puan} • {new Date(y.created_at).toLocaleString()}</div>

              <div className="mt-4 flex gap-2">
                {!y.onaylandi && (
                  <button
                    onClick={() => approveMutation.mutate(y.id)}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                  >
                    Onayla
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(y.id)}
                  className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
          {!listQuery.data?.length && <div className="text-slate-400">Kayıt yok.</div>}
        </div>
      )}
    </div>
  );
}
