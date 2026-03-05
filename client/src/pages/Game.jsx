// pages/Game.jsx
// El tablero 10x10 del juego. Cada celda es clickable.
// Azul = agua (miss), Rojo = tocado (hit), Gris = no disparado aún.

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame, shoot, abandonGame, getGameState } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useSounds } from '../hooks/useSounds';

const BOARD_SIZE = 10;

// Construye una matriz 10x10 vacía
function emptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill('empty')
  );
}

export default function Game() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { playWater, playHit, playVictory, playDisappointment } = useSounds();
  const [board, setBoard] = useState(emptyBoard());
  const [gameId, setGameId] = useState(null);
  const [totalShots, setTotalShots] = useState(0);
  const [maxShots, setMaxShots] = useState(60);
  const [difficulty, setDifficulty] = useState(null);
  const [shipsSunk, setShipsSunk] = useState(0);
  const [totalShips] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [shooting, setShooting] = useState(false);
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);

  // Al montar: si hay partida activa la recuperamos, si no mostramos selector de dificultad
  useEffect(() => {
    async function init() {
      try {
        const state = await getGameState();
        if (state.active_game) {
          // Recuperar partida existente
          setGameId(state.game_id);
          setTotalShots(state.total_shots);
          setMaxShots(state.max_shots || 60);
          setDifficulty(state.difficulty || 'classic');
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
          setShowDifficultySelect(false);
        } else {
          // No hay partida activa, mostrar selector de dificultad
          setShowDifficultySelect(true);
          setMessage('Selecciona el nivel de dificultad para empezar');
        }
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function handleStartWithDifficulty(selectedDifficulty) {
    try {
      const data = await startGame(selectedDifficulty);
      setGameId(data.game_id);
      setDifficulty(selectedDifficulty);
      setMaxShots(data.max_shots);
      setShowDifficultySelect(false);
      setMessage('¡Partida iniciada! Haz clic en una celda para disparar.');
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleShoot(row, col) {
    if (shooting || gameOver || gameLost || board[row][col] !== 'empty') return;

    setShooting(true);
    try {
      const data = await shoot(row, col);

      // Actualizar el tablero
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = data.result === 'hit' ? 'hit' : 'miss';
      setBoard(newBoard);
      setTotalShots(data.total_shots);
      setMessage(data.message);

      // Play sound effects
      if (data.result === 'hit') {
        playHit();
      } else {
        playWater();
      }

      if (data.sunk_ship) {
        setShipsSunk(prev => prev + 1);
      }

      if (data.game_over) {
        if (data.status === 'won') {
          setGameOver(true);
          setPoints(data.points);
          // Play victory sound after a short delay
          setTimeout(() => playVictory(), 300);
        } else if (data.status === 'lost') {
          setGameLost(true);
          // Play disappointment sound after a short delay
          setTimeout(() => playDisappointment(), 300);
        }
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
      case 'hit':  return { backgroundColor: colors.hit, cursor: 'default' }; // rojo
      case 'miss': return { backgroundColor: colors.water, cursor: 'default' }; // azul
      default:     return { backgroundColor: colors.empty, cursor: 'pointer' }; // gris
    }
  }

  if (loading) return <p className="text-center mt-5">Cargando partida...</p>;

  // Si hay que seleccionar dificultad, mostrar pantalla de selección
  if (showDifficultySelect) {
    return (
      <div className="text-center py-5">
        <h2 className="mb-4">🎯 Elige tu Dificultad</h2>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <div className="card" style={{ width: '200px', cursor: 'pointer', backgroundColor: colors.bg, color: colors.text, border: `2px solid ${colors.primary}` }} onClick={() => handleStartWithDifficulty('easy')}>
            <div className="card-body text-center">
              <h5 className="card-title">😊 Fácil</h5>
              <p className="card-text">100 disparos</p>
              <small style={{ color: colors.text }}>Perfecto para principiantes</small>
            </div>
          </div>
          <div className="card" style={{ width: '200px', cursor: 'pointer', backgroundColor: colors.bg, color: colors.text, border: `2px solid ${colors.primary}` }} onClick={() => handleStartWithDifficulty('classic')}>
            <div className="card-body text-center">
              <h5 className="card-title">🎮 Clásico</h5>
              <p className="card-text">60 disparos</p>
              <small style={{ color: colors.text }}>El balance perfecto</small>
            </div>
          </div>
          <div className="card" style={{ width: '200px', cursor: 'pointer', backgroundColor: colors.bg, color: colors.text, border: `2px solid ${colors.primary}` }} onClick={() => handleStartWithDifficulty('tactical')}>
            <div className="card-body text-center">
              <h5 className="card-title">🎯 Táctico</h5>
              <p className="card-text">30 disparos</p>
              <small style={{ color: colors.text }}>Solo para expertos</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="mb-1">🎯 Battleship</h2>

      {/* Difficulty badge and stats */}
      <div className="d-flex justify-content-center gap-4 mb-3 flex-wrap align-items-center">
        {difficulty && (
          <span className="badge bg-primary fs-6">
            {difficulty === 'easy' ? '😊 Fácil' : difficulty === 'tactical' ? '🎯 Táctico' : '🎮 Clásico'}
          </span>
        )}
        <span className="badge bg-secondary fs-6">Golpes: {totalShots}/{maxShots}</span>
        <span className={`badge ${totalShots > maxShots * 0.8 ? 'bg-warning' : 'bg-info'} fs-6`}>Restante: {Math.max(0, maxShots - totalShots)}</span>
        <span className="badge bg-danger fs-6">Barcos: {shipsSunk}/{totalShips}</span>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`alert ${gameOver ? 'alert-success' : gameLost ? 'alert-danger' : 'alert-info'} d-inline-block mb-3`}>
          {message}
          {gameOver && <div className="fs-5 fw-bold mt-1">🏆 Puntuación: {points} pts</div>}
          {gameLost && <div className="fs-5 fw-bold mt-1">❌ Excediste el límite de {maxShots} disparos</div>}
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
      <div className="d-flex justify-content-center gap-4 mb-4 small" style={{ color: colors.text }}>
        <span><span style={{ display:'inline-block', width:14, height:14, backgroundColor:colors.empty, border:'1px solid #aaa', borderRadius:2, marginRight:4 }}/>Sin tocar</span>
        <span><span style={{ display:'inline-block', width:14, height:14, backgroundColor:colors.hit, borderRadius:2, marginRight:4 }}/>Tocado</span>
        <span><span style={{ display:'inline-block', width:14, height:14, backgroundColor:colors.water, borderRadius:2, marginRight:4 }}/>Agua</span>
      </div>

      {/* Botones */}
      {gameOver || gameLost ? (
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button className={`btn btn-${gameOver ? 'success' : 'danger'}`} onClick={() => window.location.reload()}>
            🔄 {gameOver ? 'Jugar otra partida' : 'Intentar de nuevo'}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
            Volver al dashboard
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
