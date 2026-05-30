const { body } = require('express-validator');

const yorumModel = require('../models/yorumModel');

exports.createRules = [
  body('kitap_id').isInt({ min: 1 }).withMessage('kitap_id must be int'),
  body('yorum').isString().trim().isLength({ min: 3 }).withMessage('yorum must be at least 3 chars'),
  body('puan').isInt({ min: 1, max: 5 }).withMessage('puan must be 1-5'),
];

exports.updateRules = [
  body('yorum').isString().trim().isLength({ min: 3 }).withMessage('yorum must be at least 3 chars'),
  body('puan').isInt({ min: 1, max: 5 }).withMessage('puan must be 1-5'),
];

exports.listByBook = async (req, res, next) => {
  try {
    const kitapId = Number(req.params.kitapId);
    const onlyApproved = req.query.all === '1' ? false : true;

    const rows = await yorumModel.listByBookId(kitapId, { onlyApproved });
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { kitap_id, yorum, puan } = req.body;

    const id = await yorumModel.create({
      kitap_id: Number(kitap_id),
      kullanici_id: req.user.id,
      yorum,
      puan: Number(puan),
    });

    return res.status(201).json({ id });
  } catch (err) {
    return next(err);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const affected = await yorumModel.approveById(id);
    if (!affected) return res.status(404).json({ message: 'Comment not found' });

    return res.status(200).json({ message: 'Approved' });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    let affected = 0;
    if (req.user.rol === 'admin') {
      affected = await yorumModel.deleteById(id);
    } else {
      affected = await yorumModel.deleteOwnById({ id, kullanici_id: req.user.id });
    }

    if (!affected) return res.status(404).json({ message: 'Comment not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { yorum, puan } = req.body;

    const affected = await yorumModel.updateOwnById({
      id,
      kullanici_id: req.user.id,
      yorum,
      puan: Number(puan),
    });

    if (!affected) return res.status(404).json({ message: 'Comment not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    return next(err);
  }
};
