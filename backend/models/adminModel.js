const { promisePool } = require('../config/db');

exports.getDashboardCounts = async () => {
  const [[users]] = await promisePool.query('SELECT COUNT(*) as total FROM kullanicilar');
  const [[books]] = await promisePool.query('SELECT COUNT(*) as total FROM kitaplar');
  const [[news]] = await promisePool.query('SELECT COUNT(*) as total FROM haberler');
  const [[gallery]] = await promisePool.query('SELECT COUNT(*) as total FROM galeri');
  const [[pendingComments]] = await promisePool.query('SELECT COUNT(*) as total FROM yorumlar WHERE onaylandi = 0');
  const [[unansweredQuestions]] = await promisePool.query('SELECT COUNT(*) as total FROM sorular WHERE cevaplandi = 0');
  const [[visits]] = await promisePool.query('SELECT toplam as total FROM ziyaretci WHERE id = 1');
  let onlineKullanicilar = 0;
  try {
    const nowEpochSec = Math.floor(Date.now() / 1000);
    const activeSinceMs = Date.now() - 2 * 60 * 1000;
    const [sessionRows] = await promisePool.query('SELECT data FROM sessions WHERE expires > ?', [nowEpochSec]);
    onlineKullanicilar = sessionRows.reduce((acc, row) => {
      try {
        const raw = row.data;
        if (!raw) return acc;

        const str = Buffer.isBuffer(raw) ? raw.toString('utf8') : String(raw);
        const parsed = JSON.parse(str);
        const lastSeen = Number(parsed?.lastSeen);
        if (Number.isFinite(lastSeen) && lastSeen > activeSinceMs) return acc + 1;
        return acc;
      } catch (_) {
        return acc;
      }
    }, 0);
  } catch (_) {
    onlineKullanicilar = 0;
  }

  return {
    kullanicilar: Number(users.total || 0),
    kitaplar: Number(books.total || 0),
    haberler: Number(news.total || 0),
    galeri: Number(gallery.total || 0),
    onlineKullanicilar,
    bekleyenYorumlar: Number(pendingComments.total || 0),
    bekleyenSorular: Number(unansweredQuestions.total || 0),
    ziyaretciToplam: Number(visits.total || 0),
  };
};

exports.listUsers = async () => {
  const [rows] = await promisePool.query(
    'SELECT id, kullanici_adi, email, rol, created_at FROM kullanicilar ORDER BY created_at DESC'
  );
  return rows;
};

exports.deleteQuestion = async ({ id }) => {
  const [result] = await promisePool.query('DELETE FROM sorular WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.updateUserRole = async ({ id, rol }) => {
  const [result] = await promisePool.query('UPDATE kullanicilar SET rol = ? WHERE id = ?', [rol, id]);
  return result.affectedRows;
};

exports.updateUserById = async ({ id, fields }) => {
  const allowed = ['kullanici_adi', 'email', 'rol'];
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
  const [result] = await promisePool.query(`UPDATE kullanicilar SET ${sets.join(', ')} WHERE id = ?`, params);
  return result.affectedRows;
};

exports.deleteUser = async ({ id }) => {
  const [result] = await promisePool.query('DELETE FROM kullanicilar WHERE id = ?', [id]);
  return result.affectedRows;
};

exports.listComments = async ({ onaylandi }) => {
  const where = [];
  const params = [];

  if (onaylandi === 0 || onaylandi === 1) {
    where.push('y.onaylandi = ?');
    params.push(onaylandi);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await promisePool.query(
    `SELECT y.id, y.kitap_id, y.kullanici_id, y.yorum, y.puan, y.onaylandi, y.created_at,
            k.kullanici_adi,
            b.baslik as kitap_baslik, b.slug as kitap_slug
     FROM yorumlar y
     JOIN kullanicilar k ON k.id = y.kullanici_id
     JOIN kitaplar b ON b.id = y.kitap_id
     ${whereSql}
     ORDER BY y.created_at DESC`,
    params
  );

  return rows;
};

exports.listQuestions = async ({ cevaplandi }) => {
  const where = [];
  const params = [];

  if (cevaplandi === 0 || cevaplandi === 1) {
    where.push('s.cevaplandi = ?');
    params.push(cevaplandi);
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await promisePool.query(
    `SELECT s.id, s.kullanici_id, s.soru, s.cevap, s.cevaplandi, s.created_at,
            k.kullanici_adi
     FROM sorular s
     JOIN kullanicilar k ON k.id = s.kullanici_id
     ${whereSql}
     ORDER BY s.created_at DESC`,
    params
  );

  return rows;
};
