import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [hasExistingPlayer, setHasExistingPlayer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's an existing player in localStorage
    const existingPlayer = localStorage.getItem('player');
    if (existingPlayer) {
      setHasExistingPlayer(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      const response = await api.post('/players', { name });
      const player = response.data;
      // Save player info to localStorage or context for session persistence
      localStorage.setItem('player', JSON.stringify(player));
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      setError('A player with this name may already exist. Please choose a different name.'); // More specific error message
    }
  };

  const handleContinueGame = () => {
    // Route to game selection page to choose from all games
    navigate('/select-game');
  };

  return (
    <div className="login">
      <h1>Create Player</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Player Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Create / Login</button>
      </form>
      
      {hasExistingPlayer && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Found existing player session</p>
          <button 
            onClick={handleContinueGame}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
              width: '300px',
              height: '80px'
            }}
          >
            Select Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
