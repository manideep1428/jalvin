import React, { useState, useEffect, useRef } from 'react';
import { Swords, RefreshCw, BookOpen } from 'lucide-react';
import { GameScene } from './components/GameScene';
import { TitleScreen } from './components/TitleScreen';
import { RulesModal } from './components/RulesModal';

function App() {
  const [gameState, setGameState] = useState<'title' | 'playing' | 'rules'>('title');
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<number | null>(null);

  const resetGame = () => {
    setScores({ player1: 0, player2: 0 });
    setWinner(null);
  };

  const handleScore = (player: number) => {
    const newScores = { ...scores };
    if (player === 1) newScores.player1 += 1;
    else newScores.player2 += 1;
    setScores(newScores);

    if (newScores.player1 >= 3) setWinner(1);
    if (newScores.player2 >= 3) setWinner(2);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-4xl p-4">
        {gameState === 'title' && (
          <TitleScreen 
            onStart={() => setGameState('playing')}
            onRules={() => setGameState('rules')}
          />
        )}
        
        {gameState === 'playing' && (
          <GameScene 
            scores={scores}
            winner={winner}
            onScore={handleScore}
            onReset={resetGame}
          />
        )}

        {gameState === 'rules' && (
          <RulesModal onClose={() => setGameState('title')} />
        )}
      </div>
    </div>
  );
}

export default App;