import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, saveAuth } from '../api/api.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');

    try {
      const data = await apiRequest('/auth/login', {
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
      <h1>Вхід</h1>
      <form className="form" onSubmit={submit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={change} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Увійти</button>
      </form>
    </section>
  );
}
