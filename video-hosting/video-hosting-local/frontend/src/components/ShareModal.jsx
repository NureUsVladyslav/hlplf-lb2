import { useEffect, useState } from 'react';
import { apiRequest, getCurrentUser } from '../api/api.js';

export default function ShareModal({ videoId }) {
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const currentUser = getCurrentUser();

  useEffect(() => {
    apiRequest('/users')
      .then((items) => setUsers(items.filter((user) => user.id !== currentUser?.id)))
      .catch((err) => setMessage(err.message));
  }, []);

  async function share() {
    setMessage('');

    try {
      await apiRequest(`/videos/${videoId}/share`, {
        method: 'POST',
        body: JSON.stringify({ receiverId: Number(receiverId) })
      });
      setMessage('Відео надіслано користувачу');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="share-box">
      <select value={receiverId} onChange={(event) => setReceiverId(event.target.value)}>
        <option value="">Оберіть користувача</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>{user.username} — {user.email}</option>
        ))}
      </select>
      <button onClick={share} disabled={!receiverId}>Поділитися відео</button>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}
