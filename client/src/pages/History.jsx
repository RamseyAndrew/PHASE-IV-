import { useState, useEffect } from 'react';
import api from '../services/api';

const History = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="history">
      <h1>Game History</h1>

      <div className="games-list">
        {games.map(game => (
          <div key={game.id} className="game-item">
            <h3>Game #{game.id}</h3>
            <p>Status: {game.status}</p>
            <p>Created: {new Date(game.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
