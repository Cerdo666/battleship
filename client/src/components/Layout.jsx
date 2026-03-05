// components/Layout.jsx
// Navbar superior que aparece en todas las páginas.
// Muestra opciones distintas según si hay sesión abierta o no.

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, colors } = useTheme();
  const token = localStorage.getItem('token');
  const nickname = localStorage.getItem('nickname');

  // No mostrar logout si estamos en /game (el jugador debe abandonar primero)
  const inGame = location.pathname === '/game';

  async function handleLogout() {
    try {
      await logout();
    } catch (e) {
      // Si el back dice que hay partida activa, avisamos
      alert(e.message);
      return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    navigate('/');
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg px-4" style={{ backgroundColor: colors.navbar, borderBottom: `1px solid ${colors.border}` }}>
        <Link className="navbar-brand fw-bold" to={token ? '/dashboard' : '/'} style={{ color: colors.text }}>
          🚢 BATTLESHIP GAME
        </Link>

        <div className="d-flex gap-3 align-items-center">
          <Link className="btn btn-sm" to="/ranking" style={{ color: colors.text, borderColor: colors.text }}>
            🏆 Ranking
          </Link>

          <button 
            className="btn btn-sm"
            onClick={toggleTheme}
            style={{ color: colors.text, borderColor: colors.text }}
            title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>

          {token ? (
            <>
              <Link className="btn btn-sm" to="/dashboard" style={{ color: colors.text, borderColor: colors.primary }}>
                👤 {nickname}
              </Link>
              {!inGame && (
                <button className="btn btn-sm" onClick={handleLogout} style={{ color: colors.text, borderColor: '#dc3545' }}>
                  Cerrar sesión
                </button>
              )}
            </>
          ) : (
            <>
              <Link className="btn btn-sm" to="/login" style={{ color: colors.text, borderColor: colors.text }}>
                Login
              </Link>
              <Link className="btn btn-sm" to="/register" style={{ color: colors.text, borderColor: colors.primary, backgroundColor: colors.primary }}>
                Registro
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="container-fluid py-4" style={{ backgroundColor: colors.bg, color: colors.text, minHeight: '100vh' }}>
        {children}
      </main>
    </>
  );
}
