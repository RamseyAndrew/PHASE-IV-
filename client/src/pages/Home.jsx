import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await api.delete(`/players/${playerId}`);
        setPlayers(players.filter(player => player.id !== playerId));
      } catch (error) {
        console.error('Error deleting player:', error);
        alert('Failed to delete player');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, gamesRes] = await Promise.all([
          api.get('/players'),
          api.get('/games')
        ]);
        setPlayers(playersRes.data);
        setGames(gamesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home">
      <h1>Ludo Game</h1>

      <div className="section">
        <h2>Players ({players.length})</h2>
        <Link to="/login">Create New Player</Link>
        <div className="players-list">
          {players.map(player => (
            <div key={player.id} className="player-card">
              <h3>{player.name}</h3>
              <p>Score: {player.score}</p>
              <button onClick={() => handleDeletePlayer(player.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>Active Games ({games.filter(g => g.status === 'ongoing').length})</h2>
        <Link to="/login">Start New Game</Link>
        <div className="games-list">
          {games.filter(g => g.status === 'ongoing').map(game => (
            <div key={game.id} className="game-card">
              <h3>Game #{game.id}</h3>
              <p>Status: {game.status}</p>
              <Link to={`/game/${game.id}`}>Join Game</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <Link to="/history">View Game History</Link>
      </div>
    </div>
  );
};

export default Home;
