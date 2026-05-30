const express = require('express');

const authController = require('../controllers/authController');
const { validate } = require('../middleware/validationMiddleware');
const { registerRules, loginRules } = require('../middleware/validationRules');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
