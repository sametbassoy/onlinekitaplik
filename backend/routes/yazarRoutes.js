const express = require('express');

const yazarController = require('../controllers/yazarController');

const router = express.Router();

router.get('/', yazarController.list);
router.get('/:slug', yazarController.detail);

module.exports = router;
