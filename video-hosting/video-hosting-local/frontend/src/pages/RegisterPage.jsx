import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, saveAuth } from '../api/api.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      saveAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel small-panel">
      <h1>Реєстрація</h1>
      <p className="muted">Перший зареєстрований користувач автоматично отримує роль ADMIN.</p>
      <form className="form" onSubmit={submit}>
        <input name="username" placeholder="Ім’я користувача" value={form.username} onChange={change} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={change} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Зареєструватися</button>
      </form>
    </section>
  );
}
