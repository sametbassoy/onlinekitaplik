import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';

export default function KategoriYonetim() {
  const qc = useQueryClient();
  const [ad, setAd] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const listQuery = useQuery({
    queryKey: ['kategoriler'],
    queryFn: async () => {
      const res = await api.get('/api/kategoriler');
      return res.data?.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.put(`/api/admin/kategoriler/${id}`, { ad });
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setAd('');
      setEditingId(null);
      await qc.invalidateQueries({ queryKey: ['kategoriler'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Güncelleme başarısız';
      setError(msg);
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/admin/kategoriler', { ad });
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setAd('');
      await qc.invalidateQueries({ queryKey: ['kategoriler'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Kaydetme başarısız';
      setError(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/api/admin/kategoriler/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      await qc.invalidateQueries({ queryKey: ['kategoriler'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Silme başarısız';
      setError(msg);
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Kategori Yönetimi</h1>
      <p className="mt-1 text-sm text-slate-400">Kategori ekle</p>

      {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
        <div className="text-sm text-slate-300">{editingId ? 'Kategori Düzenle' : 'Yeni Kategori'}</div>
        <div className="mt-3 flex flex-col md:flex-row gap-3">
          <input
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder="Kategori adı"
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
          />
          <button
            onClick={() => {
              if (editingId) updateMutation.mutate({ id: editingId });
              else createMutation.mutate();
            }}
            disabled={createMutation.isPending || updateMutation.isPending || ad.trim().length < 2}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            Kaydet
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setAd('');
                setError('');
              }}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
            >
              İptal
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-sm text-slate-300">Mevcut Kategoriler</div>
        {listQuery.isLoading ? (
          <div className="mt-4 text-slate-300">Yükleniyor...</div>
        ) : (
          <div className="mt-4 grid gap-2">
            {listQuery.data?.map((k) => (
              <div key={k.id} className="rounded-xl border border-slate-800 bg-slate-900/20 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{k.ad}</div>
                    <div className="text-xs text-slate-500">{k.slug}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(k.id);
                        setAd(k.ad);
                        setError('');
                      }}
                      disabled={deleteMutation.isPending || updateMutation.isPending || createMutation.isPending}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => {
                        const ok = window.confirm('Bu kategori silinsin mi?');
                        if (!ok) return;
                        deleteMutation.mutate({ id: k.id });
                      }}
                      disabled={deleteMutation.isPending || updateMutation.isPending || createMutation.isPending}
                      className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!listQuery.data?.length && <div className="text-slate-400">Kayıt yok.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
