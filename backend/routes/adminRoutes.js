const express = require('express');

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', adminController.dashboard);

router.get('/kullanicilar', adminController.listUsers);
router.put('/kullanicilar/:id/rol', adminController.roleRules, validate, adminController.updateUserRole);
router.put('/kullanicilar/:id', adminController.updateUserRules, validate, adminController.updateUser);
router.delete('/kullanicilar/:id', adminController.deleteUser);

router.get('/yorumlar', adminController.listComments);
router.get('/sorular', adminController.listQuestions);
router.delete('/sorular/:id', adminController.deleteQuestion);

router.post('/yazarlar', adminController.createYazarRules, validate, adminController.createYazar);
router.put('/yazarlar/:id', adminController.updateYazarRules, validate, adminController.updateYazar);
router.delete('/yazarlar/:id', adminController.deleteYazar);
router.post('/kategoriler', adminController.createKategoriRules, validate, adminController.createKategori);
router.put('/kategoriler/:id', adminController.updateKategoriRules, validate, adminController.updateKategori);
router.delete('/kategoriler/:id', adminController.deleteKategori);

module.exports = router;
