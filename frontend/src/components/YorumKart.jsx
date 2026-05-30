import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import StarRating from './StarRating.jsx';
import { api } from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function YorumKart({ yorum, kitapId }) {
  const { user, isAuthed } = useAuth();
  const qc = useQueryClient();

  const isOwner = useMemo(() => {
    if (!isAuthed || !user?.id) return false;
    return Number(yorum.kullanici_id) === Number(user.id);
  }, [isAuthed, user?.id, yorum.kullanici_id]);

  const [editMode, setEditMode] = useState(false);
  const [draftYorum, setDraftYorum] = useState(yorum.yorum || '');
  const [draftPuan, setDraftPuan] = useState(Number(yorum.puan) || 5);
  const [error, setError] = useState('');

  const updateMutation = useMutation({
    mutationFn: async () => {
      setError('');
      const res = await api.put(`/api/yorumlar/${yorum.id}`, {
        yorum: draftYorum,
        puan: draftPuan,
      });
      return res.data;
    },
    onSuccess: async () => {
      setEditMode(false);
      await qc.invalidateQueries({ queryKey: ['yorumlar'] });
      if (kitapId) {
        await qc.invalidateQueries({ queryKey: ['yorumlar', undefined, kitapId] });
      }
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Güncelleme başarısız';
      setError(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      setError('');
      const res = await api.delete(`/api/yorumlar/${yorum.id}`);
      return res.data;
    },
    onSuccess: async () => {
      setEditMode(false);
      await qc.invalidateQueries({ queryKey: ['yorumlar'] });
      if (kitapId) {
        await qc.invalidateQueries({ queryKey: ['yorumlar', undefined, kitapId] });
      }
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Silme başarısız';
      setError(msg);
    },
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-200">{yorum.kullanici_adi}</div>
        <StarRating value={editMode ? Number(draftPuan) : Number(yorum.puan)} readOnly={!editMode} onChange={setDraftPuan} />
      </div>

      {error && <div className="mt-3 text-sm text-red-300">{error}</div>}

      {editMode ? (
        <textarea
          value={draftYorum}
          onChange={(e) => setDraftYorum(e.target.value)}
          rows={3}
          className="mt-3 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      ) : (
        <div className="mt-3 text-slate-300 whitespace-pre-wrap">{yorum.yorum}</div>
      )}

      {isOwner && (
        <div className="mt-3 flex flex-wrap gap-2 justify-end">
          {editMode ? (
            <>
              <button
                onClick={() => updateMutation.mutate()}
                disabled={updateMutation.isPending || draftYorum.trim().length < 3}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm"
              >
                Kaydet
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setError('');
                  setDraftYorum(yorum.yorum || '');
                  setDraftPuan(Number(yorum.puan) || 5);
                }}
                disabled={updateMutation.isPending || deleteMutation.isPending}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-sm"
              >
                İptal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditMode(true);
                  setError('');
                  setDraftYorum(yorum.yorum || '');
                  setDraftPuan(Number(yorum.puan) || 5);
                }}
                disabled={updateMutation.isPending || deleteMutation.isPending}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-sm"
              >
                Düzenle
              </button>
              <button
                onClick={() => {
                  const ok = window.confirm('Yorum silinsin mi?');
                  if (!ok) return;
                  deleteMutation.mutate();
                }}
                disabled={updateMutation.isPending || deleteMutation.isPending}
                className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-sm"
              >
                Sil
              </button>
            </>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-slate-500">{new Date(yorum.created_at).toLocaleString()}</div>
    </div>
  );
}
