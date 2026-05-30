const express = require('express');

const okumalistesiController = require('../controllers/okumalistesiController');
const authMiddleware = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', authMiddleware, okumalistesiController.listMine);
router.post('/', authMiddleware, okumalistesiController.addRules, validate, okumalistesiController.add);
router.put('/:id', authMiddleware, okumalistesiController.updateRules, validate, okumalistesiController.updateStatus);
router.delete('/:id', authMiddleware, okumalistesiController.remove);

module.exports = router;
