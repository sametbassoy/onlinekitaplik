const { body } = require('express-validator');

exports.registerRules = [
  body('kullanici_adi')
    .isString()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('kullanici_adi must be 3-50 chars'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('sifre').isString().isLength({ min: 6 }).withMessage('sifre must be at least 6 chars'),
];

exports.loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('sifre').isString().notEmpty().withMessage('sifre is required'),
];
