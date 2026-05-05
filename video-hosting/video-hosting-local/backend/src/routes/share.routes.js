const express = require('express');
const auth = require('../middleware/auth.middleware');
const { getSharedVideos } = require('../controllers/share.controller');

const router = express.Router();

router.get('/', auth, getSharedVideos);

module.exports = router;
