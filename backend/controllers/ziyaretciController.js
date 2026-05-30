const ziyaretciModel = require('../models/ziyaretciModel');

exports.getTotal = async (req, res, next) => {
  try {
    const total = await ziyaretciModel.getTotal();
    return res.status(200).json({ toplam: total });
  } catch (err) {
    return next(err);
  }
};

exports.increment = async (req, res, next) => {
  try {
    await ziyaretciModel.increment();
    const total = await ziyaretciModel.getTotal();
    return res.status(200).json({ toplam: total });
  } catch (err) {
    return next(err);
  }
};
