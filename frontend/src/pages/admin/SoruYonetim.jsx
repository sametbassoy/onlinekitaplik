import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';

export default function SoruYonetim() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('0');
  const [cevapMap, setCevapMap] = useState({});
  const [error, setError] = useState('');

  const listQuery = useQuery({
    queryKey: ['admin', 'sorular', { filter }],
    queryFn: async () => {
      const res = await api.get('/api/admin/sorular', {
        params: { cevaplandi: filter === '' ? undefined : Number(filter) },
      });
      return res.data?.data || [];
    },
  });

  const answerMutation = useMutation({
    mutationFn: async ({ id, cevap }) => {
      const res = await api.put(`/api/sorular/${id}/cevapla`, { cevap });
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      await qc.invalidateQueries({ queryKey: ['admin', 'sorular'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Cevaplama başarısız');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/api/admin/sorular/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      await qc.invalidateQueries({ queryKey: ['admin', 'sorular'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Silme başarısız');
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Soru Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-400">Cevapla</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Filtre</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
          >
            <option value="0">Bekleyen</option>
            <option value="1">Cevaplı</option>
          </select>
        </div>
      </div>

      {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      {listQuery.isLoading ? (
        <div className="mt-6 text-slate-300">Yükleniyor...</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {listQuery.data?.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <div className="text-sm text-slate-300">{s.kullanici_adi}</div>
              <div className="mt-2 text-slate-100 whitespace-pre-wrap">{s.soru}</div>
              <div className="mt-3 text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</div>

              <div className="mt-4 border-t border-slate-800 pt-4">
                {s.cevaplandi ? (
                  <>
                    <textarea
                      value={cevapMap[s.id] !== undefined ? cevapMap[s.id] : s.cevap || ''}
                      onChange={(e) => setCevapMap((m) => ({ ...m, [s.id]: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Cevap..."
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => answerMutation.mutate({ id: s.id, cevap: cevapMap[s.id] !== undefined ? cevapMap[s.id] : s.cevap || '' })}
                        disabled={answerMutation.isPending || deleteMutation.isPending}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => {
                          const ok = window.confirm('Bu soru silinsin mi?');
                          if (!ok) return;
                          deleteMutation.mutate({ id: s.id });
                        }}
                        disabled={deleteMutation.isPending || answerMutation.isPending}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
                      >
                        Sil
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      value={cevapMap[s.id] || ''}
                      onChange={(e) => setCevapMap((m) => ({ ...m, [s.id]: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Cevap yaz..."
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => answerMutation.mutate({ id: s.id, cevap: cevapMap[s.id] || '' })}
                        disabled={answerMutation.isPending || deleteMutation.isPending}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
                      >
                        Cevapla
                      </button>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => {
                          const ok = window.confirm('Bu soru silinsin mi?');
                          if (!ok) return;
                          deleteMutation.mutate({ id: s.id });
                        }}
                        disabled={deleteMutation.isPending || answerMutation.isPending}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
                      >
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {!listQuery.data?.length && <div className="text-slate-400">Kayıt yok.</div>}
        </div>
      )}
    </div>
  );
}
