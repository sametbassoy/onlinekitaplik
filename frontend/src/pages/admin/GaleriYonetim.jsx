import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';

export default function GaleriYonetim() {
  const qc = useQueryClient();

  const [baslik, setBaslik] = useState('');
  const [resim, setResim] = useState(null);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const listQuery = useQuery({
    queryKey: ['admin', 'galeri'],
    queryFn: async () => {
      const res = await api.get('/api/galeri');
      return res.data?.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id }) => {
      const fd = new FormData();
      fd.append('baslik', baslik);
      if (resim) fd.append('resim', resim);

      const res = await api.put(`/api/galeri/${id}`, fd);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setBaslik('');
      setResim(null);
      setEditingId(null);
      await qc.invalidateQueries({ queryKey: ['admin', 'galeri'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Güncelleme başarısız');
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('baslik', baslik);
      if (resim) fd.append('resim', resim);

      const res = await api.post('/api/galeri', fd);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setBaslik('');
      setResim(null);
      await qc.invalidateQueries({ queryKey: ['admin', 'galeri'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Kaydetme başarısız');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/galeri/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'galeri'] });
    },
  });

  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Galeri Yönetimi</h1>
      <p className="mt-1 text-sm text-slate-400">Resim yükle / sil</p>

      {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
        <div className="text-sm text-slate-300">{editingId ? 'Görsel Düzenle' : 'Yeni Görsel'}</div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Başlık</label>
            <input
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Resim</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setResim(e.target.files?.[0] || null)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              if (editingId) updateMutation.mutate({ id: editingId });
              else createMutation.mutate();
            }}
            disabled={createMutation.isPending || updateMutation.isPending || !baslik || (!editingId && !resim)}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            Kaydet
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setBaslik('');
                setResim(null);
                setError('');
              }}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="ml-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
            >
              İptal
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-sm text-slate-300">Mevcut Galeri</div>

        {listQuery.isLoading ? (
          <div className="mt-4 text-slate-300">Yükleniyor...</div>
        ) : (
          <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listQuery.data?.map((g) => (
              <div key={g.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
                <div className="aspect-[4/3] bg-slate-900">
                  <img src={base + g.resim_yolu} alt={g.baslik} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="font-medium text-sm">{g.baslik}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(g.id);
                        setBaslik(g.baslik || '');
                        setResim(null);
                        setError('');
                      }}
                      disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs disabled:opacity-50"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(g.id)}
                      disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                      className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs disabled:opacity-50"
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
