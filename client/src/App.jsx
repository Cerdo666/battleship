// App.jsx
// Define todas las rutas de la app.
// - Rutas protegidas: redirigen a /login si no hay token
// - Rutas de auth: redirigen a /dashboard si ya hay sesión abierta

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Ranking from './pages/Ranking';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';
import Game from './pages/Game';

// Componente guard: solo deja pasar si hay token
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

// Componente guard: si ya hay sesión, redirige al dashboard
function GuestRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/ranking" element={<Ranking />} />

          {/* Privadas */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/game" element={<PrivateRoute><Game /></PrivateRoute>} />

          {/* Cualquier ruta no encontrada → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
