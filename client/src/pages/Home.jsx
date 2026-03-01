// pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4 fw-bold">🚢 Battleship Game</h1>
      <p className="lead text-muted mt-3">
        Encuentra los barcos perdidos antes de que sea demasiado tarde.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/register" className="btn btn-primary btn-lg">
          Crear cuenta
        </Link>
        <Link to="/login" className="btn btn-outline-secondary btn-lg">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
