import React from 'react';

export default function StarRating({ value = 0, onChange, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => (!readOnly ? onChange?.(s) : null)}
          className={`text-lg leading-none ${
            s <= value ? 'text-amber-400' : 'text-slate-600'
          } ${readOnly ? 'cursor-default' : 'hover:text-amber-300'}`}
          aria-label={`${s} yıldız`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
