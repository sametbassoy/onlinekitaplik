const express = require('express');

const haberController = require('../controllers/haberController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', haberController.list);
router.get('/:slug', haberController.detail);

router.post('/', authMiddleware, adminMiddleware, upload.single('resim'), haberController.createRules, validate, haberController.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('resim'), haberController.updateRules, validate, haberController.update);
router.delete('/:id', authMiddleware, adminMiddleware, haberController.remove);

module.exports = router;
