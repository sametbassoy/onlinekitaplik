const slugify = require('slugify');
const { body } = require('express-validator');

const haberModel = require('../models/haberModel');

exports.createRules = [
  body('baslik').isString().trim().isLength({ min: 3 }).withMessage('baslik must be at least 3 chars'),
  body('icerik').isString().trim().isLength({ min: 10 }).withMessage('icerik must be at least 10 chars'),
  body('kategori').isIn(['haber', 'duyuru']).withMessage('kategori must be haber/duyuru'),
];

exports.updateRules = [
  body('baslik').isString().trim().isLength({ min: 3 }).withMessage('baslik must be at least 3 chars'),
  body('icerik').isString().trim().isLength({ min: 10 }).withMessage('icerik must be at least 10 chars'),
  body('kategori').isIn(['haber', 'duyuru']).withMessage('kategori must be haber/duyuru'),
];

exports.list = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const kategori = req.query.kategori ? String(req.query.kategori) : '';

    const safePage = page < 1 ? 1 : page;
    const safeLimit = limit < 1 ? 10 : Math.min(limit, 50);
    const offset = (safePage - 1) * safeLimit;

    const { rows, total } = await haberModel.list({
      kategori: kategori === 'haber' || kategori === 'duyuru' ? kategori : null,
      limit: safeLimit,
      offset,
    });

    return res.status(200).json({
      data: rows,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const fields = { ...req.body };

    if (fields.baslik) {
      fields.slug = slugify(fields.baslik, { lower: true, strict: true, locale: 'tr' });
    }

    if (req.file) {
      fields.resim = `/uploads/${req.file.filename}`;
    }

    const affected = await haberModel.updateById(id, fields);
    if (!affected) return res.status(404).json({ message: 'News not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    return next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const haber = await haberModel.findBySlug(slug);
    if (!haber) return res.status(404).json({ message: 'News not found' });

    return res.status(200).json({ data: haber });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { baslik, icerik, kategori } = req.body;
    const slug = slugify(baslik, { lower: true, strict: true, locale: 'tr' });

    const resim = req.file ? `/uploads/${req.file.filename}` : req.body.resim;

    const id = await haberModel.create({ baslik, slug, icerik, resim, kategori });
    return res.status(201).json({ id });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const affected = await haberModel.deleteById(id);
    if (!affected) return res.status(404).json({ message: 'News not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};
