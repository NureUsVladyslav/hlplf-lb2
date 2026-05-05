import { Link, useNavigate } from 'react-router-dom';
import { clearAuth, getCurrentUser, getToken } from '../api/api.js';

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getCurrentUser();

  function logout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link className="logo" to="/">Video Hosting</Link>

      <nav>
        <Link to="/">Відео</Link>
        {token && <Link to="/upload">Завантажити</Link>}
        {token && <Link to="/shared">Надіслані мені</Link>}
        {token && <Link to="/notifications">Повідомлення</Link>}
        {user?.role === 'ADMIN' && <Link to="/admin/users">Користувачі</Link>}
      </nav>

      <div className="auth-block">
        {token ? (
          <>
            <span>{user?.username} ({user?.role})</span>
            <button onClick={logout}>Вийти</button>
          </>
        ) : (
          <>
            <Link to="/login">Вхід</Link>
            <Link to="/register">Реєстрація</Link>
          </>
        )}
      </div>
    </header>
  );
}
