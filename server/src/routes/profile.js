const express = require('express');
const { getMyProfile, upsertProfile, getPublicProfile } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth(true), getMyProfile);
router.put('/me', auth(true), upsertProfile);
router.get('/public', getPublicProfile);

module.exports = router;
