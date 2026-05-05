const jwt = require('jsonwebtoken');
const db = require('../db/database');

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Потрібна авторизація' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(payload.id);

    if (!user) {
      return res.status(401).json({ message: 'Користувача не знайдено' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Невалідний токен' });
  }
}

module.exports = auth;
