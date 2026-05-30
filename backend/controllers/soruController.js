const { body } = require('express-validator');

const soruModel = require('../models/soruModel');

exports.askRules = [
  body('soru').isString().trim().isLength({ min: 5 }).withMessage('soru must be at least 5 chars'),
];

exports.answerRules = [
  body('cevap').isString().trim().isLength({ min: 1 }).withMessage('cevap is required'),
];

exports.list = async (req, res, next) => {
  try {
    const rows = await soruModel.listAll();
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.ask = async (req, res, next) => {
  try {
    const { soru } = req.body;
    const id = await soruModel.create({ kullanici_id: req.user.id, soru });
    return res.status(201).json({ id });
  } catch (err) {
    return next(err);
  }
};

exports.answer = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { cevap } = req.body;

    const affected = await soruModel.answerById({ id, cevap });
    if (!affected) return res.status(404).json({ message: 'Question not found' });

    return res.status(200).json({ message: 'Answered' });
  } catch (err) {
    return next(err);
  }
};
