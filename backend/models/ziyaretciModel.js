const { promisePool } = require('../config/db');

exports.getTotal = async () => {
  const [rows] = await promisePool.query('SELECT toplam FROM ziyaretci WHERE id = 1 LIMIT 1');
  return rows[0] ? Number(rows[0].toplam) : 0;
};

exports.increment = async () => {
  await promisePool.query('UPDATE ziyaretci SET toplam = toplam + 1 WHERE id = 1');
};
