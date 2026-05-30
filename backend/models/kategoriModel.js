const { promisePool } = require('../config/db');

exports.list = async () => {
  const [rows] = await promisePool.query('SELECT id, ad, slug FROM kategoriler ORDER BY ad ASC');
  return rows;
};

exports.listSlugs = async () => {
  const [rows] = await promisePool.query('SELECT slug FROM kategoriler ORDER BY id DESC');
  return rows.map((r) => r.slug);
};
