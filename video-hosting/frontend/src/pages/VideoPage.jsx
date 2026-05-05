import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest, getCurrentUser, getToken, SERVER_URL } from '../api/api.js';
import CommentForm from '../components/CommentForm.jsx';
import CommentList from '../components/CommentList.jsx';
import ShareModal from '../components/ShareModal.jsx';

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    apiRequest(`/videos/${id}`)
      .then(setVideo)
      .catch((err) => setError(err.message));

    apiRequest(`/videos/${id}/comments?page=1&limit=20`)
      .then((result) => setComments(result.data))
      .catch((err) => setError(err.message));
  }, [id]);

  async function subscribe() {
    setMessage('');

    try {
      await apiRequest(`/subscriptions/users/${video.user_id}/subscribe`, {
        method: 'POST'
      });
      setMessage('Підписку оформлено');
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!video) {
    return <p>Завантаження...</p>;
  }

  return (
    <section className="video-page">
      <h1>{video.title}</h1>

      <video className="video-player" controls src={`${SERVER_URL}/api/videos/${video.id}/stream`} />

      <div className="panel">
        <p>{video.description || 'Опис відсутній'}</p>
        <p className="muted">Автор: {video.author}</p>
        <p className="muted">Дата: {new Date(video.created_at).toLocaleString()}</p>

        {getToken() && user?.id !== video.user_id && (
          <button onClick={subscribe}>Підписатися на автора</button>
        )}

        {message && <p className="muted">{message}</p>}
      </div>

      {getToken() && (
        <section className="panel">
          <h2>Поділитися відео</h2>
          <ShareModal videoId={video.id} />
        </section>
      )}

      <section className="panel">
        <h2>Коментарі</h2>
        <CommentForm videoId={video.id} onCreated={(comment) => setComments([comment, ...comments])} />
        <CommentList comments={comments} />
      </section>
    </section>
  );
}
