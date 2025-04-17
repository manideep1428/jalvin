import React from 'react';
import { Swords, BookOpen, Play } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  onRules: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onRules }) => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-8 text-white tracking-wider">
        JAVLIN THROW
      </h1>
      
      <div className="mb-12">
        <canvas id="titleCanvas" width="400" height="200" className="mx-auto"></canvas>
      </div>

      <div className="space-y-4">
        <button
          onClick={onStart}
          className="w-48 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 transition-colors"
        >
          <Play size={24} />
          Start
        </button>
        
        <button
          onClick={onRules}
          className="w-48 flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-600 transition-colors"
        >
          <BookOpen size={24} />
          Rules
        </button>
      </div>
    </div>
  );
}