const express = require('express');

const kategoriController = require('../controllers/kategoriController');

const router = express.Router();

router.get('/', kategoriController.list);

module.exports = router;
