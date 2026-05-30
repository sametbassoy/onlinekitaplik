const express = require('express');

const kitapController = require('../controllers/kitapController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', kitapController.list);
router.get('/populer', kitapController.popular);
router.get('/:slug', kitapController.detail);

router.post('/', authMiddleware, adminMiddleware, upload.single('kapak'), kitapController.create);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('kapak'), kitapController.update);
router.delete('/:id', authMiddleware, adminMiddleware, kitapController.remove);

module.exports = router;
