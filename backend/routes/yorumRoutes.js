const express = require('express');

const yorumController = require('../controllers/yorumController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/:kitapId', yorumController.listByBook);
router.post('/', authMiddleware, yorumController.createRules, validate, yorumController.create);
router.put('/:id', authMiddleware, yorumController.updateRules, validate, yorumController.update);
router.put('/:id/onayla', authMiddleware, adminMiddleware, yorumController.approve);
router.delete('/:id', authMiddleware, yorumController.remove);

module.exports = router;
