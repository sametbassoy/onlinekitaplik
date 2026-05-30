import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../api/axios';

export default function OkumaListesi() {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['okuma-listesi'],
    queryFn: async () => {
      const res = await api.get('/api/okuma-listesi');
      return res.data?.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, durum }) => {
      const res = await api.put(`/api/okuma-listesi/${id}`, { durum });
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['okuma-listesi'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/okuma-listesi/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['okuma-listesi'] });
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Okuma Listem</h1>

      {listQuery.isLoading ? (
        <div className="mt-6 text-slate-300">Yükleniyor...</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {listQuery.data?.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{item.baslik}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    {item.yazar_ad} • {item.kategori_ad}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Durum: {item.durum}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateMutation.mutate({ id: item.id, durum: 'okuyorum' })}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs"
                  >
                    Okuyorum
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({ id: item.id, durum: 'okuyacagim' })}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs"
                  >
                    Okuyacağım
                  </button>
                  <button
                    onClick={() => updateMutation.mutate({ id: item.id, durum: 'okudum' })}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs"
                  >
                    Okudum
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!listQuery.data?.length && (
            <div className="text-slate-400">Listen boş.</div>
          )}
        </div>
      )}
    </div>
  );
}
