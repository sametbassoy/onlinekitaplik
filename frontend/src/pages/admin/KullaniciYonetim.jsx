import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../../api/axios';

export default function KullaniciYonetim() {
  const qc = useQueryClient();
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [draftUsername, setDraftUsername] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftRol, setDraftRol] = useState('kullanici');

  const listQuery = useQuery({
    queryKey: ['admin', 'kullanicilar'],
    queryFn: async () => {
      const res = await api.get('/api/admin/kullanicilar');
      return res.data?.data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.put(`/api/admin/kullanicilar/${id}`, {
        kullanici_adi: draftUsername,
        email: draftEmail,
        rol: draftRol,
      });
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      setEditingId(null);
      setDraftUsername('');
      setDraftEmail('');
      setDraftRol('kullanici');
      await qc.invalidateQueries({ queryKey: ['admin', 'kullanicilar'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Güncelleme başarısız');
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, rol }) => {
      const res = await api.put(`/api/admin/kullanicilar/${id}/rol`, { rol });
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      await qc.invalidateQueries({ queryKey: ['admin', 'kullanicilar'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Güncelleme başarısız');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await api.delete(`/api/admin/kullanicilar/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      setError('');
      await qc.invalidateQueries({ queryKey: ['admin', 'kullanicilar'] });
    },
    onError: (err) => {
      setError(err?.response?.data?.message || 'Silme başarısız');
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Kullanıcı Yönetimi</h1>
      <p className="mt-1 text-sm text-slate-400">Rol yönetimi</p>

      {error && <div className="mt-4 text-sm text-red-300">{error}</div>}

      {listQuery.isLoading ? (
        <div className="mt-6 text-slate-300">Yükleniyor...</div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/60">
              <tr className="text-left text-slate-300">
                <th className="p-3">ID</th>
                <th className="p-3">Kullanıcı</th>
                <th className="p-3">Email</th>
                <th className="p-3">Rol</th>
                <th className="p-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {listQuery.data?.map((u) => (
                <tr key={u.id} className="border-t border-slate-800">
                  <td className="p-3 text-slate-400">{u.id}</td>
                  <td className="p-3">
                    {editingId === u.id ? (
                      <input
                        value={draftUsername}
                        onChange={(e) => setDraftUsername(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
                      />
                    ) : (
                      u.kullanici_adi
                    )}
                  </td>
                  <td className="p-3 text-slate-300">
                    {editingId === u.id ? (
                      <input
                        value={draftEmail}
                        onChange={(e) => setDraftEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td className="p-3">
                    {editingId === u.id ? (
                      <select
                        value={draftRol}
                        onChange={(e) => setDraftRol(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800"
                      >
                        <option value="kullanici">kullanici</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">{u.rol}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {editingId === u.id ? (
                        <>
                          <button
                            onClick={() => updateMutation.mutate({ id: u.id })}
                            disabled={updateMutation.isPending || deleteMutation.isPending || roleMutation.isPending}
                            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setDraftUsername('');
                              setDraftEmail('');
                              setDraftRol('kullanici');
                              setError('');
                            }}
                            disabled={updateMutation.isPending || deleteMutation.isPending || roleMutation.isPending}
                            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                          >
                            İptal
                          </button>
                        </>
                      ) : u.rol === 'admin' ? (
                        <button
                          onClick={() => roleMutation.mutate({ id: u.id, rol: 'kullanici' })}
                          disabled={roleMutation.isPending || deleteMutation.isPending}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                        >
                          Kullanıcı Yap
                        </button>
                      ) : (
                        <button
                          onClick={() => roleMutation.mutate({ id: u.id, rol: 'admin' })}
                          disabled={roleMutation.isPending || deleteMutation.isPending}
                          className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
                        >
                          Admin Yap
                        </button>
                      )}

                      {editingId !== u.id && (
                        <button
                          onClick={() => {
                            setEditingId(u.id);
                            setDraftUsername(u.kullanici_adi || '');
                            setDraftEmail(u.email || '');
                            setDraftRol(u.rol || 'kullanici');
                            setError('');
                          }}
                          disabled={roleMutation.isPending || deleteMutation.isPending || updateMutation.isPending}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
                        >
                          Düzenle
                        </button>
                      )}

                      {editingId !== u.id && (
                        <button
                          onClick={() => {
                            const ok = window.confirm('Bu kullanıcı silinsin mi?');
                            if (!ok) return;
                            deleteMutation.mutate({ id: u.id });
                          }}
                          disabled={roleMutation.isPending || deleteMutation.isPending || updateMutation.isPending}
                          className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!listQuery.data?.length && (
                <tr>
                  <td className="p-4 text-slate-400" colSpan={5}>
                    Kayıt yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
