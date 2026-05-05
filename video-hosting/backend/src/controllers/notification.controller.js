const db = require('../db/database');

function getNotifications(req, res) {
  const notifications = db
    .prepare(`
      SELECT id, user_id, video_id, message, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `)
    .all(req.user.id);

  return res.json(notifications);
}

function markAsRead(req, res) {
  const { id } = req.params;

  const notification = db
    .prepare('SELECT id FROM notifications WHERE id = ? AND user_id = ?')
    .get(id, req.user.id);

  if (!notification) {
    return res.status(404).json({ message: 'Повідомлення не знайдено' });
  }

  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);

  const updatedNotification = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
  return res.json(updatedNotification);
}

module.exports = {
  getNotifications,
  markAsRead
};
