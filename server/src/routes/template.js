const express = require('express');
const { cloneTemplate } = require('../controllers/templateController');

const router = express.Router();

router.post('/clone', cloneTemplate);

module.exports = router;
