import { useEffect, useState } from 'react';
import { apiRequest } from '../api/api.js';
import VideoCard from '../components/VideoCard.jsx';

export default function VideoListPage() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const limit = 10;

  useEffect(() => {
    apiRequest(`/videos?page=${page}&limit=${limit}`)
      .then((result) => {
        setVideos(result.data);
        setTotal(result.total);
      })
      .catch((err) => setError(err.message));
  }, [page]);

  const pagesCount = Math.max(Math.ceil(total / limit), 1);

  return (
    <section>
      <h1>Відео</h1>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {!videos.length && <p className="muted">Відео поки немає.</p>}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Назад</button>
        <span>Сторінка {page} з {pagesCount}</span>
        <button disabled={page >= pagesCount} onClick={() => setPage(page + 1)}>Далі</button>
      </div>
    </section>
  );
}
