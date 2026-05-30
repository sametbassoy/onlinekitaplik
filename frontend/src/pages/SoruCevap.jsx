import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function SoruCevap() {
  const { isAuthed } = useAuth();
  const qc = useQueryClient();

  const [soru, setSoru] = useState('');
  const [error, setError] = useState('');

  const listQuery = useQuery({
    queryKey: ['sorular'],
    queryFn: async () => {
      const res = await api.get('/api/sorular');
      return res.data?.data || [];
    },
  });

  const askMutation = useMutation({
    mutationFn: async () => {
      setError('');
      const res = await api.post('/api/sorular', { soru });
      return res.data;
    },
    onSuccess: async () => {
      setSoru('');
      setError('');
      await qc.invalidateQueries({ queryKey: ['sorular'] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Gönderme başarısız';
      setError(msg);
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Soru - Cevap</h1>

      {isAuthed ? (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="text-sm text-slate-300">Soru sor</div>
          {error && <div className="mt-3 text-sm text-red-300">{error}</div>}
          <textarea
            value={soru}
            onChange={(e) => setSoru(e.target.value)}
            rows={3}
            className="mt-3 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Sorun..."
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => askMutation.mutate()}
              disabled={askMutation.isPending || soru.trim().length < 5}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            >
              Gönder
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-sm text-slate-400">Soru sormak için giriş yap.</div>
      )}

      <div className="mt-8 grid gap-4">
        {listQuery.isLoading ? (
          <div className="text-slate-300">Yükleniyor...</div>
        ) : (
          listQuery.data?.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <div className="text-sm text-slate-200">{item.kullanici_adi}</div>
              <div className="mt-2 text-slate-100 whitespace-pre-wrap">{item.soru}</div>
              <div className="mt-3 text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</div>

              <div className="mt-4 border-t border-slate-800 pt-4">
                {item.cevaplandi ? (
                  <div className="text-slate-300 whitespace-pre-wrap">{item.cevap}</div>
                ) : (
                  <div className="text-sm text-slate-500">Henüz cevaplanmadı</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
