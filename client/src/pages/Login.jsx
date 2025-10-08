import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingPlayer, setHasExistingPlayer] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    const player = localStorage.getItem('player');
    if (token && player) {
      setHasExistingPlayer(true);
    }
  }, []);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 8) return 'weak';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (formData.name.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (isRegister) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      
      if (!/[A-Z]/.test(formData.password)) {
        setError('Password must contain at least one uppercase letter');
        return false;
      }
      
      if (!/[a-z]/.test(formData.password)) {
        setError('Password must contain at least one lowercase letter');
        return false;
      }
      
      if (!/[0-9]/.test(formData.password)) {
        setError('Password must contain at least one number');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    try {
      const payload = {
        name: formData.name,
        password: formData.password
      };
      
      if (isRegister && formData.email) {
        payload.email = formData.email;
      }
      
      const response = await api.post(endpoint, payload);
      
      // Store tokens and player data
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('player', JSON.stringify(response.data.player));
      
      // Configure axios to use token for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      
      navigate('/home');
    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error.response) {
        setError(error.response.data.error || 'Authentication failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueGame = () => {
    navigate('/select-game');
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setPasswordStrength('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="bg-elements">
        <div className="floating-token token-blue"></div>
        <div className="floating-token token-red"></div>
        <div className="floating-token token-green"></div>
        <div className="floating-token token-yellow"></div>
        <div className="dice-bg dice-1"></div>
        <div className="dice-bg dice-2"></div>
      </div>

      <div className="login-card">
        {/* Epic Title */}
        <div className="title-section">
          <div className="dice-icon">🎲</div>
          <h1 className="login-title">
            <span className="title-word blue">L</span>
            <span className="title-word red">U</span>
            <span className="title-word green">D</span>
            <span className="title-word yellow">O</span>
          </h1>
          <p className="subtitle">
            {isRegister ? 'Join the game!' : 'Roll the dice, make your move!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-wrapper">
            <label htmlFor="name" className="input-label">
              Username:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              autoFocus
              placeholder="Enter your username"
              className="player-input"
            />
          </div>

          {isRegister && (
            <div className="input-wrapper">
              <label htmlFor="email" className="input-label">
                Email (Optional):
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="player-input"
              />
            </div>
          )}

          <div className="input-wrapper">
            <label htmlFor="password" className="input-label">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              className="player-input"
            />
            {isRegister && passwordStrength && (
              <div className={`password-strength ${passwordStrength}`}>
                Password strength: <strong>{passwordStrength}</strong>
              </div>
            )}
          </div>

          {isRegister && (
            <div className="input-wrapper">
              <label htmlFor="confirmPassword" className="input-label">
                Confirm Password:
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
                className="player-input"
              />
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            <span className="btn-content">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span className="btn-icon">🎮</span>
                  {isRegister ? 'Create Account' : 'Login'}
                </>
              )}
            </span>
          </button>

          <div className="toggle-mode">
            <button type="button" onClick={toggleMode} className="toggle-btn">
              {isRegister 
                ? 'Already have an account? Login' 
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>

        {hasExistingPlayer && !isRegister && (
          <div className="continue-section">
            <div className="divider">
              <span className="divider-text">OR</span>
            </div>
            <p className="session-text">
              <span className="pulse-dot"></span>
              Found existing player session
            </p>
            <button className="continue-btn" onClick={handleContinueGame}>
              <span className="btn-content">
                <span className="btn-icon">▶️</span>
                Continue Game
              </span>
            </button>
          </div>
        )}

        {/* Decorative Game Pieces */}
        <div className="corner-pieces">
          <div className="corner-piece top-left"></div>
          <div className="corner-piece top-right"></div>
          <div className="corner-piece bottom-left"></div>
          <div className="corner-piece bottom-right"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;