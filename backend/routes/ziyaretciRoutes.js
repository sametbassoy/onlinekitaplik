const express = require('express');

const ziyaretciController = require('../controllers/ziyaretciController');

const router = express.Router();

router.get('/', ziyaretciController.getTotal);
router.post('/artir', ziyaretciController.increment);

module.exports = router;
