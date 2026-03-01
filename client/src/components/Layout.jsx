// components/Layout.jsx
// Navbar superior que aparece en todas las páginas.
// Muestra opciones distintas según si hay sesión abierta o no.

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/api';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
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
      <nav className="navbar navbar-dark bg-dark px-4">
        <Link className="navbar-brand fw-bold" to={token ? '/dashboard' : '/'}>
          🚢 BATTLESHIP GAME
        </Link>

        <div className="d-flex gap-3 align-items-center">
          <Link className="btn btn-outline-light btn-sm" to="/ranking">
            🏆 Ranking
          </Link>

          {token ? (
            <>
              <Link className="btn btn-outline-info btn-sm" to="/dashboard">
                👤 {nickname}
              </Link>
              {!inGame && (
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              )}
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/login">
                Login
              </Link>
              <Link className="btn btn-light btn-sm" to="/register">
                Registro
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="container py-4">
        {children}
      </main>
    </>
  );
}
