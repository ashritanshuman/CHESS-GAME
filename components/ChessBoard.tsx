
import React, { useState, useEffect } from 'react';
import { Chess, Square as ChessSquare } from 'https://esm.sh/chess.js';
import { PIECE_IMAGES } from '../constants';

interface ChessBoardProps {
  game: Chess;
  onMove: (move: { from: string; to: string; promotion?: string }) => Promise<boolean>;
  disabled: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ game, onMove, disabled }) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);

  const board = game.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const getSquareName = (fileIdx: number, rankIdx: number) => {
    return `${files[fileIdx]}${ranks[rankIdx]}`;
  };

  const handleSquareClick = async (square: string) => {
    if (disabled) return;

    if (selectedSquare === square) {
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // If we click a valid target square for an existing selection
    if (selectedSquare && validMoves.includes(square)) {
      const success = await onMove({
        from: selectedSquare,
        to: square,
        promotion: 'q' // Auto-promote to queen for kids' simplicity
      });
      
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    // Try to select a new piece
    const piece = game.get(square as ChessSquare);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as ChessSquare, verbose: true });
      setValidMoves(moves.map(m => m.to));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  return (
    <div className="bg-blue-800 p-2 md:p-4 rounded-xl shadow-2xl border-4 border-blue-900 aspect-square w-full max-w-[500px] md:max-w-[600px]">
      <div className="grid grid-cols-8 h-full w-full">
        {ranks.map((rank, rIdx) => (
          <React.Fragment key={rank}>
            {files.map((file, fIdx) => {
              const squareName = getSquareName(fIdx, rIdx);
              const piece = board[rIdx][fIdx];
              const isDark = (rIdx + fIdx) % 2 === 1;
              const isSelected = selectedSquare === squareName;
              const isValidTarget = validMoves.includes(squareName);
              const isCheck = piece?.type === 'k' && piece?.color === game.turn() && game.inCheck();

              return (
                <div
                  key={squareName}
                  onClick={() => handleSquareClick(squareName)}
                  className={`
                    relative aspect-square flex items-center justify-center cursor-pointer transition-colors duration-200
                    ${isDark ? 'bg-blue-300' : 'bg-white'}
                    ${isSelected ? 'bg-yellow-200 ring-4 ring-yellow-400 z-10' : ''}
                    ${isCheck ? 'bg-red-300' : ''}
                    hover:brightness-95
                  `}
                >
                  {/* Rank labels (only on file 'a') */}
                  {fIdx === 0 && (
                    <span className={`absolute top-0.5 left-0.5 text-[8px] md:text-[10px] font-bold ${isDark ? 'text-white' : 'text-blue-400'}`}>
                      {rank}
                    </span>
                  )}
                  {/* File labels (only on rank '1') */}
                  {rIdx === 7 && (
                    <span className={`absolute bottom-0.5 right-0.5 text-[8px] md:text-[10px] font-bold ${isDark ? 'text-white' : 'text-blue-400'}`}>
                      {file}
                    </span>
                  )}

                  {/* Valid move indicators */}
                  {isValidTarget && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${piece ? 'bg-red-400/50 scale-150' : 'bg-green-400/60'}`} />
                    </div>
                  )}

                  {/* Chess Piece */}
                  {piece && (
                    <img
                      src={PIECE_IMAGES[`${piece.color}${piece.type}`]}
                      alt={`${piece.color} ${piece.type}`}
                      className={`w-4/5 h-4/5 select-none drop-shadow-md transform transition-transform duration-200 ${isSelected ? 'scale-110 -translate-y-1' : 'scale-100'}`}
                      draggable={false}
                    />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
