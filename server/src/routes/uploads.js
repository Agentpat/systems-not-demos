const express = require('express');
const { createUpload } = require('../config/storage');
const { auth } = require('../middleware/auth');
const { getFile, handleUpload } = require('../controllers/uploadController');

const router = express.Router();
const upload = createUpload();

router.post('/', auth(true), upload.single('file'), handleUpload);
router.get('/:filename', getFile);

module.exports = router;
