// pages/Game.jsx
// El tablero 10x10 del juego. Cada celda es clickable.
// Verde = agua (miss), Rojo = tocado (hit), Gris = no disparado aún.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame, shoot, abandonGame, getGameState } from '../services/api';

const BOARD_SIZE = 10;

// Construye una matriz 10x10 vacía
function emptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill('empty')
  );
}

export default function Game() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(emptyBoard());
  const [gameId, setGameId] = useState(null);
  const [totalShots, setTotalShots] = useState(0);
  const [shipsSunk, setShipsSunk] = useState(0);
  const [totalShips] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [shooting, setShooting] = useState(false);

  // Al montar: si hay partida activa la recuperamos, si no iniciamos una nueva
  useEffect(() => {
    async function init() {
      try {
        const state = await getGameState();
        if (state.active_game) {
          // Recuperar partida existente
          setGameId(state.game_id);
          setTotalShots(state.total_shots);
          setShipsSunk(state.ships_sunk);
          // Reconstruir el tablero con los disparos ya hechos
          const newBoard = emptyBoard();
          (state.shots || []).forEach(cell => {
            const [r, c] = cell.split(',').map(Number);
            newBoard[r][c] = 'miss';
          });
          (state.hits || []).forEach(cell => {
            const [r, c] = cell.split(',').map(Number);
            newBoard[r][c] = 'hit';
          });
          setBoard(newBoard);
          setMessage('Partida recuperada. ¡Sigue disparando!');
        } else {
          // Iniciar partida nueva
          const data = await startGame();
          setGameId(data.game_id);
          setMessage('¡Partida iniciada! Haz clic en una celda para disparar.');
        }
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function handleShoot(row, col) {
    if (shooting || gameOver || board[row][col] !== 'empty') return;

    setShooting(true);
    try {
      const data = await shoot(row, col);

      // Actualizar el tablero
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = data.result === 'hit' ? 'hit' : 'miss';
      setBoard(newBoard);
      setTotalShots(data.total_shots);
      setMessage(data.message);

      if (data.sunk_ship) {
        setShipsSunk(prev => prev + 1);
      }

      if (data.game_over) {
        setGameOver(true);
        setPoints(data.points);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setShooting(false);
    }
  }

  async function handleAbandon() {
    if (!window.confirm('¿Seguro que quieres abandonar la partida? No puntuará.')) return;
    try {
      await abandonGame();
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.message);
    }
  }

  function cellStyle(state) {
    switch (state) {
      case 'hit':  return { backgroundColor: '#dc3545', cursor: 'default' }; // rojo
      case 'miss': return { backgroundColor: '#198754', cursor: 'default' }; // verde
      default:     return { backgroundColor: '#dee2e6', cursor: 'pointer' }; // gris
    }
  }

  if (loading) return <p className="text-center mt-5">Preparando el tablero...</p>;

  return (
    <div className="text-center">
      <h2 className="mb-1">🎯 Battleship</h2>

      {/* Stats */}
      <div className="d-flex justify-content-center gap-4 mb-3">
        <span className="badge bg-secondary fs-6">Disparos: {totalShots}</span>
        <span className="badge bg-danger fs-6">Barcos: {shipsSunk}/{totalShips}</span>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`alert ${gameOver ? 'alert-success' : 'alert-info'} d-inline-block mb-3`}>
          {message}
          {gameOver && <div className="fs-5 fw-bold mt-1">Puntuación: {points} pts</div>}
        </div>
      )}

      {/* Tablero */}
      <div className="d-flex justify-content-center mb-4">
        <div>
          {/* Cabecera de columnas */}
          <div className="d-flex">
            <div style={{ width: 32 }} />
            {Array.from({ length: BOARD_SIZE }, (_, i) => (
              <div key={i} style={{ width: 36, textAlign: 'center', fontWeight: 'bold', fontSize: 13 }}>
                {i}
              </div>
            ))}
          </div>

          {/* Filas */}
          {board.map((row, r) => (
            <div key={r} className="d-flex align-items-center">
              {/* Número de fila */}
              <div style={{ width: 32, fontWeight: 'bold', fontSize: 13, textAlign: 'right', paddingRight: 4 }}>
                {r}
              </div>
              {row.map((cell, c) => (
                <div
                  key={c}
                  onClick={() => handleShoot(r, c)}
                  style={{
                    width: 36,
                    height: 36,
                    margin: 1,
                    borderRadius: 4,
                    border: '1px solid #aaa',
                    transition: 'background-color 0.2s',
                    ...cellStyle(cell),
                  }}
                  title={`${r},${c}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className="d-flex justify-content-center gap-4 mb-4 text-muted small">
        <span><span style={{ display:'inline-block', width:14, height:14, backgroundColor:'#dee2e6', border:'1px solid #aaa', borderRadius:2, marginRight:4 }}/>Sin disparar</span>
        <span><span style={{ display:'inline-block', width:14, height:14, backgroundColor:'#dc3545', borderRadius:2, marginRight:4 }}/>Tocado</span>
        <span><span style={{ display:'inline-block', width:14, height:14, backgroundColor:'#198754', borderRadius:2, marginRight:4 }}/>Agua</span>
      </div>

      {/* Botones */}
      {gameOver ? (
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success" onClick={() => window.location.reload()}>
            🔄 Jugar otra partida
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
            Volver al inicio
          </button>
        </div>
      ) : (
        <button className="btn btn-outline-danger" onClick={handleAbandon}>
          🚪 Abandonar partida
        </button>
      )}
    </div>
  );
}
