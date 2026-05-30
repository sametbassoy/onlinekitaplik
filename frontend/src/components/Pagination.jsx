import React from 'react';

export default function Pagination({ page, totalPages, onPage }) {
  if (!totalPages || totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={prevDisabled}
        onClick={() => onPage(page - 1)}
        className={`px-3 py-2 rounded-lg border border-slate-800 ${
          prevDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-900'
        }`}
      >
        Önceki
      </button>
      <div className="text-sm text-slate-300">
        {page} / {totalPages}
      </div>
      <button
        disabled={nextDisabled}
        onClick={() => onPage(page + 1)}
        className={`px-3 py-2 rounded-lg border border-slate-800 ${
          nextDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-900'
        }`}
      >
        Sonraki
      </button>
    </div>
  );
}
