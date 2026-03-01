// pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, logout } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data))
      .catch(() => {
        // Token inválido o expirado → mandamos al login
        localStorage.removeItem('token');
        localStorage.removeItem('nickname');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch (e) {
      alert(e.message);
      return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('nickname');
    navigate('/');
  }

  if (loading) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title mb-4">👤 Mi perfil</h3>

            <ul className="list-group list-group-flush mb-4">
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Nickname</span>
                <strong>{profile.nickname}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Puntos acumulados</span>
                <strong>{profile.total_points} pts</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Partidas jugadas</span>
                <strong>{profile.total_games}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Miembro desde</span>
                <strong>{new Date(profile.created_at).toLocaleDateString('es-ES')}</strong>
              </li>
            </ul>

            <div className="d-grid gap-2">
              <Link to="/game" className="btn btn-success btn-lg">
                🎮 Jugar
              </Link>
              <Link to="/change-password" className="btn btn-outline-secondary">
                🔑 Cambiar contraseña
              </Link>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
