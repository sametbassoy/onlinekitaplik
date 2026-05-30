const { promisePool } = require('../config/db');

exports.listAll = async () => {
  const [rows] = await promisePool.query(
    `SELECT s.id, s.kullanici_id, s.soru, s.cevap, s.cevaplandi, s.created_at,
            k.kullanici_adi
     FROM sorular s
     JOIN kullanicilar k ON k.id = s.kullanici_id
     ORDER BY s.created_at DESC`
  );
  return rows;
};

exports.create = async ({ kullanici_id, soru }) => {
  const [result] = await promisePool.query(
    'INSERT INTO sorular (kullanici_id, soru, cevap, cevaplandi) VALUES (?, ?, NULL, 0)',
    [kullanici_id, soru]
  );
  return result.insertId;
};

exports.answerById = async ({ id, cevap }) => {
  const [result] = await promisePool.query(
    'UPDATE sorular SET cevap = ?, cevaplandi = 1 WHERE id = ?',
    [cevap, id]
  );
  return result.affectedRows;
};
