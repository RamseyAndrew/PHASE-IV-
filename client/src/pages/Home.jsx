import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Added state variables for inline forms
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  const [showGameForm, setShowGameForm] = useState(false);
  const [newGameStatus, setNewGameStatus] = useState('ongoing');

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch {
      // error ignored
    }
  };

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data);
    } catch {
      // error ignored
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPlayers();
      await fetchGames();
      setLoading(false);
    };
    fetchData();
  }, []);

  const deletePlayer = async (id) => {
    try {
      await api.delete(`/players/${id}`);
      await fetchPlayers();
    } catch {
      alert('Failed to delete player');
    }
  };

  const deleteGame = async (id) => {
    try {
      await api.delete(`/games/${id}`);
      await fetchGames();
    } catch {
      alert('Failed to delete game');
    }
  };

  // Added create player function
  const createPlayer = async () => {
    if (!newPlayerName.trim()) {
      alert('Player name cannot be empty');
      return;
    }
    try {
      await api.post('/players', { name: newPlayerName, score: 0 });
      setNewPlayerName('');
      setShowPlayerForm(false);
      await fetchPlayers();
    } catch {
      alert('Failed to create player');
    }
  };

  // Added create game function
  const createGame = async () => {
    if (!newGameStatus.trim()) {
      alert('Game status cannot be empty');
      return;
    }
    try {
      await api.post('/games', { status: newGameStatus });
      setNewGameStatus('ongoing');
      setShowGameForm(false);
      await fetchGames();
    } catch {
      alert('Failed to create game');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Ludo Game</h1>

      <section>
        <h2>Players ({players.length})</h2>
        {!showPlayerForm && (
          <button onClick={() => setShowPlayerForm(true)}>Create New Player</button>
        )}
        {showPlayerForm && (
          <div>
            <input
              type="text"
              placeholder="Player Name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <button onClick={createPlayer}>Add Player</button>
            <button className="cancel" onClick={() => setShowPlayerForm(false)}>Cancel</button>
          </div>
        )}
        <div className="flex-list">
          {players.map((player) => (
            <div key={player.id} className="card">
              <h3>{player.name}</h3>
              <p>Score: {player.score}</p>
              <button onClick={() => deletePlayer(player.id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Active Games ({games.length})</h2>
        {!showGameForm && (
          <button onClick={() => setShowGameForm(true)}>Start New Game</button>
        )}
        {showGameForm && (
          <div>
            <input
              type="text"
              placeholder="Game Status"
              value={newGameStatus}
              onChange={(e) => setNewGameStatus(e.target.value)}
            />
            <button onClick={createGame}>Add Game</button>
            <button className="cancel" onClick={() => setShowGameForm(false)}>Cancel</button>
          </div>
        )}
        <div className="flex-list">
          {games.map((game) => (
            <div key={game.id} className="card">
              <h3>Game #{game.id}</h3>
              <p>Status: {game.status}</p>
              <a href={`/game/${game.id}`}>Join Game</a>
              <br />
              <button onClick={() => deleteGame(game.id)}>Delete Game</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
