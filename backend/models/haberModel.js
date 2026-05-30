const { promisePool } = require('../config/db');

exports.list = async ({ kategori, limit, offset }) => {
  const where = [];
  const params = [];

  if (kategori) {
    where.push('h.kategori = ?');
    params.push(kategori);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [countRows] = await promisePool.query(
    `SELECT COUNT(*) as total FROM haberler h ${whereSql}`,
    params
  );

  const total = Number(countRows[0].total || 0);

  const [rows] = await promisePool.query(
    `SELECT h.id, h.baslik, h.slug, h.resim, h.kategori, h.created_at
     FROM haberler h
     ${whereSql}
     ORDER BY h.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total };
};

exports.findBySlug = async (slug) => {
  const [rows] = await promisePool.query(
    `SELECT id, baslik, slug, icerik, resim, kategori, created_at
     FROM haberler
     WHERE slug = ?
     LIMIT 1`,
    [slug]
  );
  return rows[0] || null;
};

exports.create = async ({ baslik, slug, icerik, resim, kategori }) => {
  const [result] = await promisePool.query(
    `INSERT INTO haberler (baslik, slug, icerik, resim, kategori)
     VALUES (?, ?, ?, ?, ?)`,
    [baslik, slug, icerik, resim || null, kategori]
  );
  return result.insertId;
};

exports.updateById = async (id, fields) => {
  const allowed = ['baslik', 'slug', 'icerik', 'resim', 'kategori'];
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
  const [result] = await promisePool.query(`UPDATE haberler SET ${sets.join(', ')} WHERE id = ?`, params);
  return result.affectedRows;
};

exports.deleteById = async (id) => {
  const [result] = await promisePool.query('DELETE FROM haberler WHERE id = ?', [id]);
  return result.affectedRows;
};
