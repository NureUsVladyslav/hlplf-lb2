import { Link } from 'react-router-dom';

export default function VideoCard({ video, extra }) {
  return (
    <article className="card">
      <h3>{video.title}</h3>
      <p>{video.description || 'Опис відсутній'}</p>
      <p className="muted">Автор: {video.author}</p>
      {extra && <p className="muted">{extra}</p>}
      <Link className="button-link" to={`/videos/${video.id}`}>Переглянути</Link>
    </article>
  );
}
