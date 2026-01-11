
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  INTERMEDIATE = 'Intermediate',
  HARD = 'Hard'
}

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Square {
  square: string;
  type: PieceType;
  color: PieceColor;
}

export interface Move {
  from: string;
  to: string;
  promotion?: string;
  san?: string;
}

export interface GameState {
  fen: string;
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  history: string[];
  capturedPieces: {
    w: PieceType[];
    b: PieceType[];
  };
}
