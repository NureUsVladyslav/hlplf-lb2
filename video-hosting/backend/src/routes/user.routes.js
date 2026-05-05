const express = require('express');
const auth = require('../middleware/auth.middleware');
const adminOnly = require('../middleware/admin.middleware');
const { getUsers, updateUserRole, deleteUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', auth, getUsers);
router.patch('/:id/role', auth, adminOnly, updateUserRole);
router.delete('/:id', auth, adminOnly, deleteUser);

module.exports = router;
