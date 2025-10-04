import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Players API
export const getPlayers = () => api.get('/players');
export const createPlayer = (player) => api.post('/players', player);
export const updatePlayer = (id, player) => api.patch(`/players/${id}`, player);
export const deletePlayer = (id) => api.delete(`/players/${id}`);

// Games API
export const getGames = () => api.get('/games');
export const createGame = (game) => api.post('/games', game);
export const updateGame = (id, game) => api.patch(`/games/${id}`, game);
export const deleteGame = (id) => api.delete(`/games/${id}`);

// Moves API
export const getMovesByGame = (gameId) => api.get(`/games/${gameId}/moves`);
export const createMove = (gameId, move) => api.post(`/games/${gameId}/moves`, move);

export default {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getGames,
  createGame,
  updateGame,
  deleteGame,
  getMovesByGame,
  createMove,
};
