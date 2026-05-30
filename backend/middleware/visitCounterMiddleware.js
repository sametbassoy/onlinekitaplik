const ziyaretciModel = require('../models/ziyaretciModel');

module.exports = async (req, res, next) => {
  try {
    const method = req.method.toUpperCase();
    if (method !== 'GET') return next();

    if (req.path === '/api/health' || req.path === '/api/csrf-token') return next();

    await ziyaretciModel.increment();
    return next();
  } catch (err) {
    return next();
  }
};
