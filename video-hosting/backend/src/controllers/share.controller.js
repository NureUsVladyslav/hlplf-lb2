const db = require('../db/database');

function shareVideo(req, res) {
  const { videoId } = req.params;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ message: 'receiverId обов’язковий' });
  }

  if (Number(receiverId) === req.user.id) {
    return res.status(400).json({ message: 'Не можна надіслати відео самому собі' });
  }

  const video = db.prepare('SELECT id, title FROM videos WHERE id = ?').get(videoId);
  if (!video) {
    return res.status(404).json({ message: 'Відео не знайдено' });
  }

  const receiver = db.prepare('SELECT id FROM users WHERE id = ?').get(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: 'Отримувача не знайдено' });
  }

  const duplicate = db
    .prepare('SELECT id FROM shares WHERE video_id = ? AND sender_id = ? AND receiver_id = ?')
    .get(videoId, req.user.id, receiverId);

  if (duplicate) {
    return res.status(409).json({ message: 'Це відео вже було надіслано цьому користувачу' });
  }

  const result = db
    .prepare('INSERT INTO shares (video_id, sender_id, receiver_id) VALUES (?, ?, ?)')
    .run(videoId, req.user.id, receiverId);

  db.prepare('INSERT INTO notifications (user_id, video_id, message) VALUES (?, ?, ?)').run(
    receiverId,
    videoId,
    `${req.user.username} поділився з вами відео: ${video.title}`
  );

  const share = db.prepare('SELECT * FROM shares WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(share);
}

function getSharedVideos(req, res) {
  const shared = db
    .prepare(`
      SELECT
        shares.id AS share_id,
        shares.created_at AS shared_at,
        videos.id,
        videos.title,
        videos.description,
        videos.filename,
        videos.mime_type,
        videos.size,
        videos.user_id,
        videos.created_at,
        sender.username AS sender_name,
        author.username AS author
      FROM shares
      JOIN videos ON videos.id = shares.video_id
      JOIN users sender ON sender.id = shares.sender_id
      JOIN users author ON author.id = videos.user_id
      WHERE shares.receiver_id = ?
      ORDER BY shares.created_at DESC
    `)
    .all(req.user.id);

  return res.json(shared);
}

module.exports = {
  shareVideo,
  getSharedVideos
};
