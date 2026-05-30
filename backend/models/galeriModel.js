const { promisePool } = require('../config/db');

exports.list = async () => {
  const [rows] = await promisePool.query(
    'SELECT id, baslik, resim_yolu, created_at FROM galeri ORDER BY created_at DESC'
  );
  return rows;
};

exports.create = async ({ baslik, resim_yolu }) => {
  const [result] = await promisePool.query(
    'INSERT INTO galeri (baslik, resim_yolu) VALUES (?, ?)',
    [baslik, resim_yolu]
  );
  return result.insertId;
};

exports.updateById = async (id, fields) => {
  const allowed = ['baslik', 'resim_yolu'];
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
  const [result] = await promisePool.query(`UPDATE galeri SET ${sets.join(', ')} WHERE id = ?`, params);
  return result.affectedRows;
};

exports.deleteById = async (id) => {
  const [result] = await promisePool.query('DELETE FROM galeri WHERE id = ?', [id]);
  return result.affectedRows;
};
