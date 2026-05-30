const slugify = require('slugify');

const kitapModel = require('../models/kitapModel');

exports.list = async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 12;

    const q = req.query.q ? String(req.query.q).trim() : '';
    const kategori = req.query.kategori ? String(req.query.kategori).trim() : '';
    const yazar = req.query.yazar ? String(req.query.yazar).trim() : '';

    const { rows, total } = await kitapModel.list({
      page: page < 1 ? 1 : page,
      limit: limit < 1 ? 12 : Math.min(limit, 50),
      q: q || null,
      kategoriSlug: kategori || null,
      yazarSlug: yazar || null,
    });

    return res.status(200).json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.popular = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const rows = await kitapModel.listPopular(Math.min(Math.max(limit, 1), 50));
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const kitap = await kitapModel.findBySlug(slug);
    if (!kitap) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await kitapModel.incrementView(kitap.id);

    const updated = { ...kitap, goruntuleme: Number(kitap.goruntuleme) + 1 };

    return res.status(200).json({ data: updated });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { baslik, yazar_id, kategori_id, aciklama } = req.body;

    const slug = slugify(baslik, { lower: true, strict: true, locale: 'tr' });

    const kapak = req.file ? `/uploads/${req.file.filename}` : req.body.kapak;

    const id = await kitapModel.create({
      baslik,
      slug,
      yazar_id: Number(yazar_id),
      kategori_id: Number(kategori_id),
      aciklama,
      kapak,
    });

    return res.status(201).json({ id });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = { ...req.body };

    if (fields.baslik) {
      fields.slug = slugify(fields.baslik, { lower: true, strict: true, locale: 'tr' });
    }

    if (req.file) {
      fields.kapak = `/uploads/${req.file.filename}`;
    }

    if (fields.yazar_id !== undefined) fields.yazar_id = Number(fields.yazar_id);
    if (fields.kategori_id !== undefined) fields.kategori_id = Number(fields.kategori_id);

    const affected = await kitapModel.updateById(Number(id), fields);
    if (!affected) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const affected = await kitapModel.deleteById(Number(id));
    if (!affected) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};
