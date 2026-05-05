const express = require('express');
const auth = require('../middleware/auth.middleware');
const uploadVideoMiddleware = require('../middleware/upload.middleware');
const { getVideos, getVideoById, uploadVideo, streamVideo } = require('../controllers/video.controller');
const { getComments, createComment } = require('../controllers/comment.controller');
const { shareVideo } = require('../controllers/share.controller');

const router = express.Router();

router.get('/', getVideos);
router.post('/', auth, uploadVideoMiddleware.single('video'), uploadVideo);
router.get('/:id/stream', streamVideo);
router.get('/:id', getVideoById);
router.get('/:videoId/comments', getComments);
router.post('/:videoId/comments', auth, createComment);
router.post('/:videoId/share', auth, shareVideo);

module.exports = router;
