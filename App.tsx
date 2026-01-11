
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Move as ChessMove } from 'https://esm.sh/chess.js';
import { Difficulty, GameState } from './types';
import ChessBoard from './components/ChessBoard';
import GameControls from './components/GameControls';
import GameStatus from './components/GameStatus';
import CapturedPieces from './components/CapturedPieces';
import { getComputerMove, getCoachAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [coachMessage, setCoachMessage] = useState("Welcome! Let's play some chess!");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  
  // Use a ref to keep track of the game instance to avoid stale closures
  const gameRef = useRef(game);

  const updateGameState = useCallback(() => {
    const currentFen = game.fen();
    setMoveHistory(game.history());
    
    // Analyze pieces to find captured ones
    const board = game.board();
    const allPieces: any[] = board.flat().filter(p => p !== null);
    
    // Starting counts
    const startPieces = {
      p: 8, n: 2, b: 2, r: 2, q: 1, k: 1
    };

    // This is a simplified capture detection
    // In a real app we'd track history more precisely
  }, [game]);

  const makeMove = useCallback((move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const result = game.move(move);
      if (result) {
        setGame(new Chess(game.fen()));
        return result;
      }
    } catch (e) {
      return null;
    }
    return null;
  }, [game]);

  const handleSquareClick = async (square: string) => {
    if (game.turn() === 'b' || isAiThinking || game.isGameOver()) return;

    // Logic for selection handled within ChessBoard component
  };

  const onMove = useCallback(async (moveObj: { from: string; to: string; promotion?: string }) => {
    const move = makeMove(moveObj);
    if (move) {
      // Trigger coach advice
      const advice = await getCoachAdvice(game.fen(), move.san);
      setCoachMessage(advice);
      return true;
    }
    return false;
  }, [makeMove, game]);

  // AI Turn Effect
  useEffect(() => {
    const triggerAi = async () => {
      if (game.turn() === 'b' && !game.isGameOver()) {
        setIsAiThinking(true);
        // Add a small artificial delay for "human-like" feel
        await new Promise(r => setTimeout(r, 1000));
        
        const aiMoveSan = await getComputerMove(game.fen(), difficulty);
        
        if (aiMoveSan) {
          const move = makeMove(aiMoveSan);
          if (!move) {
            // Fallback: If AI returns invalid SAN, try to find a random legal move
            const moves = game.moves();
            if (moves.length > 0) {
              const randomMove = moves[Math.floor(Math.random() * moves.length)];
              makeMove(randomMove);
            }
          }
        } else {
          // Final fallback
          const moves = game.moves();
          if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            makeMove(randomMove);
          }
        }
        setIsAiThinking(false);
      }
    };

    triggerAi();
  }, [game, difficulty, makeMove]);

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setCoachMessage("New game started! Good luck!");
    setMoveHistory([]);
  };

  const undoMove = () => {
    game.undo(); // Undo AI move
    game.undo(); // Undo Player move
    setGame(new Chess(game.fen()));
    setCoachMessage("Took a step back. What's your new plan?");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 drop-shadow-sm mb-2">
          🏰 Grandmaster Kids Chess
        </h1>
        <p className="text-gray-600 font-medium">Friendly AI, Unlimited Fun!</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Info & Controls */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <GameStatus 
            turn={game.turn()} 
            isCheck={game.inCheck()} 
            isGameOver={game.isGameOver()}
            isCheckmate={game.isCheckmate()}
            isDraw={game.isDraw()}
          />
          
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-100">
            <h3 className="font-bold text-xl text-blue-800 mb-4 flex items-center">
              🤖 Coach Gemini
            </h3>
            <p className="text-gray-700 italic text-lg leading-relaxed">
              "{coachMessage}"
            </p>
          </div>

          <GameControls 
            difficulty={difficulty} 
            setDifficulty={setDifficulty} 
            onReset={resetGame}
            onUndo={undoMove}
            disabled={isAiThinking}
          />
        </div>

        {/* Center: The Board */}
        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <ChessBoard 
              game={game} 
              onMove={onMove} 
              disabled={isAiThinking || game.isGameOver()} 
            />
            {isAiThinking && (
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
                <div className="bg-white px-6 py-3 rounded-full shadow-2xl border-4 border-blue-400 animate-bounce flex items-center gap-3">
                  <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></span>
                  <span className="font-bold text-blue-600 text-lg">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Stats & History */}
        <div className="lg:col-span-3 space-y-6 order-3">
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-100">
            <h3 className="font-bold text-xl text-purple-800 mb-4">📜 Move History</h3>
            <div className="h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
              {moveHistory.length === 0 ? (
                <p className="text-gray-400 italic">No moves yet...</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                    <React.Fragment key={i}>
                      <div className="bg-purple-50 p-2 rounded-lg text-sm font-medium border border-purple-100">
                        {i + 1}. {moveHistory[i * 2]}
                      </div>
                      {moveHistory[i * 2 + 1] && (
                        <div className="bg-gray-50 p-2 rounded-lg text-sm font-medium border border-gray-100">
                          {moveHistory[i * 2 + 1]}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <CapturedPieces game={game} />
        </div>
      </div>

      <footer className="mt-12 text-gray-400 text-sm pb-8">
        Designed for future Grandmasters 🌟
      </footer>
    </div>
  );
};

export default App;
