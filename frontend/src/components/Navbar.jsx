import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-900'
  }`;

export default function Navbar() {
  const { isAuthed, isAdmin, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          Online Kitaplık
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/kitaplar" className={navClass}>
            Kitaplar
          </NavLink>
          {isAuthed && (
            <NavLink to="/okuma-listesi" className={navClass}>
              Okuma Listem
            </NavLink>
          )}
          <NavLink to="/haberler" className={navClass}>
            Haberler
          </NavLink>
          <NavLink to="/galeri" className={navClass}>
            Galeri
          </NavLink>
          <NavLink to="/soru-cevap" className={navClass}>
            Soru-Cevap
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              <Link
                to="/profil"
                className="hidden sm:inline-block text-sm text-slate-300 hover:text-white"
              >
                {user?.kullanici_adi}
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700"
              >
                Giriş
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 rounded-lg text-sm bg-indigo-600 hover:bg-indigo-500"
              >
                Kayıt
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
