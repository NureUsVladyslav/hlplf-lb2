import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, getToken } from '../api/api.js';

export default function UploadVideoPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', video);

    try {
      const response = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Помилка завантаження');
      }

      navigate(`/videos/${data.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <h1>Завантажити відео</h1>
      <form className="form" onSubmit={submit}>
        <input placeholder="Назва відео" value={title} onChange={(event) => setTitle(event.target.value)} />
        <textarea placeholder="Опис відео" value={description} onChange={(event) => setDescription(event.target.value)} />
        <input type="file" accept="video/*" onChange={(event) => setVideo(event.target.files[0])} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={!title || !video}>Завантажити</button>
      </form>
    </section>
  );
}
