
import React from 'react';
import { Difficulty } from '../types';
import { DIFFICULTY_CONFIG } from '../constants';

interface GameControlsProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  onReset: () => void;
  onUndo: () => void;
  disabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  difficulty, 
  setDifficulty, 
  onReset, 
  onUndo, 
  disabled 
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-100 flex flex-col gap-6">
      <div>
        <h3 className="font-bold text-xl text-blue-800 mb-4">🎮 Difficulty</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(Difficulty).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              disabled={disabled}
              className={`
                px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-200 border-2
                ${difficulty === level 
                  ? `${DIFFICULTY_CONFIG[level].color} border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1` 
                  : 'bg-gray-100 text-gray-400 border-transparent hover:bg-gray-200'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onUndo}
          disabled={disabled}
          className="w-full bg-white border-4 border-orange-400 text-orange-500 hover:bg-orange-50 py-3 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          ⏪ Oops! Undo
        </button>
        <button
          onClick={onReset}
          className="w-full bg-blue-500 border-4 border-blue-700 text-white hover:bg-blue-600 py-3 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
};

export default GameControls;
