const db = require('../db/database');

function getUsers(req, res) {
  const users = db
    .prepare('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC')
    .all();

  return res.json(users);
}

function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  if (!['USER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ message: 'role має бути USER або ADMIN' });
  }

  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ message: 'Користувача не знайдено' });
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);

  const updatedUser = db
    .prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?')
    .get(id);

  return res.json(updatedUser);
}

function deleteUser(req, res) {
  const { id } = req.params;

  if (Number(id) === req.user.id) {
    return res.status(400).json({ message: 'Адміністратор не може видалити сам себе' });
  }

  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!user) {
    return res.status(404).json({ message: 'Користувача не знайдено' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return res.json({ message: 'Користувача видалено' });
}

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser
};
