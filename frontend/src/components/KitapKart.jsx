import React from 'react';
import { Link } from 'react-router-dom';

export default function KitapKart({ kitap }) {
  return (
    <Link
      to={`/kitap/${kitap.slug}`}
      className="group rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 transition overflow-hidden"
    >
      <div className="aspect-[3/4] bg-slate-900">
        {kitap.kapak ? (
          <img
            src={(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + kitap.kapak}
            alt={kitap.baslik}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Kapak yok</div>
        )}
      </div>
      <div className="p-4">
        <div className="font-medium leading-snug overflow-hidden text-ellipsis whitespace-nowrap">{kitap.baslik}</div>
        <div className="mt-2 text-sm text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">{kitap.yazar_ad}</div>
        <div className="mt-1 text-xs text-slate-500">{kitap.kategori_ad}</div>
      </div>
    </Link>
  );
}
