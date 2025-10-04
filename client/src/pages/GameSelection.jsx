import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const GameSelection = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data);
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleSelectGame = (gameId) => {
    // Store selected game ID and navigate to game
    localStorage.setItem('selectedGameId', gameId);
    navigate('/game');
  };

  const handleNewGame = () => {
    // Clear any selected game and start fresh
    localStorage.removeItem('selectedGameId');
    navigate('/game');
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game? This will remove all move history.')) {
      try {
        await api.delete(`/games/${gameId}`);
        // Remove the deleted game from the list
        setGames(games.filter(game => game.id !== gameId));
        console.log('Game deleted successfully');
      } catch (error) {
        console.error('Failed to delete game:', error);
        alert('Failed to delete game');
      }
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading games...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Select a Game to Continue</h1>
      
      <button 
        onClick={handleNewGame}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        Start New Game
      </button>

      {games.length === 0 ? (
        <p>No games found. Start a new game!</p>
      ) : (
        <div>
          <h2>Previous Games:</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {games.map((game) => (
              <div 
                key={game.id}
                style={{
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleSelectGame(game.id)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e9e9e9';
                  e.target.style.borderColor = '#007bff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f9f9f9';
                  e.target.style.borderColor = '#ddd';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>Game #{game.id}</h3>
                    <p style={{ margin: '0', color: '#666' }}>
                      Status: <span style={{ 
                        color: game.status === 'ongoing' ? '#28a745' : '#6c757d',
                        fontWeight: 'bold'
                      }}>
                        {game.status}
                      </span>
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#888' }}>
                      Created: {new Date(game.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectGame(game.id);
                      }}
                    >
                      Continue
                    </button>
                    <button
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGame(game.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSelection;