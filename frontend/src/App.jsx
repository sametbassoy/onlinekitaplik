import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import KitapListe from './pages/KitapListe.jsx';
import KitapDetay from './pages/KitapDetay.jsx';
import YazarProfil from './pages/YazarProfil.jsx';
import HaberListe from './pages/HaberListe.jsx';
import HaberDetay from './pages/HaberDetay.jsx';
import Galeri from './pages/Galeri.jsx';
import SoruCevap from './pages/SoruCevap.jsx';
import Profil from './pages/Profil.jsx';
import OkumaListesi from './pages/OkumaListesi.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import AdminPanel from './pages/admin/AdminPanel.jsx';
import KitapYonetim from './pages/admin/KitapYonetim.jsx';
import HaberYonetim from './pages/admin/HaberYonetim.jsx';
import GaleriYonetim from './pages/admin/GaleriYonetim.jsx';
import YorumYonetim from './pages/admin/YorumYonetim.jsx';
import SoruYonetim from './pages/admin/SoruYonetim.jsx';
import KullaniciYonetim from './pages/admin/KullaniciYonetim.jsx';
import YazarYonetim from './pages/admin/YazarYonetim.jsx';
import KategoriYonetim from './pages/admin/KategoriYonetim.jsx';

function NotFound() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-2 text-slate-300">Aradığın sayfa yok.</p>
      <Link className="inline-block mt-4 text-indigo-300 hover:text-indigo-200" to="/">
        Ana sayfaya dön
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kitaplar" element={<KitapListe />} />
          <Route path="/kitap/:slug" element={<KitapDetay />} />
          <Route path="/yazar/:slug" element={<YazarProfil />} />
          <Route path="/haberler" element={<HaberListe />} />
          <Route path="/haber/:slug" element={<HaberDetay />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/soru-cevap" element={<SoruCevap />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profil" element={<Profil />} />
            <Route path="/okuma-listesi" element={<OkumaListesi />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/kitaplar" element={<KitapYonetim />} />
            <Route path="/admin/yazarlar" element={<YazarYonetim />} />
            <Route path="/admin/kategoriler" element={<KategoriYonetim />} />
            <Route path="/admin/haberler" element={<HaberYonetim />} />
            <Route path="/admin/galeri" element={<GaleriYonetim />} />
            <Route path="/admin/yorumlar" element={<YorumYonetim />} />
            <Route path="/admin/sorular" element={<SoruYonetim />} />
            <Route path="/admin/kullanicilar" element={<KullaniciYonetim />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
