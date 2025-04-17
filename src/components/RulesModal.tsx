import React from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">How to Play</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4 text-left">
        <p>
          <strong>Objective:</strong> Be the first player to win 3 rounds by throwing
          the javelin further than your opponent.
        </p>

        <div>
          <strong>Rules:</strong>
          <ul className="list-disc ml-6 mt-2">
            <li>Players take turns throwing the javelin</li>
            <li>Player 1 must throw first, followed by Player 2</li>
            <li>The player who throws the furthest distance wins the round</li>
            <li>First to win 3 rounds wins the game</li>
            <li>Distances range from 50-100 meters</li>
          </ul>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full"
      >
        Got it!
      </button>
    </div>
  );
}