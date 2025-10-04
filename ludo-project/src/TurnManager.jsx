import React from "react";
import "./TurnManager.css";

const players = ["Blue", "Red", "Green", "Yellow"];
const playerColors = {
  Blue: "#4285f4",
  Red: "#ea4335", 
  Green: "#34a853",
  Yellow: "gold",
};

function TurnManager({ currentPlayerIndex, onNextTurn, victories = {} }) {
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="turn-manager">
      <h1 style={{ color: playerColors[currentPlayer] }}>
        {currentPlayer}'s Turn
      </h1>

      <div className="victory-display">
        <h3>Tokens Home:</h3>
        <div className="victory-grid">
          {players.map((player) => (
            <div key={player} className="player-victories">
              <span style={{ color: playerColors[player] }}>
                {player}: {victories[player] || 0}/4
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="game-instructions">
        <p>1. Roll the dice</p>
        <p>2. Click a token to select it</p>
        <p>3. Click "Move Token" to move</p>
        <p>• Need 6 to start from home</p>
        <p>• Get 6 = Roll again!</p>
        <p>• Land on opponent = Capture!</p>
      </div>
    </div>
  );
}

export default TurnManager;