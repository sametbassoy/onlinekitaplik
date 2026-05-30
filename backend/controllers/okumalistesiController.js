const { body } = require('express-validator');

const okumalistesiModel = require('../models/okumalistesiModel');

exports.addRules = [
  body('kitap_id').isInt({ min: 1 }).withMessage('kitap_id must be int'),
  body('durum')
    .isIn(['okuyorum', 'okudum', 'okuyacagim'])
    .withMessage('durum must be okuyorum/okudum/okuyacagim'),
];

exports.updateRules = [
  body('durum')
    .isIn(['okuyorum', 'okudum', 'okuyacagim'])
    .withMessage('durum must be okuyorum/okudum/okuyacagim'),
];

exports.listMine = async (req, res, next) => {
  try {
    const rows = await okumalistesiModel.listByUserId(req.user.id);
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    const { kitap_id, durum } = req.body;

    await okumalistesiModel.create({
      kullanici_id: req.user.id,
      kitap_id: Number(kitap_id),
      durum,
    });

    return res.status(201).json({ message: 'Added' });
  } catch (err) {
    return next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { durum } = req.body;

    const affected = await okumalistesiModel.updateStatusById({
      id,
      kullanici_id: req.user.id,
      durum,
    });

    if (!affected) return res.status(404).json({ message: 'Item not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    return next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const affected = await okumalistesiModel.deleteById({ id, kullanici_id: req.user.id });
    if (!affected) return res.status(404).json({ message: 'Item not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};
