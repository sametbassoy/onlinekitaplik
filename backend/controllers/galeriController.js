const { body } = require('express-validator');

const galeriModel = require('../models/galeriModel');

exports.createRules = [
  body('baslik').isString().trim().isLength({ min: 2 }).withMessage('baslik must be at least 2 chars'),
];

exports.updateRules = [
  body('baslik').isString().trim().isLength({ min: 2 }).withMessage('baslik must be at least 2 chars'),
];

exports.list = async (req, res, next) => {
  try {
    const rows = await galeriModel.list();
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const fields = { ...req.body };

    if (req.file) {
      fields.resim_yolu = `/uploads/${req.file.filename}`;
    }

    const affected = await galeriModel.updateById(id, fields);
    if (!affected) return res.status(404).json({ message: 'Gallery item not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { baslik } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'resim is required' });
    }

    const resim_yolu = `/uploads/${req.file.filename}`;

    const id = await galeriModel.create({ baslik, resim_yolu });
    return res.status(201).json({ id });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const affected = await galeriModel.deleteById(id);
    if (!affected) return res.status(404).json({ message: 'Gallery item not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};
