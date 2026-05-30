const express = require('express');

const sitemapModel = require('../models/sitemapModel');

const router = express.Router();

const xmlEscape = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const baseUrl = (process.env.PUBLIC_BASE_URL || 'http://localhost:5173').replace(/\/$/, '');

    const slugs = await sitemapModel.getPublicSlugs();

    const urls = [];

    urls.push({ loc: `${baseUrl}/` });
    urls.push({ loc: `${baseUrl}/kitaplar` });
    urls.push({ loc: `${baseUrl}/haberler` });
    urls.push({ loc: `${baseUrl}/galeri` });
    urls.push({ loc: `${baseUrl}/soru-cevap` });

    for (const slug of slugs.kitaplar) urls.push({ loc: `${baseUrl}/kitap/${encodeURIComponent(slug)}` });
    for (const slug of slugs.yazarlar) urls.push({ loc: `${baseUrl}/yazar/${encodeURIComponent(slug)}` });
    for (const slug of slugs.haberler) urls.push({ loc: `${baseUrl}/haber/${encodeURIComponent(slug)}` });

    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      urls
        .map((u) => `<url><loc>${xmlEscape(u.loc)}</loc></url>`)
        .join('') +
      '</urlset>';

    res.header('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xml);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
