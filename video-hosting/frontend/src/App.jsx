import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VideoListPage from './pages/VideoListPage.jsx';
import VideoPage from './pages/VideoPage.jsx';
import UploadVideoPage from './pages/UploadVideoPage.jsx';
import SharedVideosPage from './pages/SharedVideosPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import { getCurrentUser, getToken } from './api/api.js';

function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const user = getCurrentUser();

  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<VideoListPage />} />
          <Route path="/videos/:id" element={<VideoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadVideoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shared"
            element={
              <ProtectedRoute>
                <SharedVideosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}
