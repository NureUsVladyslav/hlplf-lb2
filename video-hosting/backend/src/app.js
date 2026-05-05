require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

require('./db/database');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const videoRoutes = require('./routes/video.routes');
const shareRoutes = require('./routes/share.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'Video hosting API is working' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/shared', shareRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((error, req, res, next) => {
  if (error.message === 'Можна завантажувати тільки відеофайли') {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Максимальний розмір відео — 100 MB' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Внутрішня помилка сервера' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
