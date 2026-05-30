const { promisePool } = require('../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await promisePool.query(
    'SELECT id, kullanici_adi, email, sifre, rol, created_at FROM kullanicilar WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

exports.findByUsername = async (kullanici_adi) => {
  const [rows] = await promisePool.query(
    'SELECT id, kullanici_adi, email, sifre, rol, created_at FROM kullanicilar WHERE kullanici_adi = ? LIMIT 1',
    [kullanici_adi]
  );
  return rows[0] || null;
};

exports.findById = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT id, kullanici_adi, email, rol, created_at FROM kullanicilar WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

exports.create = async ({ kullanici_adi, email, sifre, rol }) => {
  const [result] = await promisePool.query(
    'INSERT INTO kullanicilar (kullanici_adi, email, sifre, rol) VALUES (?, ?, ?, ?)',
    [kullanici_adi, email, sifre, rol]
  );
  return result.insertId;
};
