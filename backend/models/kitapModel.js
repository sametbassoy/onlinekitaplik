const { promisePool } = require('../config/db');

exports.list = async ({ page, limit, q, kategoriSlug, yazarSlug }) => {
  const offset = (page - 1) * limit;

  const where = [];
  const params = [];

  if (q) {
    where.push('(k.baslik LIKE ? OR y.ad LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  if (kategoriSlug) {
    where.push('kat.slug = ?');
    params.push(kategoriSlug);
  }

  if (yazarSlug) {
    where.push('y.slug = ?');
    params.push(yazarSlug);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await promisePool.query(
    `SELECT COUNT(*) as total
     FROM kitaplar k
     JOIN yazarlar y ON y.id = k.yazar_id
     JOIN kategoriler kat ON kat.id = k.kategori_id
     ${whereSql}`,
    params
  );

  const total = Number(countRows[0].total || 0);

  const [rows] = await promisePool.query(
    `SELECT k.id, k.baslik, k.slug, k.kapak, k.goruntuleme, k.created_at,
            y.id as yazar_id, y.ad as yazar_ad, y.slug as yazar_slug,
            kat.id as kategori_id, kat.ad as kategori_ad, kat.slug as kategori_slug
     FROM kitaplar k
     JOIN yazarlar y ON y.id = k.yazar_id
     JOIN kategoriler kat ON kat.id = k.kategori_id
     ${whereSql}
     ORDER BY k.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total };
};

exports.listPopular = async (limit) => {
  const [rows] = await promisePool.query(
    `SELECT k.id, k.baslik, k.slug, k.kapak,
            SUM(yr.puan) as toplam_puan,
            y.ad as yazar_ad, y.slug as yazar_slug,
            kat.ad as kategori_ad, kat.slug as kategori_slug
     FROM kitaplar k
     JOIN yorumlar yr ON yr.kitap_id = k.id AND yr.onaylandi = 1
     JOIN yazarlar y ON y.id = k.yazar_id
     JOIN kategoriler kat ON kat.id = k.kategori_id
     GROUP BY k.id
     HAVING toplam_puan >= 10
     ORDER BY toplam_puan DESC, k.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

exports.findBySlug = async (slug) => {
  const [rows] = await promisePool.query(
    `SELECT k.id, k.baslik, k.slug, k.yazar_id, k.kategori_id, k.aciklama, k.kapak,
            k.goruntuleme, k.created_at,
            y.ad as yazar_ad, y.slug as yazar_slug, y.biyografi as yazar_biyografi, y.foto as yazar_foto,
            kat.ad as kategori_ad, kat.slug as kategori_slug
     FROM kitaplar k
     JOIN yazarlar y ON y.id = k.yazar_id
     JOIN kategoriler kat ON kat.id = k.kategori_id
     WHERE k.slug = ?
     LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
};

exports.incrementView = async (id) => {
  await promisePool.query('UPDATE kitaplar SET goruntuleme = goruntuleme + 1 WHERE id = ?', [id]);
};

exports.create = async ({ baslik, slug, yazar_id, kategori_id, aciklama, kapak }) => {
  const [result] = await promisePool.query(
    `INSERT INTO kitaplar (baslik, slug, yazar_id, kategori_id, aciklama, kapak)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [baslik, slug, yazar_id, kategori_id, aciklama || null, kapak || null]
  );
  return result.insertId;
};

exports.updateById = async (id, fields) => {
  const allowed = ['baslik', 'slug', 'yazar_id', 'kategori_id', 'aciklama', 'kapak'];
  const sets = [];
  const params = [];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      sets.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (!sets.length) return 0;

  params.push(id);
  const [result] = await promisePool.query(`UPDATE kitaplar SET ${sets.join(', ')} WHERE id = ?`, params);
  return result.affectedRows;
};

exports.deleteById = async (id) => {
  const [result] = await promisePool.query('DELETE FROM kitaplar WHERE id = ?', [id]);
  return result.affectedRows;
};
