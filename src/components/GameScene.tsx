import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface GameSceneProps {
  scores: { player1: number; player2: number };
  winner: number | null;
  onScore: (player: number) => void;
  onReset: () => void;
}

export const GameScene: React.FC<GameSceneProps> = ({ scores, winner, onScore, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [throwing, setThrowing] = useState<{ player: number; frame: number; distance: number } | null>(null);
  const [currentThrows, setCurrentThrows] = useState<{ player1: number | null; player2: number | null }>({ player1: null, player2: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#2C3E50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground line
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(canvas.width, 250);
    ctx.stroke();

    // Draw distance markers
    for (let i = 0; i <= 100; i += 10) {
      const x = 50 + (i * 5);
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(`${i}m`, x, 270);
      
      ctx.beginPath();
      ctx.moveTo(x, 245);
      ctx.lineTo(x, 255);
      ctx.stroke();
    }

    // Draw players
    const drawPlayer = (x: number, isRight: boolean, isActive: boolean) => {
      ctx.strokeStyle = isActive ? '#4CAF50' : 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Head
      ctx.arc(x, 200, 10, 0, Math.PI * 2);
      
      // Body
      ctx.moveTo(x, 210);
      ctx.lineTo(x, 240);
      
      // Arms
      if (throwing?.player === (isRight ? 2 : 1)) {
        // Throwing animation
        ctx.moveTo(x, 220);
        ctx.lineTo(x + (isRight ? -25 : 25), 210);
      } else {
        ctx.moveTo(x, 220);
        ctx.lineTo(x + (isRight ? -20 : 20), 230);
      }
      
      // Legs
      ctx.moveTo(x, 240);
      ctx.lineTo(x + (isRight ? -15 : 15), 250);
      ctx.moveTo(x, 240);
      ctx.lineTo(x + (isRight ? 15 : -15), 250);
      
      ctx.stroke();
    };

    // Draw players
    drawPlayer(50, false, !throwing || throwing.player === 1);
    drawPlayer(550, true, !throwing || throwing.player === 2);

    // Draw current distances
    ctx.font = '16px Arial';
    if (currentThrows.player1 !== null) {
      ctx.fillStyle = 'white';
      ctx.fillText(`${currentThrows.player1}m`, 30, 180);
    }
    if (currentThrows.player2 !== null) {
      ctx.fillStyle = 'white';
      ctx.fillText(`${currentThrows.player2}m`, 530, 180);
    }

    // Draw javelin if throwing
    if (throwing) {
      const progress = throwing.frame / 60;
      const startX = throwing.player === 1 ? 75 : 525;
      const distance = throwing.distance * 5; // Scale distance for visualization
      const endX = throwing.player === 1 ? startX + distance : startX - distance;
      
      const x = startX + ((endX - startX) * progress);
      const y = 220 - Math.sin(progress * Math.PI) * 100;
      
      // Draw javelin
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(Math.cos(progress * Math.PI) * 100, throwing.player === 1 ? distance : -distance));
      
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    }

  }, [scores, throwing, currentThrows]);

  const handleThrow = (player: number) => {
    if (throwing || winner) return;
    
    // Generate random distance between 50-100 meters
    const distance = Math.floor(Math.random() * 51) + 50;
    
    setThrowing({ player, frame: 0, distance });
    
    const animate = (frame: number) => {
      if (frame >= 60) {
        setThrowing(null);
        
        // Record the throw distance
        setCurrentThrows(prev => ({
          ...prev,
          [`player${player}`]: distance
        }));
        
        // If both players have thrown, determine the winner
        if (player === 2 || (player === 1 && currentThrows.player2 !== null)) {
          const p1Distance = player === 1 ? distance : currentThrows.player1;
          const p2Distance = player === 2 ? distance : currentThrows.player2;
          
          if (p1Distance !== null && p2Distance !== null) {
            onScore(p1Distance > p2Distance ? 1 : 2);
            setCurrentThrows({ player1: null, player2: null });
          }
        }
        return;
      }
      
      setThrowing({ player, frame, distance });
      requestAnimationFrame(() => animate(frame + 1));
    };
    
    animate(0);
  };

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width="600"
        height="300"
        className="bg-gray-800 rounded-lg mb-4 mx-auto"
      />

      {winner ? (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Player {winner} Wins!
          </h2>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600 transition-colors mx-auto"
          >
            <RefreshCw size={24} />
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex justify-between px-20">
          <button
            onClick={() => handleThrow(1)}
            disabled={!!throwing || currentThrows.player1 !== null}
            className="bg-red-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Throw
          </button>
          <button
            onClick={() => handleThrow(2)}
            disabled={!!throwing || currentThrows.player2 !== null || currentThrows.player1 === null}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Throw
          </button>
        </div>
      )}
    </div>
  );
}