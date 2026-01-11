
import React from 'react';
import { Chess } from 'https://esm.sh/chess.js';
import { PIECE_IMAGES } from '../constants';
import { PieceType } from '../types';

interface CapturedPiecesProps {
  game: Chess;
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ game }) => {
  // Logic to determine captured pieces by comparing starting set to current board
  const board = game.board().flat();
  const currentPieces = board.filter(p => p !== null) as { type: PieceType, color: 'w' | 'b' }[];
  
  const startingCounts: Record<string, number> = {
    wp: 8, wn: 2, wb: 2, wr: 2, wq: 1,
    bp: 8, bn: 2, bb: 2, br: 2, bq: 1,
  };

  const captured: string[] = [];
  
  Object.keys(startingCounts).forEach(key => {
    const color = key[0] as 'w' | 'b';
    const type = key[1] as PieceType;
    const countOnBoard = currentPieces.filter(p => p.color === color && p.type === type).length;
    const countCaptured = startingCounts[key] - countOnBoard;
    
    for(let i = 0; i < countCaptured; i++) {
      captured.push(key);
    }
  });

  const whiteCaptured = captured.filter(p => p.startsWith('w'));
  const blackCaptured = captured.filter(p => p.startsWith('b'));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-green-100">
      <h3 className="font-bold text-xl text-green-800 mb-4">🛡️ Captured Pieces</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Captured White</p>
          <div className="flex flex-wrap gap-1 min-h-[30px]">
            {whiteCaptured.map((p, i) => (
              <img key={i} src={PIECE_IMAGES[p]} className="w-6 h-6 opacity-80" alt="captured white" />
            ))}
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Captured Black</p>
          <div className="flex flex-wrap gap-1 min-h-[30px]">
            {blackCaptured.map((p, i) => (
              <img key={i} src={PIECE_IMAGES[p]} className="w-6 h-6 opacity-80" alt="captured black" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturedPieces;
