const { promisePool } = require('../config/db');

exports.listByBookId = async (kitapId, { onlyApproved }) => {
  const where = ['y.kitap_id = ?'];
  const params = [kitapId];

  if (onlyApproved) {
    where.push('y.onaylandi = 1');
  }

  const [rows] = await promisePool.query(
    `SELECT y.id, y.kitap_id, y.kullanici_id, y.yorum, y.puan, y.onaylandi, y.created_at,
            k.kullanici_adi
     FROM yorumlar y
     JOIN kullanicilar k ON k.id = y.kullanici_id
     WHERE ${where.join(' AND ')}
     ORDER BY y.created_at DESC`,
    params
  );

  return rows;
};

exports.create = async ({ kitap_id, kullanici_id, yorum, puan }) => {
  const [result] = await promisePool.query(
    `INSERT INTO yorumlar (kitap_id, kullanici_id, yorum, puan, onaylandi)
     VALUES (?, ?, ?, ?, 0)`,
    [kitap_id, kullanici_id, yorum, puan]
  );
  return result.insertId;
};

exports.approveById = async (id) => {
  const [result] = await promisePool.query('UPDATE yorumlar SET onaylandi = 1 WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.deleteById = async (id) => {
  const [result] = await promisePool.query('DELETE FROM yorumlar WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.updateOwnById = async ({ id, kullanici_id, yorum, puan }) => {
  const [result] = await promisePool.query(
    'UPDATE yorumlar SET yorum = ?, puan = ?, onaylandi = 0 WHERE id = ? AND kullanici_id = ?',
    [yorum, puan, id, kullanici_id]
  );
  return result.affectedRows;
};

exports.deleteOwnById = async ({ id, kullanici_id }) => {
  const [result] = await promisePool.query('DELETE FROM yorumlar WHERE id = ? AND kullanici_id = ?', [id, kullanici_id]);
  return result.affectedRows;
};
