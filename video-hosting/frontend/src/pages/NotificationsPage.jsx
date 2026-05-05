import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/api.js';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/notifications')
      .then(setNotifications)
      .catch((err) => setError(err.message));
  }, []);

  async function markAsRead(id) {
    try {
      const updated = await apiRequest(`/notifications/${id}/read`, {
        method: 'PATCH'
      });

      setNotifications((items) => items.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h1>Повідомлення</h1>
      {error && <p className="error">{error}</p>}
      <div className="list">
        {notifications.map((notification) => (
          <article className="card" key={notification.id}>
            <p>{notification.message}</p>
            <p className="muted">{new Date(notification.created_at).toLocaleString()}</p>
            <p className="muted">Статус: {notification.is_read ? 'прочитано' : 'нове'}</p>
            {notification.video_id && <Link to={`/videos/${notification.video_id}`}>Перейти до відео</Link>}
            {!notification.is_read && (
              <button onClick={() => markAsRead(notification.id)}>Позначити як прочитане</button>
            )}
          </article>
        ))}
      </div>
      {!notifications.length && <p className="muted">Повідомлень немає.</p>}
    </section>
  );
}
