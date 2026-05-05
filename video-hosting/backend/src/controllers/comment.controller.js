const db = require('../db/database');

function getComments(req, res) {
  const { videoId } = req.params;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);
  const offset = (page - 1) * limit;

  const video = db.prepare('SELECT id FROM videos WHERE id = ?').get(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Відео не знайдено' });
  }

  const comments = db
    .prepare(`
      SELECT 
        comments.id,
        comments.text,
        comments.video_id,
        comments.user_id,
        comments.created_at,
        users.username AS author
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.video_id = ?
      ORDER BY comments.created_at DESC
      LIMIT ? OFFSET ?
    `)
    .all(videoId, limit, offset);

  const total = db.prepare('SELECT COUNT(*) AS count FROM comments WHERE video_id = ?').get(videoId).count;

  return res.json({ page, limit, total, data: comments });
}

function createComment(req, res) {
  const { videoId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Текст коментаря обов’язковий' });
  }

  const video = db.prepare('SELECT id FROM videos WHERE id = ?').get(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Відео не знайдено' });
  }

  const result = db
    .prepare('INSERT INTO comments (text, video_id, user_id) VALUES (?, ?, ?)')
    .run(text.trim(), videoId, req.user.id);

  const comment = db
    .prepare(`
      SELECT 
        comments.id,
        comments.text,
        comments.video_id,
        comments.user_id,
        comments.created_at,
        users.username AS author
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.id = ?
    `)
    .get(result.lastInsertRowid);

  return res.status(201).json(comment);
}

module.exports = {
  getComments,
  createComment
};
