import { useEffect, useState } from 'react';
import { apiRequest, getCurrentUser } from '../api/api.js';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  function loadUsers() {
    apiRequest('/users')
      .then(setUsers)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(id, role) {
    setError('');

    try {
      const updated = await apiRequest(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role })
      });

      setUsers((items) => items.map((user) => (user.id === id ? updated : user)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteUser(id) {
    setError('');

    try {
      await apiRequest(`/users/${id}`, {
        method: 'DELETE'
      });

      setUsers((items) => items.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h1>Керування користувачами</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="table-actions">
                <select
                  value={user.role}
                  onChange={(event) => changeRole(user.id, event.target.value)}
                  disabled={user.id === currentUser?.id}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button disabled={user.id === currentUser?.id} onClick={() => deleteUser(user.id)}>
                  Видалити користувача
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
