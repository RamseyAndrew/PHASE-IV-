import React, { useEffect, useState } from "react";
import api from "../services/api";

function MovesList({ gameId }) {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gameId) return;

    const fetchMoves = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/games/${gameId}/moves`);
        setMoves(response.data);
      } catch {
        setError("Failed to load moves");
      } finally {
        setLoading(false);
      }
    };

    fetchMoves();
  }, [gameId]);

  if (!gameId) {
    return <p>No game selected</p>;
  }

  if (loading) {
    return <p>Loading moves...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (moves.length === 0) {
    return <p>No moves recorded yet.</p>;
  }

  return (
    <div>
      <h3>Move History</h3>
      <table>
        <thead>
          <tr>
            <th>Move ID</th>
            <th>Player ID</th>
            <th>Piece ID</th>
            <th>Dice Roll</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {moves.map((move) => (
            <tr key={move.id}>
              <td>{move.id}</td>
              <td>{move.player_id}</td>
              <td>{move.piece_id}</td>
              <td>{move.dice_roll}</td>
              <td>{move.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovesList;
