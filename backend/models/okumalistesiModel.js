const { promisePool } = require('../config/db');

exports.listByUserId = async (kullaniciId) => {
  const [rows] = await promisePool.query(
    `SELECT ol.id, ol.kullanici_id, ol.kitap_id, ol.durum,
            k.baslik, k.slug, k.kapak,
            y.ad as yazar_ad, y.slug as yazar_slug,
            kat.ad as kategori_ad, kat.slug as kategori_slug
     FROM okuma_listesi ol
     JOIN kitaplar k ON k.id = ol.kitap_id
     JOIN yazarlar y ON y.id = k.yazar_id
     JOIN kategoriler kat ON kat.id = k.kategori_id
     WHERE ol.kullanici_id = ?
     ORDER BY ol.id DESC`,
    [kullaniciId]
  );
  return rows;
};

exports.create = async ({ kullanici_id, kitap_id, durum }) => {
  const [result] = await promisePool.query(
    `INSERT INTO okuma_listesi (kullanici_id, kitap_id, durum)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE durum = VALUES(durum)`,
    [kullanici_id, kitap_id, durum]
  );

  return result.insertId || 0;
};

exports.updateStatusById = async ({ id, kullanici_id, durum }) => {
  const [result] = await promisePool.query(
    'UPDATE okuma_listesi SET durum = ? WHERE id = ? AND kullanici_id = ?',
    [durum, id, kullanici_id]
  );
  return result.affectedRows;
};

exports.deleteById = async ({ id, kullanici_id }) => {
  const [result] = await promisePool.query(
    'DELETE FROM okuma_listesi WHERE id = ? AND kullanici_id = ?',
    [id, kullanici_id]
  );
  return result.affectedRows;
};
