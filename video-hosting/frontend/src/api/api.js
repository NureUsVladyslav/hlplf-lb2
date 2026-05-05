const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('token');
}

export function getCurrentUser() {
  const rawUser = localStorage.getItem('user');
  return rawUser ? JSON.parse(rawUser) : null;
}

export function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(data.message || 'Помилка запиту');
  }

  return data;
}

export { API_URL, SERVER_URL };
