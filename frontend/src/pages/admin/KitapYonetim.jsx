import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';

export default function KitapYonetim() {
  const qc = useQueryClient();
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);

  const [baslik, setBaslik] = useState('');
  const [yazar_id, setYazarId] = useState('');
  const [kategori_id, setKategoriId] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kapak, setKapak] = useState(null);

  const yazarlarQuery = useQuery({
    queryKey: ['yazarlar'],
    queryFn: async () => {
      const res = await api.get('/api/yazarlar');
      return res.data?.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id }) => {
      const fd = new FormData();
      fd.append('baslik', baslik);
      fd.append('yazar_id', yazar_id);
      fd.append('kategori_id', kategori_id);
      fd.append('aciklama', aciklama);
      if (kapak) fd.append('kapak', kapak);

      const res = await api.put(`/api/kitaplar/${id}`, fd);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setBaslik('');
      setYazarId('');
      setKategoriId('');
      setAciklama('');
      setKapak(null);
      setEditingId(null);
      await qc.invalidateQueries({ queryKey: ['admin', 'kitaplar'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Güncelleme başarısız');
    },
  });

  const kategorilerQuery = useQuery({
    queryKey: ['kategoriler'],
    queryFn: async () => {
      const res = await api.get('/api/kategoriler');
      return res.data?.data || [];
    },
  });

  const kitaplarQuery = useQuery({
    queryKey: ['admin', 'kitaplar'],
    queryFn: async () => {
      const res = await api.get('/api/kitaplar', { params: { page: 1, limit: 50 } });
      return res.data?.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append('baslik', baslik);
      fd.append('yazar_id', yazar_id);
      fd.append('kategori_id', kategori_id);
      fd.append('aciklama', aciklama);
      if (kapak) fd.append('kapak', kapak);

      const res = await api.post('/api/kitaplar', fd);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setBaslik('');
      setYazarId('');
      setKategoriId('');
      setAciklama('');
      setKapak(null);
      await qc.invalidateQueries({ queryKey: ['admin', 'kitaplar'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Kaydetme başarısız');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/kitaplar/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['admin', 'kitaplar'] });
    },
  });

  const yazarlar = useMemo(() => yazarlarQuery.data || [], [yazarlarQuery.data]);
  const kategoriler = useMemo(() => kategorilerQuery.data || [], [kategorilerQuery.data]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Kitap Yönetimi</h1>
      <p className="mt-1 text-sm text-slate-400">Kitap ekle / sil</p>

      {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
        <div className="text-sm text-slate-300">{editingId ? 'Kitap Düzenle' : 'Yeni Kitap'}</div>

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
            <label className="text-sm text-slate-300">Kapak (opsiyonel)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setKapak(e.target.files?.[0] || null)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Yazar</label>
            <select
              value={yazar_id}
              onChange={(e) => setYazarId(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <option value="">Seç</option>
              {yazarlar.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.ad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Kategori</label>
            <select
              value={kategori_id}
              onChange={(e) => setKategoriId(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
            >
              <option value="">Seç</option>
              {kategoriler.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.ad}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">Açıklama</label>
            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows={4}
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
            disabled={createMutation.isPending || updateMutation.isPending || !baslik || !yazar_id || !kategori_id}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            Kaydet
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setBaslik('');
                setYazarId('');
                setKategoriId('');
                setAciklama('');
                setKapak(null);
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
        <div className="text-sm text-slate-300">Mevcut Kitaplar</div>

        {kitaplarQuery.isLoading ? (
          <div className="mt-4 text-slate-300">Yükleniyor...</div>
        ) : (
          <div className="mt-4 grid gap-3">
            {kitaplarQuery.data?.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/20 px-4 py-3">
                <div>
                  <div className="font-medium">{b.baslik}</div>
                  <div className="text-xs text-slate-500">{b.yazar_ad} • {b.kategori_ad}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      (async () => {
                        try {
                          setEditingId(b.id);
                          setBaslik(b.baslik || '');
                          setYazarId(String(b.yazar_id || ''));
                          setKategoriId(String(b.kategori_id || ''));
                          setKapak(null);
                          setError('');

                          const res = await api.get(`/api/kitaplar/${b.slug}`);
                          const detay = res.data?.data;
                          setAciklama(detay?.aciklama || '');
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
                    onClick={() => deleteMutation.mutate(b.id)}
                    disabled={createMutation.isPending || updateMutation.isPending || deleteMutation.isPending}
                    className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 disabled:opacity-50"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
            {!kitaplarQuery.data?.length && <div className="text-slate-400">Kayıt yok.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
