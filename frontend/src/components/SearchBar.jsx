import React, { useState } from 'react';

export default function SearchBar({ initialValue = '', onSearch }) {
  const [value, setValue] = useState(initialValue);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Kitap veya yazar ara..."
        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
      <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">Ara</button>
    </form>
  );
}
