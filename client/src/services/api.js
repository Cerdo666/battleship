// services/api.js
// Todas las llamadas al backend centralizadas aquí.
// El token se guarda en localStorage y se añade automáticamente a las peticiones privadas.

const BASE_URL = 'http://127.0.0.1:8000/api';

// Helper interno: hace fetch con headers correctos
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    // Lanzamos el mensaje de error que manda el back
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
}

// ── AUTH ──────────────────────────────────────────────
export const register = (nickname, password, password_confirmation) =>
  request('/register', {
    method: 'POST',
    body: JSON.stringify({ nickname, password, password_confirmation }),
  });

export const login = (nickname, password) =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify({ nickname, password }),
  });

export const logout = () =>
  request('/logout', { method: 'POST' });

export const getProfile = () =>
  request('/profile');

export const changePassword = (current_password, password, password_confirmation) =>
  request('/change-password', {
    method: 'PUT',
    body: JSON.stringify({ current_password, password, password_confirmation }),
  });

// ── RANKING ───────────────────────────────────────────
export const getRanking = () =>
  request('/ranking');

// ── GAME ──────────────────────────────────────────────
export const startGame = () =>
  request('/game/start', { method: 'POST' });

export const shoot = (row, col) =>
  request('/game/shoot', {
    method: 'POST',
    body: JSON.stringify({ row, col }),
  });

export const abandonGame = () =>
  request('/game/abandon', { method: 'DELETE' });

export const getGameState = () =>
  request('/game/state');
