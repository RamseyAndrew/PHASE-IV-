import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Board from '../Board';
import TurnManager from '../TurnManager';
import useCaptureLogic from '../TokenCapture';

const players = ["Blue", "Red", "Green", "Yellow"];

const GameBoard = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [moves, setMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [diceRolled, setDiceRolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const captureLogic = useCaptureLogic();

  const {
    moveToken = () => {},
    positions = {},
    selectToken = () => {},
    selectedToken = null,
    getTokenPosition = () => ({ row: 0, col: 0 }),
    victories = {},
  } = captureLogic || {};

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [gameRes, movesRes] = await Promise.all([
          api.get(`/games/${gameId}`),
          api.get(`/games/${gameId}/moves`)
        ]);
        setGame(gameRes.data);
        setMoves(movesRes.data);

        // Get current player from localStorage
        const player = JSON.parse(localStorage.getItem('player'));
        setCurrentPlayer(player);
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

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
    if (!selectedToken || !diceRolled || !currentPlayer) return;

    try {
      // Post move to backend
      await api.post('/moves', {
        dice_roll: diceValue,
        piece_id: selectedToken.index + 1,
        position: 0, // Position calculation can be improved
        player_id: currentPlayer.id,
        game_id: parseInt(gameId)
      });

      moveToken(players[currentPlayer.id - 1], diceValue); // Assuming player.id starts from 1

      if (diceValue !== 6) {
        nextTurn();
      } else {
        setDiceRolled(false);
      }
    } catch (error) {
      console.error('Error making move:', error);
      alert('Failed to make move');
    }
  };

  const nextTurn = () => {
    // For simplicity, cycle through players
    // In real app, determine next player from backend
    setDiceRolled(false);
  };

  const skipTurn = () => {
    nextTurn();
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

  if (loading) return <div>Loading game...</div>;
  if (!game) return <div>Game not found</div>;

  const currentPlayerIndex = 0; // Placeholder, should be from backend
  const currentPlayerName = players[currentPlayerIndex];

  return (
    <div className="game-board">
      <h1>Game #{game.id} - {game.status}</h1>

      <TurnManager
        currentPlayerIndex={currentPlayerIndex}
        onNextTurn={skipTurn}
        victories={victories}
      />

      <Board
        positions={positions}
        getTokenPosition={getTokenPosition}
        selectToken={selectToken}
        selectedToken={selectedToken}
        currentPlayer={currentPlayerName}
        diceValue={diceValue}
      />

      <div className="game-controls">
        <h2>Current Player: <span style={{color: currentPlayerName.toLowerCase()}}>{currentPlayerName}</span></h2>
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

          {selectedToken && (
            <button onClick={handleTokenMove} disabled={!diceRolled}>
              Move Token
            </button>
          )}

          {diceRolled && !selectedToken && (
            <button onClick={skipTurn}>
              Skip Turn (No Valid Moves)
            </button>
          )}
        </div>

        {selectedToken && (
          <p>Selected: {selectedToken.player} Token {selectedToken.index + 1}</p>
        )}
      </div>

      <div className="moves-history">
        <h3>Recent Moves</h3>
        <ul>
          {moves.slice(-10).map(move => (
            <li key={move.id}>
              Player {move.player_id} - Piece {move.piece_id} - Roll {move.dice_roll} - Position {move.position}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameBoard;
