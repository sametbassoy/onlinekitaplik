const { body } = require('express-validator');

const adminModel = require('../models/adminModel');
const yazarAdminModel = require('../models/yazarAdminModel');
const kategoriAdminModel = require('../models/kategoriAdminModel');
const toSlug = require('../utils/slug');
const mapMysqlError = require('../utils/mysqlError');

exports.roleRules = [
  body('rol').isIn(['admin', 'kullanici']).withMessage('rol must be admin/kullanici'),
];

exports.dashboard = async (req, res, next) => {
  try {
    const counts = await adminModel.getDashboardCounts();
    return res.status(200).json({ data: counts });
  } catch (err) {
    return next(err);
  }
};

exports.updateKategori = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { ad } = req.body;
    const slug = toSlug(ad);

    const affected = await kategoriAdminModel.updateById({ id, ad, slug });
    if (!affected) return res.status(404).json({ message: 'Category not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    const mapped = mapMysqlError(err);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    return next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const fields = { ...req.body };

    if (fields.rol !== undefined && req.user.id === id && fields.rol !== 'admin') {
      return res.status(400).json({ message: 'You cannot remove your own admin role' });
    }

    const affected = await adminModel.updateUserById({ id, fields });
    if (!affected) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    const mapped = mapMysqlError(err);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    return next(err);
  }
};

exports.updateYazar = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { ad } = req.body;
    const slug = toSlug(ad);

    const affected = await yazarAdminModel.updateById({ id, ad, slug });
    if (!affected) return res.status(404).json({ message: 'Author not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    const mapped = mapMysqlError(err);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    return next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const rows = await adminModel.listUsers();
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { rol } = req.body;

    if (req.user.id === id && rol !== 'admin') {
      return res.status(400).json({ message: 'You cannot remove your own admin role' });
    }

    const affected = await adminModel.updateUserRole({ id, rol });
    if (!affected) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'Updated' });
  } catch (err) {
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (req.user.id === id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const affected = await adminModel.deleteUser({ id });
    if (!affected) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};

exports.listComments = async (req, res, next) => {
  try {
    const onaylandi = req.query.onaylandi !== undefined ? Number(req.query.onaylandi) : undefined;
    const rows = await adminModel.listComments({
      onaylandi: onaylandi === 0 || onaylandi === 1 ? onaylandi : undefined,
    });
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.listQuestions = async (req, res, next) => {
  try {
    const cevaplandi = req.query.cevaplandi !== undefined ? Number(req.query.cevaplandi) : undefined;
    const rows = await adminModel.listQuestions({
      cevaplandi: cevaplandi === 0 || cevaplandi === 1 ? cevaplandi : undefined,
    });
    return res.status(200).json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const affected = await adminModel.deleteQuestion({ id });
    if (!affected) return res.status(404).json({ message: 'Question not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
};

exports.createYazarRules = [
  body('ad').isString().trim().isLength({ min: 3, max: 150 }).withMessage('ad must be 3-150 chars'),
];

exports.updateYazarRules = [
  body('ad').isString().trim().isLength({ min: 3, max: 150 }).withMessage('ad must be 3-150 chars'),
];

exports.createKategoriRules = [
  body('ad').isString().trim().isLength({ min: 2, max: 150 }).withMessage('ad must be 2-150 chars'),
];

exports.updateKategoriRules = [
  body('ad').isString().trim().isLength({ min: 2, max: 150 }).withMessage('ad must be 2-150 chars'),
];

exports.updateUserRules = [
  body('kullanici_adi')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('kullanici_adi must be 3-50 chars'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email'),
  body('rol').optional().isIn(['admin', 'kullanici']).withMessage('rol must be admin/kullanici'),
];

exports.createYazar = async (req, res, next) => {
  try {
    const { ad } = req.body;
    const slug = toSlug(ad);

    const id = await yazarAdminModel.create({ ad, slug });
    return res.status(201).json({ id });
  } catch (err) {
    const mapped = mapMysqlError(err);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    return next(err);
  }
};

exports.createKategori = async (req, res, next) => {
  try {
    const { ad } = req.body;
    const slug = toSlug(ad);

    const id = await kategoriAdminModel.create({ ad, slug });
    return res.status(201).json({ id });
  } catch (err) {
    const mapped = mapMysqlError(err);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    return next(err);
  }
};

exports.deleteYazar = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const affected = await yazarAdminModel.deleteById({ id });
    if (!affected) return res.status(404).json({ message: 'Author not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    const mapped = mapMysqlError(err);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    return next(err);
  }
};

exports.deleteKategori = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const affected = await kategoriAdminModel.deleteById({ id });
    if (!affected) return res.status(404).json({ message: 'Category not found' });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    const mapped = mapMysqlError(err);
    if (mapped) return res.status(mapped.status).json({ message: mapped.message });
    return next(err);
  }
};
