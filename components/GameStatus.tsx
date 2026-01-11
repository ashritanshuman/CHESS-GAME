
import React from 'react';
import { PieceColor } from '../types';

interface GameStatusProps {
  turn: PieceColor;
  isCheck: boolean;
  isGameOver: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ turn, isCheck, isGameOver, isCheckmate, isDraw }) => {
  let statusText = turn === 'w' ? "Your Turn! (White)" : "Computer is thinking... (Black)";
  let colorClass = turn === 'w' ? "text-blue-600" : "text-gray-600";
  let icon = turn === 'w' ? "👤" : "🤖";

  if (isCheckmate) {
    statusText = turn === 'w' ? "Checkmate! Black Wins!" : "Checkmate! You Win! 🎉";
    colorClass = "text-red-600 animate-bounce";
    icon = "🏆";
  } else if (isDraw) {
    statusText = "It's a Draw! Good effort!";
    colorClass = "text-orange-600";
    icon = "🤝";
  } else if (isCheck) {
    statusText = `${turn === 'w' ? 'You' : 'Computer'} are in Check! ⚠️`;
    colorClass = "text-red-500 animate-pulse font-extrabold";
    icon = "💥";
  }

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-100 text-center transition-all ${isGameOver ? 'scale-105' : ''}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <h2 className={`text-2xl font-bold ${colorClass}`}>
        {statusText}
      </h2>
      {!isGameOver && (
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 ${turn === 'w' ? 'bg-blue-400 w-full' : 'bg-gray-400 w-1/2 animate-pulse'}`} />
        </div>
      )}
    </div>
  );
};

export default GameStatus;
