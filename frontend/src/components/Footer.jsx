import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-400 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Online Kitaplık</span>
        <span className="text-slate-500">MVC + Express + React</span>
      </div>
    </footer>
  );
}
