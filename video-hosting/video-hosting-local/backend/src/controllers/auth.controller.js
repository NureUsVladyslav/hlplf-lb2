const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
}

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: '7d'
  });
}

function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email і password обов’язкові' });
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Користувач з таким email вже існує' });
  }

  const usersCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const role = usersCount === 0 ? 'ADMIN' : 'USER';
  const hashedPassword = bcrypt.hashSync(password, 10);

  const result = db
    .prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)')
    .run(username, email, hashedPassword, role);

  const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = createToken(user);

  return res.status(201).json({ token, user: publicUser(user) });
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email і password обов’язкові' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ message: 'Невірний email або пароль' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Невірний email або пароль' });
  }

  const token = createToken(user);
  return res.json({ token, user: publicUser(user) });
}

function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  me
};
