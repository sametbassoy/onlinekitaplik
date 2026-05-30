const { promisePool } = require('../config/db');

exports.create = async ({ ad, slug }) => {
  const [result] = await promisePool.query('INSERT INTO kategoriler (ad, slug) VALUES (?, ?)', [ad, slug]);
  return result.insertId;
};

exports.deleteById = async ({ id }) => {
  const [result] = await promisePool.query('DELETE FROM kategoriler WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.updateById = async ({ id, ad, slug }) => {
  const [result] = await promisePool.query('UPDATE kategoriler SET ad = ?, slug = ? WHERE id = ?', [ad, slug, id]);
  return result.affectedRows;
};
