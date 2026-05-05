const express = require('express');
const auth = require('../middleware/auth.middleware');
const { subscribe, unsubscribe, getSubscriptions } = require('../controllers/subscription.controller');

const router = express.Router();

router.get('/', auth, getSubscriptions);
router.post('/users/:id/subscribe', auth, subscribe);
router.delete('/users/:id/subscribe', auth, unsubscribe);

module.exports = router;
