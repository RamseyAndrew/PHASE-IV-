import React from 'react';
import './Token.css';

const Token = ({ row, col, color, isSelected, onClick, animate = true }) => {
  if (row === null || row === undefined || col === null || col === undefined) return null;

  const style = {
    position: 'absolute',
    left: `${(col * 100/15) + 1}%`,
    top: `${(row * 100/15) + 1}%`,
    width: `${100/15 - 2}%`,
    height: `${100/15 - 2}%`,
    backgroundColor: color,
    border: isSelected ? '3px solid #FFD700' : '2px solid white',
    borderRadius: '50%',
    boxShadow: isSelected
      ? '0 0 15px rgba(255, 215, 0, 0.8), 0 2px 6px rgba(0,0,0,0.3)'
      : '0 2px 6px rgba(0,0,0,0.3)',
    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
    zIndex: isSelected ? 20 : 10,
    transition: animate ? 'all 0.3s ease-in-out' : 'none',
    cursor: 'pointer',
  };

  return <div className="token" style={style} onClick={onClick} />;
};

export default Token;