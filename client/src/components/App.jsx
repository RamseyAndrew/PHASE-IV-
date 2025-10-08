/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import "./App.css";
import Board from "./Board";
import TurnManager from "./TurnManager";
import useCaptureLogic from "./TokenCapture";
import api from "../services/api";
import Home from "../pages/Home";
import Login from "../pages/Login";
import History from "../pages/History";
import GameSelection from "../pages/GameSelection";

const players = ["Blue", "Red", "Green", "Yellow"];

function Game() {
  const { gameId: gameIdParam } = useParams();
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRolled, setDiceRolled] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  
  const captureLogic = useCaptureLogic();

  // Initialize game and player on component mount
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Get or create player from localStorage
        let currentPlayerId = null;
        const storedPlayer = localStorage.getItem('player');
        
        if (storedPlayer) {
          const player = JSON.parse(storedPlayer);
          currentPlayerId = player.id;
        } else {
          // Create a default player for testing
          const playerResponse = await api.post('/players', { 
            name: 'Game Player', 
            score: 0 
          });
          currentPlayerId = playerResponse.data.id;
          localStorage.setItem('player', JSON.stringify(playerResponse.data));
        }
        
        setPlayerId(currentPlayerId);

        // Use game ID from URL parameter if available
        if (gameIdParam) {
          setGameId(parseInt(gameIdParam));
          console.log('Using game from URL:', gameIdParam);
        } else {
          // Check if there's a selected game, otherwise create new one
          const selectedGameId = localStorage.getItem('selectedGameId');
          let gameResponse;
          if (selectedGameId) {
            setGameId(parseInt(selectedGameId));
            console.log('Using selected game:', selectedGameId);
          } else {
            // Create a new game
            gameResponse = await api.post('/games', { status: 'ongoing' });
            setGameId(gameResponse.data.id);
          }
        }
        
        // eslint-disable-next-line no-undef
        const finalGameId = gameIdParam || localStorage.getItem('selectedGameId') || gameResponse?.data?.id;
        console.log('Game initialized:', {
          gameId: finalGameId,
          playerId: currentPlayerId
        });
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();
  }, [gameIdParam]);
  
  const { 
    moveToken = () => {}, 
    positions = {}, 
    selectToken = () => {}, 
    selectedToken = null, 
    getTokenPosition = () => ({ row: 0, col: 0 }),
    victories = {}
  } = captureLogic || {};

  const rollDice = () => {
    if (rolling || diceRolled) return;
    
    setRolling(true);
    const newValue = Math.floor(Math.random() * 6 + 1);
    
    setTimeout(() => {
      setDiceValue(newValue);
      setRolling(false);
      setDiceRolled(true);
    }, 1000);
  };

  const handleTokenMove = async () => {
    if (!selectedToken || !diceRolled) return;
    
    console.log('handleTokenMove called:', { selectedToken, diceValue, gameId, playerId });
    
    const currentPlayer = players[currentPlayerIndex];
    
    // Move the token first
    moveToken(currentPlayer, diceValue);
    
    // Track the move immediately after
    if (gameId && playerId && selectedToken) {
      try {
        const position = getTokenPosition(selectedToken.player, selectedToken.index);
        const moveData = {
          dice_roll: diceValue,
          piece_id: selectedToken.index + 1,
          position: position.col + position.row * 15, // Calculate position based on row and col
          player_id: playerId,
          game_id: gameId
        };
        
        console.log('Sending move data:', moveData);
        
        const response = await api.post('/moves', moveData);
        
        console.log('Move tracked successfully:', response.data);

        // Fetch updated moves list after successful move creation
        const movesResponse = await api.get(`/games/${gameId}/moves`);
        console.log('Updated moves list:', movesResponse.data);
        // You can update state here if you want to display moves in the UI
      } catch (error) {
        console.error('Failed to track move:', error.response?.data || error.message);
      }
    } else {
      console.log('Missing data for tracking:', { gameId, playerId, selectedToken });
    }
    
    if (diceValue !== 6) {
      nextTurn();
    } else {
      setDiceRolled(false);
    }
  };

  const nextTurn = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % 4);
    setDiceRolled(false);
  };

  const skipTurn = () => {
    nextTurn();
  };

  const handleDeleteGame = async () => {
    if (!gameId) return;
    
    if (window.confirm('Are you sure you want to delete this game? This will remove all move history.')) {
      try {
        await api.delete(`/games/${gameId}`);
        setGameId(null);
        console.log('Game deleted successfully');
        alert('Game deleted successfully!');
      } catch (error) {
        console.error('Failed to delete game:', error);
        alert('Failed to delete game');
      }
    }
  };

  const handleDeletePlayer = async () => {
    if (!playerId) return;
    
    if (window.confirm('Are you sure you want to delete this player? This will remove all associated moves.')) {
      try {
        await api.delete(`/players/${playerId}`);
        setPlayerId(null);
        localStorage.removeItem('player');
        console.log('Player deleted successfully');
        alert('Player deleted successfully!');
      } catch (error) {
        console.error('Failed to delete player:', error);
        alert('Failed to delete player');
      }
    }
  };

  const getRotation = (value) => {
    switch (value) {
      case 1: return "rotateX(0deg) rotateY(0deg)";
      case 2: return "rotateX(-180deg) rotateY(0deg)";
      case 3: return "rotateY(-90deg)";
      case 4: return "rotateY(90deg)";
      case 5: return "rotateX(-90deg)";
      case 6: return "rotateX(90deg)";
      default: return "";
    }
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="App">
      <TurnManager
        currentPlayerIndex={currentPlayerIndex}
        victories={victories}
      />
      
      <Board 
        positions={positions}
        getTokenPosition={getTokenPosition}
        selectToken={selectToken}
        selectedToken={selectedToken}
        currentPlayer={currentPlayer}
        diceValue={diceValue}
      />

      <div className="game-controls">
        <h2>Current Player: <span style={{color: currentPlayer.toLowerCase()}}>{currentPlayer}</span></h2>
        <h3>Dice Value: {diceValue}</h3>
        
        <div className="container" onClick={rollDice}>
          <div id="cube" style={{ transform: getRotation(diceValue) }}>
            <div className="front"><span className="dot dot1" /></div>
            <div className="back">
              <span className="dot dot1" />
              <span className="dot dot2" />
            </div>
            <div className="right">
              <span className="dot dot1" />
              <span className="dot dot2" />
              <span className="dot dot3" />
            </div>
            <div className="left">
              <span className="dot dot1" />
              <span className="dot dot2" />
              <span className="dot dot3" />
              <span className="dot dot4" />
            </div>
            <div className="top">
              <span className="dot dot1" />
              <span className="dot dot2" />
              <span className="dot dot3" />
              <span className="dot dot4" />
              <span className="dot dot5" />
            </div>
            <div className="bottom">
              <span className="dot dot1" />
              <span className="dot dot2" />
              <span className="dot dot3" />
              <span className="dot dot4" />
              <span className="dot dot5" />
              <span className="dot dot6" />
            </div>
          </div>
        </div>

        <div className="button-controls">
          <button onClick={rollDice} disabled={rolling || diceRolled}>
            {rolling ? "Rolling..." : "Roll Dice"}
          </button>
          
          {selectedToken && diceRolled && (
            <button onClick={handleTokenMove} disabled={!diceRolled}>
              Move Token
            </button>
          )}
          
          {diceRolled && !selectedToken && (
            <p style={{color: 'orange'}}>Select a token to move</p>
          )}
          
          <button onClick={skipTurn} disabled={!diceRolled}>
            Skip Turn
          </button>
        </div>

        {selectedToken && (
          <p>Selected: {selectedToken.player} Token {selectedToken.index + 1}</p>
        )}
        
        <div className="game-info" style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>
          <p>Game ID: {gameId || 'Not initialized'}</p>
          <p>Player ID: {playerId || 'Not set'}</p>
          {gameId && (
            <a href={`/moves/${gameId}`} target="_blank" rel="noopener noreferrer">
              View Move History
            </a>
          )}
          <br/>
          <a href="http://localhost:5000/api/moves" target="_blank" rel="noopener noreferrer">
            View All Moves (API)
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/select-game" element={<GameSelection />} />
      </Routes>
    </Router>
  );
}

export default App;