// pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [form, setForm] = useState({ nickname: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.nickname, form.password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('nickname', data.user.nickname);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
          <div className="card-body p-4">
            <h3 className="card-title mb-4 text-center">Iniciar sesión</h3>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nickname</label>
                <input
                  type="text"
                  className="form-control"
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100"
                style={{ backgroundColor: colors.primary, color: '#fff', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/register" style={{ color: colors.primary }}>Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
