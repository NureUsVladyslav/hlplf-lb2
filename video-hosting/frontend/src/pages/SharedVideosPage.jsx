import { useEffect, useState } from 'react';
import { apiRequest } from '../api/api.js';
import VideoCard from '../components/VideoCard.jsx';

export default function SharedVideosPage() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/shared')
      .then(setVideos)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section>
      <h1>Відео, якими поділилися зі мною</h1>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {videos.map((video) => (
          <VideoCard
            key={video.share_id}
            video={video}
            extra={`Надіслав: ${video.sender_name}`}
          />
        ))}
      </div>
      {!videos.length && <p className="muted">Поки немає надісланих відео.</p>}
    </section>
  );
}
