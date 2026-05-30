const { promisePool } = require('../config/db');

exports.create = async ({ ad, slug }) => {
  const [result] = await promisePool.query('INSERT INTO yazarlar (ad, slug) VALUES (?, ?)', [ad, slug]);
  return result.insertId;
};

exports.deleteById = async ({ id }) => {
  const [result] = await promisePool.query('DELETE FROM yazarlar WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.updateById = async ({ id, ad, slug }) => {
  const [result] = await promisePool.query('UPDATE yazarlar SET ad = ?, slug = ? WHERE id = ?', [ad, slug, id]);
  return result.affectedRows;
};
