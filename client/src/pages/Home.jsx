// pages/Home.jsx
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Home() {
  const { colors } = useTheme();

  return (
    <div className="text-center mt-5">
      <h1 className="display-4 fw-bold" style={{ color: colors.text }}>🚢 Battleship Game</h1>
      <p className="lead mt-3" style={{ color: colors.text }}>
        Encuentra los barcos perdidos antes de que sea demasiado tarde.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/register" className="btn btn-lg" style={{ backgroundColor: colors.primary, color: '#fff', border: 'none' }}>
          Crear cuenta
        </Link>
        <Link to="/login" className="btn btn-lg" style={{ color: colors.primary, borderColor: colors.primary }}>
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
