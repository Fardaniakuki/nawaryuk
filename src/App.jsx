import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BerandaPage from './pages/BerandaPage';
import BarangPage from './pages/BarangPage';
import LelangPage from './pages/LelangPage';
import PembayaranPage from './pages/PembayaranPage';
import LaporanPage from './pages/LaporanPage';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/beranda" replace />;
    if (user.role === 'petugas') return <Navigate to="/barangs" replace />;
    return <Navigate to="/lelangs" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/beranda" element={<ProtectedRoute roles={['admin']}><BerandaPage /></ProtectedRoute>} />
            <Route path="/barangs" element={<ProtectedRoute roles={['admin', 'petugas']}><BarangPage /></ProtectedRoute>} />
            <Route path="/lelangs" element={<ProtectedRoute roles={['admin', 'masyarakat']}><LelangPage /></ProtectedRoute>} />
            <Route path="/penawarans" element={<ProtectedRoute roles={['admin']}><LelangPage /></ProtectedRoute>} />
            <Route path="/pembayarans" element={<ProtectedRoute roles={['admin', 'petugas', 'masyarakat']}><PembayaranPage /></ProtectedRoute>} />
            <Route path="/laporans" element={<ProtectedRoute roles={['admin', 'petugas']}><LaporanPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
