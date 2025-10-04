import { useState } from "react";
import { mainPath, playerStartIndex, victoryLanes, homePositions } from "./pathData";
import moveSoundFile from "./Assets/move-sound.mp3"; // Import sound file

function useCaptureLogic() {
  const [positions, setPositions] = useState({
    Red: [null, null, null, null],
    Blue: [null, null, null, null],
    Green: [null, null, null, null],
    Yellow: [null, null, null, null],
  });

  const [victories, setVictories] = useState({
    Red: 0,
    Blue: 0,
    Green: 0,
    Yellow: 0,
  });

  const [selectedToken, setSelectedToken] = useState(null); // { player, index }

  // Initialize sound
  const moveSound = new Audio(moveSoundFile);

  const selectToken = (player, index, diceValue) => {
    const currentPos = positions[player][index];

    if (currentPos === null && diceValue !== 6) {
      alert("Need to roll 6 to start from home!");
      return;
    }

    if (currentPos === "victory") {
      alert("This token has already reached home!");
      return;
    }

    if (currentPos !== null && currentPos !== "victory") {
      const newPos = currentPos + diceValue;
      const playerStartPos = playerStartIndex[player];

      if (newPos >= mainPath.length - playerStartPos) {
        const victoryIndex = newPos - (mainPath.length - playerStartPos);
        if (victoryIndex >= victoryLanes[player].length) {
          const movesNeeded = (mainPath.length - playerStartPos) + victoryLanes[player].length - currentPos;
          if (diceValue !== movesNeeded) {
            alert(`Need exactly ${movesNeeded} to reach home!`);
            return;
          }
        }
      }
    }

    setSelectedToken({ player, index });
  };

  const moveToken = (player, diceValue) => {
    const tokenToMove = selectedToken;

    if (!tokenToMove || tokenToMove.player !== player) return;

    
    moveSound.play().catch((error) => {
      console.error("Failed to play sound:", error);
    });

    setPositions((prev) => {
      const currentPos = prev[player][tokenToMove.index];
      let newPositions = { ...prev };

      if (currentPos === null) {
        if (diceValue === 6) {
          newPositions[player][tokenToMove.index] = playerStartIndex[player];
        }
        return newPositions;
      }

      if (currentPos === "victory") {
        return newPositions;
      }

      const newPos = currentPos + diceValue;
      const playerStartPos = playerStartIndex[player];
      const mainPathLength = mainPath.length;
      const spacesFromStartToEndOfMainPath = mainPathLength - playerStartPos;

      if (newPos >= playerStartPos + spacesFromStartToEndOfMainPath) {
        const victoryIndex = newPos - (playerStartPos + spacesFromStartToEndOfMainPath);

        if (victoryIndex >= victoryLanes[player].length) {
          alert("Cannot overshoot the victory lane! Need exact number to reach home.");
          return prev;
        } else if (victoryIndex === victoryLanes[player].length - 1) {
          newPositions[player][tokenToMove.index] = "victory";

          setVictories((prevWins) => {
            const updated = { ...prevWins, [player]: prevWins[player] + 1 };
            if (updated[player] === 4) {
              setTimeout(() => alert(`🎉 ${player} wins the game! 🎉`), 100);
            }
            return updated;
          });

          return newPositions;
        } else {
          newPositions[player][tokenToMove.index] = newPos;
          return newPositions;
        }
      }

      if (newPos < mainPath.length) {
        for (const otherPlayer in prev) {
          if (otherPlayer === player) continue;

          newPositions[otherPlayer] = newPositions[otherPlayer].map((pos, i) => {
            if (pos === newPos && pos !== null && pos !== "victory" && !isSafePosition(newPos)) {
              setTimeout(() => alert(`${player} captured ${otherPlayer}'s token ${i + 1}!`), 100);
              return null;
            }
            return pos;
          });
        }
      }

      newPositions[player][tokenToMove.index] = newPos;
      return newPositions;
    });

    setSelectedToken(null);
  };

  const isSafePosition = (index) => {
    const safeIndexes = [
      1, 9, 14, 22, 27, 35, 40, 48,
      playerStartIndex.Blue,
      playerStartIndex.Red,
      playerStartIndex.Green,
      playerStartIndex.Yellow,
    ];
    return safeIndexes.includes(index);
  };

  const getTokenPosition = (player, tokenIndex) => {
    const pos = positions[player][tokenIndex];

    if (pos === null) return homePositions[player][tokenIndex];
    if (pos === "victory") return { row: 7, col: 7 };

    const playerStartPos = playerStartIndex[player];

    if (pos >= mainPath.length - playerStartPos) {
      const victoryIndex = pos - (mainPath.length - playerStartPos);
      if (victoryIndex < victoryLanes[player].length) {
        return victoryLanes[player][victoryIndex];
      }
    }

    if (pos < mainPath.length) return mainPath[pos];

    return homePositions[player][tokenIndex];
  };

  const hasValidMoves = (player, diceValue) => {
    const playerTokens = positions[player];

    for (let i = 0; i < playerTokens.length; i++) {
      const currentPos = playerTokens[i];

      if (currentPos === null && diceValue === 6) return true;
      if (currentPos === "victory") continue;

      if (currentPos !== null && currentPos !== "victory") {
        const newPos = currentPos + diceValue;
        const playerStartPos = playerStartIndex[player];
        const mainPathLength = mainPath.length;
        const spacesFromStartToEndOfMainPath = mainPathLength - playerStartPos;

        if (newPos >= playerStartPos + spacesFromStartToEndOfMainPath) {
          const victoryIndex = newPos - (playerStartPos + spacesFromStartToEndOfMainPath);
          if (victoryIndex < victoryLanes[player].length) return true;
        } else {
          return true;
        }
      }
    }

    return false;
  };

  return {
    positions,
    moveToken,
    selectToken,
    selectedToken,
    getTokenPosition,
    victories,
    hasValidMoves,
  };
}

export default useCaptureLogic;
