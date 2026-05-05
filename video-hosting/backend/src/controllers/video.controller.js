const fs = require('fs');
const path = require('path');
const db = require('../db/database');

function getVideos(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 30);
  const offset = (page - 1) * limit;

  const videos = db
    .prepare(`
      SELECT 
        videos.id,
        videos.title,
        videos.description,
        videos.filename,
        videos.mime_type,
        videos.size,
        videos.user_id,
        videos.created_at,
        users.username AS author
      FROM videos
      JOIN users ON users.id = videos.user_id
      ORDER BY videos.created_at DESC
      LIMIT ? OFFSET ?
    `)
    .all(limit, offset);

  const total = db.prepare('SELECT COUNT(*) AS count FROM videos').get().count;

  return res.json({
    page,
    limit,
    total,
    data: videos
  });
}

function getVideoById(req, res) {
  const { id } = req.params;

  const video = db
    .prepare(`
      SELECT 
        videos.id,
        videos.title,
        videos.description,
        videos.filename,
        videos.mime_type,
        videos.size,
        videos.user_id,
        videos.created_at,
        users.username AS author
      FROM videos
      JOIN users ON users.id = videos.user_id
      WHERE videos.id = ?
    `)
    .get(id);

  if (!video) {
    return res.status(404).json({ message: 'Відео не знайдено' });
  }

  return res.json(video);
}

function uploadVideo(req, res) {
  const { title, description } = req.body;

  if (!title || !req.file) {
    return res.status(400).json({ message: 'title і video обов’язкові' });
  }

  const relativePath = path.join('uploads', 'videos', req.file.filename).replaceAll('\\', '/');

  const result = db
    .prepare(`
      INSERT INTO videos (title, description, filename, original_name, mime_type, size, file_path, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      title,
      description || '',
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      relativePath,
      req.user.id
    );

  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(result.lastInsertRowid);

  const subscribers = db
    .prepare('SELECT subscriber_id FROM subscriptions WHERE channel_owner_id = ?')
    .all(req.user.id);

  const insertNotification = db.prepare(`
    INSERT INTO notifications (user_id, video_id, message)
    VALUES (?, ?, ?)
  `);

  const createNotifications = db.transaction((items) => {
    for (const item of items) {
      insertNotification.run(
        item.subscriber_id,
        video.id,
        `${req.user.username} додав нове відео: ${video.title}`
      );
    }
  });

  createNotifications(subscribers);

  return res.status(201).json(video);
}

function streamVideo(req, res) {
  const { id } = req.params;
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(id);

  if (!video) {
    return res.status(404).json({ message: 'Відео не знайдено' });
  }

  const filePath = path.join(__dirname, '..', video.file_path);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Файл відео не знайдено' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': video.mime_type
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  if (start >= fileSize || end >= fileSize) {
    res.status(416).send('Requested range not satisfiable');
    return;
  }

  const stream = fs.createReadStream(filePath, { start, end });

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': video.mime_type
  });

  stream.pipe(res);
}

module.exports = {
  getVideos,
  getVideoById,
  uploadVideo,
  streamVideo
};
