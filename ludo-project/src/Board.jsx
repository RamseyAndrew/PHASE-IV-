import React from 'react';
import Token from './Token';
import './Board.css';

const Board = ({ positions, getTokenPosition, selectToken, selectedToken, currentPlayer, diceValue }) => {
  const cells = [];
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const key = `${row}-${col}`;
      cells.push(<div key={key} className={`cell r${row} c${col}`} />);
    }
  }

  const playerColors = {
    Blue: '#4285f4',
    Red: '#ea4335',
    Green: '#34a853',
    Yellow: 'gold'
  };

  const renderTokens = () => {
    const tokens = [];

    if (!positions) return tokens;
    
    Object.entries(positions).forEach(([player, playerTokens]) => {
      playerTokens.forEach((pos, index) => {
        const tokenPos = getTokenPosition(player, index);
        const isSelected = selectedToken?.player === player && selectedToken?.index === index;
        
        tokens.push(
          <Token
            key={`${player}-${index}`}
            row={tokenPos.row}
            col={tokenPos.col}
            color={playerColors[player]}
            isSelected={isSelected}
            animate={true}
            onClick={() => {
              if (currentPlayer === player) {
                selectToken(player, index, diceValue);
              }
            }}
          />
        );
      });
    });
    
    return tokens;
  };

  return (
    <div className="board-wrapper">
      <div className="board">
        {cells}
      </div>
      {renderTokens()}
    </div>
  );
};

export default Board;