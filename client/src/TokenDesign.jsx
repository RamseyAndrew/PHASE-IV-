import React, { useState } from 'react';

const Token = ({ row, col, color, onClick, isSelected = false, canMove = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const tokenStyle = {
    position: 'absolute',
    top: `${row * 40}px`,
    left: `${col * 40}px`,
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: color,
    border: `3px solid ${isSelected ? '#fff' : 'rgba(0,0,0,0.3)'}`,
    boxShadow: isSelected 
      ? `0 0 15px ${color}, 0 4px 8px rgba(0,0,0,0.3)`
      : isHovered 
        ? `0 2px 8px rgba(0,0,0,0.4)`
        : '0 2px 4px rgba(0,0,0,0.2)',
    cursor: canMove ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    transform: isSelected 
      ? 'scale(1.1) translateZ(0)'
      : isHovered && canMove 
        ? 'scale(1.05) translateZ(0)'
        : 'scale(1) translateZ(0)',
    zIndex: isSelected ? 1000 : isHovered ? 100 : 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), ${color} 70%)`,
  };

  const innerDotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  };

  const handleClick = () => {
    if (canMove && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = () => {
    if (canMove) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={tokenStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="ludo-token"
    >
      <div style={innerDotStyle} />
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            border: '2px solid #333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          ✓
        </div>
      )}
    </div>
  );
};