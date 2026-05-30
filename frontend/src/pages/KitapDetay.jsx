import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../api/axios';
import StarRating from '../components/StarRating.jsx';
import YorumKart from '../components/YorumKart.jsx';
import useAuth from '../hooks/useAuth';

export default function KitapDetay() {
  const { slug } = useParams();
  const { isAuthed } = useAuth();
  const qc = useQueryClient();

  const [yorum, setYorum] = useState('');
  const [puan, setPuan] = useState(5);
  const [yorumError, setYorumError] = useState('');
  const [yorumSuccess, setYorumSuccess] = useState('');

  const [okumaDurum, setOkumaDurum] = useState('okuyacagim');
  const [okumaError, setOkumaError] = useState('');
  const [okumaSuccess, setOkumaSuccess] = useState('');

  const kitapQuery = useQuery({
    queryKey: ['kitap', slug],
    queryFn: async () => {
      const res = await api.get(`/api/kitaplar/${slug}`);
      return res.data?.data;
    },
  });

  const okumaMutation = useMutation({
    mutationFn: async () => {
      setOkumaError('');
      setOkumaSuccess('');
      const res = await api.post('/api/okuma-listesi', {
        kitap_id: kitapQuery.data.id,
        durum: okumaDurum,
      });
      return res.data;
    },
    onSuccess: async () => {
      setOkumaSuccess('Okuma listesi güncellendi.');
      await qc.invalidateQueries({ queryKey: ['okuma-listesi'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'İşlem başarısız';
      setOkumaError(msg);
    },
  });

  const okumaDeleteMutation = useMutation({
    mutationFn: async ({ id }) => {
      setOkumaError('');
      setOkumaSuccess('');
      const res = await api.delete(`/api/okuma-listesi/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      setOkumaSuccess('Listeden kaldırıldı.');
      setOkumaDurum('okuyacagim');
      await qc.invalidateQueries({ queryKey: ['okuma-listesi'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Silme başarısız';
      setOkumaError(msg);
    },
  });

  const yorumlarQuery = useQuery({
    queryKey: ['yorumlar', slug, kitapQuery.data?.id],
    enabled: Boolean(kitapQuery.data?.id),
    queryFn: async () => {
      const res = await api.get(`/api/yorumlar/${kitapQuery.data.id}`);
      return res.data?.data || [];
    },
  });

  const okumaListesiQuery = useQuery({
    queryKey: ['okuma-listesi'],
    enabled: Boolean(isAuthed),
    queryFn: async () => {
      const res = await api.get('/api/okuma-listesi');
      return res.data?.data || [];
    },
  });

  const okumaItem = useMemo(() => {
    const kitapId = kitapQuery.data?.id;
    if (!kitapId) return null;
    return okumaListesiQuery.data?.find((x) => x.kitap_id === kitapId) || null;
  }, [kitapQuery.data?.id, okumaListesiQuery.data]);

  const yorumEkle = useMutation({
    mutationFn: async () => {
      setYorumError('');
      setYorumSuccess('');
      const res = await api.post('/api/yorumlar', {
        kitap_id: kitapQuery.data.id,
        yorum,
        puan,
      });
      return res.data;
    },
    onSuccess: async () => {
      setYorum('');
      setPuan(5);
      setYorumSuccess('Yorum gönderildi. Admin onayından sonra listede görünecek.');
      await qc.invalidateQueries({ queryKey: ['yorumlar'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Gönderme başarısız';
      setYorumError(msg);
    },
  });

  const kitap = kitapQuery.data;
  const kapakUrl = useMemo(() => {
    if (!kitap?.kapak) return null;
    return (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + kitap.kapak;
  }, [kitap]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {kitapQuery.isLoading ? (
        <div className="text-slate-300">Yükleniyor...</div>
      ) : !kitap ? (
        <div className="text-slate-300">Bulunamadı</div>
      ) : (
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/30">
              <div className="aspect-[3/4] bg-slate-900">
                {kapakUrl ? (
                  <img src={kapakUrl} alt={kitap.baslik} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Kapak yok</div>
                )}
              </div>
              <div className="p-4 border-b border-slate-800/50">
                <div className="text-xs text-slate-500">Görüntüleme: {kitap.goruntuleme}</div>
              </div>
              <div className="p-4">
                <h1 className="text-2xl font-semibold tracking-tight">{kitap.baslik}</h1>
                <div className="mt-2 text-sm text-slate-300">
                  {kitap.yazar_ad} • {kitap.kategori_ad}
                </div>
                <div className="mt-4 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {kitap.aciklama || 'Açıklama yok'}
                </div>
              </div>
            </div>

            <section>
              {isAuthed ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                  {okumaError && <div className="text-sm text-red-300">{okumaError}</div>}
                  {okumaSuccess && <div className="text-sm text-emerald-300">{okumaSuccess}</div>}

                  <div className="flex flex-col gap-3">
                    <select
                      value={okumaItem?.durum || okumaDurum}
                      onChange={(e) => setOkumaDurum(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <option value="okuyacagim">Okuyacağım</option>
                      <option value="okuyorum">Okuyorum</option>
                      <option value="okudum">Okudum</option>
                    </select>

                    <button
                      onClick={() => okumaMutation.mutate()}
                      disabled={okumaMutation.isPending || okumaDeleteMutation.isPending || !kitapQuery.data?.id}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {okumaItem ? 'Güncelle' : 'Listeye Ekle'}
                    </button>

                    {okumaItem && (
                      <button
                        onClick={() => {
                          const ok = window.confirm('Okuma listesinden kaldırılsın mı?');
                          if (!ok) return;
                          okumaDeleteMutation.mutate({ id: okumaItem.id });
                        }}
                        disabled={okumaMutation.isPending || okumaDeleteMutation.isPending}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
                      >
                        Kaldır
                      </button>
                    )}
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    {okumaItem ? `Mevcut durum: ${okumaItem.durum}` : 'Henüz okuma listende değil.'}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-400">Okuma listesine eklemek için giriş yap.</div>
              )}
            </section>
          </div>

          <div>
            <section>
              <h2 className="text-xl font-semibold">Yorumlar</h2>

              {isAuthed ? (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
                  <div className="text-sm text-slate-300">Yorum yaz</div>
                  {yorumError && <div className="mt-3 text-sm text-red-300">{yorumError}</div>}
                  {yorumSuccess && <div className="mt-3 text-sm text-emerald-300">{yorumSuccess}</div>}
                  <div className="mt-2">
                    <StarRating value={puan} onChange={setPuan} />
                  </div>
                  <textarea
                    value={yorum}
                    onChange={(e) => setYorum(e.target.value)}
                    rows={4}
                    className="mt-3 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Yorumun..."
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => yorumEkle.mutate()}
                      disabled={yorumEkle.isPending || yorum.trim().length < 3}
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                    >
                      Gönder
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-slate-400">Yorum yazmak için giriş yap.</div>
              )}

              <div className="mt-6 grid gap-4">
                {yorumlarQuery.isLoading ? (
                  <div className="text-slate-300">Yükleniyor...</div>
                ) : (
                  yorumlarQuery.data?.map((y) => <YorumKart key={y.id} yorum={y} kitapId={kitapQuery.data?.id} />)
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
