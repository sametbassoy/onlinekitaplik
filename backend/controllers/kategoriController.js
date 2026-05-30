const kategoriModel = require('../models/kategoriModel');

exports.list = async (req, res, next) => {
  try {
    const rows = await kategoriModel.list();
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};
