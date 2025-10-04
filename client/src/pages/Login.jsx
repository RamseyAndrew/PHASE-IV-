import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      navigate('/game');
    } catch {
      setError('Failed to create player');
    }
  };

  return (
    <div className="login">
      <h1>Login / Create Player</h1>
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
    </div>
  );
};

export default Login;
