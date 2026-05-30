import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';

export default function HaberYonetim() {
  const qc = useQueryClient();

  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [kategori, setKategori] = useState('haber');
  const [resim, setResim] = useState(null);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const listQuery = useQuery({
    queryKey: ['admin', 'haberler'],
    queryFn: async () => {
      const res = await api.get('/api/haberler', { params: { page: 1, limit: 50 } });
      return res.data?.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id }) => {
      const fd = new FormData();
      fd.append('baslik', baslik);
      fd.append('icerik', icerik);
      fd.append('kategori', kategori);
      if (resim) fd.append('resim', resim);

      const res = await api.put(`/api/haberler/${id}`, fd);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setBaslik('');
      setIcerik('');
      setKategori('haber');
      setResim(null);
      setEditingId(null);
      await qc.invalidateQueries({ queryKey: ['admin', 'haberler'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Güncelleme başarısız');
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('baslik', baslik);
      fd.append('icerik', icerik);
      fd.append('kategori', kategori);
      if (resim) fd.append('resim', resim);

      const res = await api.post('/api/haberler', fd);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setBaslik('');
      setIcerik('');
      setKategori('haber');
      setResim(null);
      await qc.invalidateQueries({ queryKey: ['admin', 'haberler'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Kaydetme başarısız');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/haberler/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'haberler'] });
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Haber Yönetimi</h1>
      <p className="mt-1 text-sm text-slate-400">Haber/duyuru ekle / sil</p>

      {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
        <div className="text-sm text-slate-300">{editingId ? 'Haber Düzenle' : 'Yeni Haber'}</div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">Başlık</label>
            <input
              value={baslik}
              onChange={(e) => setBaslik(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <option value="haber">Haber</option>
              <option value="duyuru">Duyuru</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Resim (opsiyonel)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setResim(e.target.files?.[0] || null)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">İçerik</label>
            <textarea
              value={icerik}
              onChange={(e) => setIcerik(e.target.value)}
              rows={6}
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
            disabled={createMutation.isPending || updateMutation.isPending || !baslik || icerik.length < 10}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            Kaydet
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setBaslik('');
                setIcerik('');
                setKategori('haber');
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
        <div className="text-sm text-slate-300">Mevcut Haberler</div>

        {listQuery.isLoading ? (
          <div className="mt-4 text-slate-300">Yükleniyor...</div>
        ) : (
          <div className="mt-4 grid gap-3">
            {listQuery.data?.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/20 px-4 py-3">
                <div>
                  <div className="font-medium">{h.baslik}</div>
                  <div className="text-xs text-slate-500">{h.kategori} • {new Date(h.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      (async () => {
                        try {
                          setEditingId(h.id);
                          setBaslik(h.baslik || '');
                          setKategori(h.kategori || 'haber');
                          setResim(null);
                          setError('');

                          const res = await api.get(`/api/haberler/${h.slug}`);
                          const detay = res.data?.data;
                          setIcerik(detay?.icerik || '');
                        } catch (err) {
                          setError(err?.response?.data?.message || 'Detay alınamadı');
                        }
                      })();
                    }}
                    disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(h.id)}
                    disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                    className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 disabled:opacity-50"
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
    </div>
  );
}
