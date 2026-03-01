// pages/ChangePassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/api';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.password_confirmation) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await changePassword(form.current_password, form.password, form.password_confirmation);
      setSuccess('Contraseña cambiada correctamente. Volviendo al dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title mb-4 text-center">🔑 Cambiar contraseña</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Contraseña actual</label>
                <input
                  type="password"
                  className="form-control"
                  name="current_password"
                  value={form.current_password}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Cambiando...' : 'Cambiar contraseña'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
