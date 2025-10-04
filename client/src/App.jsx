import { useState } from "react";
import "./App.css";
import Board from "./Board";
import TurnManager from "./TurnManager";
import useCaptureLogic from "./TokenCapture";

const players = ["Blue", "Red", "Green", "Yellow"];

function App() {
  const [diceValue, setDiceValue] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceRolled, setDiceRolled] = useState(false);
  
  const captureLogic = useCaptureLogic();
  
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

  const handleTokenMove = () => {
    if (!selectedToken || !diceRolled) return;
    
    const currentPlayer = players[currentPlayerIndex];
    moveToken(currentPlayer, diceValue);
    
    
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
        onNextTurn={skipTurn}
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
    </div>
  );
}

export default App;