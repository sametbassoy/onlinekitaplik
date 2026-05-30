const express = require('express');

const soruController = require('../controllers/soruController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', soruController.list);
router.post('/', authMiddleware, soruController.askRules, validate, soruController.ask);
router.put('/:id/cevapla', authMiddleware, adminMiddleware, soruController.answerRules, validate, soruController.answer);

module.exports = router;
