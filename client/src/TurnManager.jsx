import React from 'react';
import './TurnManager.css';

const TurnManager = ({ currentPlayerIndex, onNextTurn, victories }) => {
  const players = ['Blue', 'Red', 'Green', 'Yellow'];

  return (
    <div className="turn-manager">
      <h2>Current Turn: {players[currentPlayerIndex]}</h2>
      <button onClick={onNextTurn}>Next Turn</button>
      <div className="victories">
        {players.map((player) => (
          <div key={player} className="victory-count">
            {player}: {victories[player]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurnManager;
