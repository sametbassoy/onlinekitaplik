import React from 'react';
import useAuth from '../hooks/useAuth';

export default function Profil() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
        <div className="text-sm text-slate-400">Kullanıcı</div>
        <div className="mt-2 grid gap-2">
          <div>
            <div className="text-xs text-slate-500">Kullanıcı Adı</div>
            <div className="text-slate-200">{user?.kullanici_adi}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Email</div>
            <div className="text-slate-200">{user?.email}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Rol</div>
            <div className="text-slate-200">{user?.rol}{isAdmin ? ' (Admin)' : ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
