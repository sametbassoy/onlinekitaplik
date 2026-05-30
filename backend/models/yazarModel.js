const { promisePool } = require('../config/db');

exports.list = async () => {
  const [rows] = await promisePool.query(
    'SELECT id, ad, slug, biyografi, foto FROM yazarlar ORDER BY ad ASC'
  );
  return rows;
};

exports.findBySlug = async (slug) => {
  const [rows] = await promisePool.query(
    'SELECT id, ad, slug, biyografi, foto FROM yazarlar WHERE slug = ? LIMIT 1',
    [slug]
  );
  return rows[0] || null;
};

exports.listSlugs = async () => {
  const [rows] = await promisePool.query('SELECT slug FROM yazarlar ORDER BY id DESC');
  return rows.map((r) => r.slug);
};
