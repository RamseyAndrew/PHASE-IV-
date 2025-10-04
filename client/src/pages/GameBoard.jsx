import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const GameBoard = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [moves, setMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [diceRoll, setDiceRoll] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(roll);
  };

  const makeMove = async (pieceId) => {
    if (!diceRoll || !currentPlayer) return;

    try {
      const moveData = {
        dice_roll: diceRoll,
        piece_id: pieceId,
        position: calculateNewPosition(pieceId, diceRoll),
        player_id: currentPlayer.id,
        game_id: parseInt(gameId)
      };

      await api.post('/moves', moveData);
      // Refresh moves
      const movesRes = await api.get(`/games/${gameId}/moves`);
      setMoves(movesRes.data);
      setDiceRoll(null);
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  const calculateNewPosition = (pieceId, roll) => {
    // Simple position calculation - in real Ludo this would be more complex
    const currentMoves = moves.filter(m => m.player_id === currentPlayer.id && m.piece_id === pieceId);
    const lastMove = currentMoves[currentMoves.length - 1];
    const currentPos = lastMove ? lastMove.position : 0;
    return Math.min(currentPos + roll, 57); // 57 = finished
  };

  if (loading) return <div>Loading game...</div>;
  if (!game) return <div>Game not found</div>;

  return (
    <div className="game-board">
      <h1>Game #{game.id} - {game.status}</h1>

      <div className="board">
        {/* Simple board representation - in real Ludo this would be a proper board */}
        <div className="board-grid">
          {Array.from({ length: 52 }, (_, i) => (
            <div key={i + 1} className="board-square">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="game-controls">
        <button onClick={rollDice} disabled={diceRoll !== null}>
          Roll Dice
        </button>
        {diceRoll && <p>You rolled: {diceRoll}</p>}

        {diceRoll && (
          <div className="pieces">
            <h3>Select piece to move:</h3>
            {[1, 2, 3, 4].map(pieceId => (
              <button key={pieceId} onClick={() => makeMove(pieceId)}>
                Move Piece {pieceId}
              </button>
            ))}
          </div>
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
