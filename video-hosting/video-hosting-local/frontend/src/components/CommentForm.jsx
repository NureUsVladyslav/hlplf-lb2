import { useState } from 'react';
import { apiRequest, getToken } from '../api/api.js';

export default function CommentForm({ videoId, onCreated }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const comment = await apiRequest(`/videos/${videoId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      setText('');
      onCreated(comment);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!getToken()) {
    return <p className="muted">Увійдіть в систему, щоб залишити коментар.</p>;
  }

  return (
    <form className="form" onSubmit={submit}>
      <textarea
        placeholder="Напишіть коментар"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Додати коментар</button>
    </form>
  );
}
