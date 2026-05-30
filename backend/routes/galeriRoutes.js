const express = require('express');

const galeriController = require('../controllers/galeriController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', galeriController.list);
router.post('/', authMiddleware, adminMiddleware, upload.single('resim'), galeriController.createRules, validate, galeriController.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('resim'), galeriController.updateRules, validate, galeriController.update);
router.delete('/:id', authMiddleware, adminMiddleware, galeriController.remove);

module.exports = router;
