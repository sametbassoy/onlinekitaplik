const { promisePool } = require('../config/db');

exports.getPublicSlugs = async () => {
  const [kitapRows] = await promisePool.query('SELECT slug FROM kitaplar ORDER BY id DESC');
  const [yazarRows] = await promisePool.query('SELECT slug FROM yazarlar ORDER BY id DESC');
  const [haberRows] = await promisePool.query('SELECT slug FROM haberler ORDER BY id DESC');

  return {
    kitaplar: kitapRows.map((r) => r.slug),
    yazarlar: yazarRows.map((r) => r.slug),
    haberler: haberRows.map((r) => r.slug),
  };
};
