const yazarModel = require('../models/yazarModel');

exports.list = async (req, res, next) => {
  try {
    const rows = await yazarModel.list();
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.detail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const yazar = await yazarModel.findBySlug(slug);
    if (!yazar) return res.status(404).json({ message: 'Author not found' });
    return res.status(200).json({ data: yazar });
  } catch (err) {
    return next(err);
  }
};
