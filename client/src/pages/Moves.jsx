import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Moves = () => {
  const { gameId } = useParams();
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        const response = await api.get(`/games/${gameId}/moves`);
        setMoves(response.data);
      } catch (error) {
        console.error('Error fetching moves:', error);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchMoves();
    }
  }, [gameId]);

  if (loading) return <div>Loading moves...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Move History - Game {gameId}</h1>
      
      {moves.length === 0 ? (
        <p>No moves recorded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Move #</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Player ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Piece</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Dice Roll</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Position</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move, index) => (
              <tr key={move.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{move.player_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{move.piece_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{move.dice_roll}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{move.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.close()}>Close</button>
      </div>
    </div>
  );
};

export default Moves;