const db = require('../db/database');

function subscribe(req, res) {
  const channelOwnerId = Number(req.params.id);

  if (channelOwnerId === req.user.id) {
    return res.status(400).json({ message: 'Не можна підписатися на самого себе' });
  }

  const owner = db.prepare('SELECT id, username FROM users WHERE id = ?').get(channelOwnerId);
  if (!owner) {
    return res.status(404).json({ message: 'Користувача не знайдено' });
  }

  const existing = db
    .prepare('SELECT id FROM subscriptions WHERE subscriber_id = ? AND channel_owner_id = ?')
    .get(req.user.id, channelOwnerId);

  if (existing) {
    return res.status(409).json({ message: 'Ви вже підписані на цього користувача' });
  }

  const result = db
    .prepare('INSERT INTO subscriptions (subscriber_id, channel_owner_id) VALUES (?, ?)')
    .run(req.user.id, channelOwnerId);

  const subscription = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(subscription);
}

function unsubscribe(req, res) {
  const channelOwnerId = Number(req.params.id);

  db
    .prepare('DELETE FROM subscriptions WHERE subscriber_id = ? AND channel_owner_id = ?')
    .run(req.user.id, channelOwnerId);

  return res.json({ message: 'Підписку скасовано' });
}

function getSubscriptions(req, res) {
  const subscriptions = db
    .prepare(`
      SELECT
        subscriptions.id,
        subscriptions.channel_owner_id,
        subscriptions.created_at,
        users.username AS channel_owner
      FROM subscriptions
      JOIN users ON users.id = subscriptions.channel_owner_id
      WHERE subscriptions.subscriber_id = ?
      ORDER BY subscriptions.created_at DESC
    `)
    .all(req.user.id);

  return res.json(subscriptions);
}

module.exports = {
  subscribe,
  unsubscribe,
  getSubscriptions
};
