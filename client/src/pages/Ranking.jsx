// pages/Ranking.jsx
import { useEffect, useState } from 'react';
import { getRanking } from '../services/api';

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRanking()
      .then(data => setRanking(data.ranking))
      .catch(() => setRanking([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Cargando ranking...</p>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <h2 className="text-center mb-4">🏆 Ranking Global</h2>

        {ranking.length === 0 ? (
          <div className="alert alert-info text-center">
            Aún no hay jugadores en el ranking. ¡Sé el primero!
          </div>
        ) : (
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Puntos</th>
                <th>Partidas</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((player, index) => (
                <tr key={player.id} className={index === 0 ? 'table-warning fw-bold' : ''}>
                  <td>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </td>
                  <td>{player.nickname}</td>
                  <td>{player.total_points} pts</td>
                  <td>{player.total_games}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
