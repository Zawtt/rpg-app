import React, { useState, useRef, useCallback } from 'react';
import { Dices, History, Play } from 'lucide-react';
import RollAnimationOverlay from './RollAnimationOverlay';

// Sons
const diceRollSound = new Audio('/rpg-app/sounds/dice_roll.mp3');
const diceLandSound = new Audio('/rpg-app/sounds/dice_land.mp3');

function DiceRoller({ onRollStart, onRollEnd }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [diceHistory, setDiceHistory] = useState([]);
  const [showAnimationOverlay, setShowAnimationOverlay] = useState(false);
  const [showResultGlow, setShowResultGlow] = useState(false);
  const rollingRef = useRef(false);

  const finalResultRef = useRef(null);

  // Quick roll buttons for common dice
  const quickRolls = [
    { label: 'd4', value: '1d4' },
    { label: 'd6', value: '1d6' },
    { label: 'd8', value: '1d8' },
    { label: 'd10', value: '1d10' },
    { label: 'd12', value: '1d12' },
    { label: 'd20', value: '1d20' },
    { label: '2d6', value: '2d6' },
    { label: '3d6', value: '3d6' }
  ];

  const getResultColorClass = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'text-white';
    }
    if (numValue === 20) return 'text-green-400';
    if (numValue === 1) return 'text-red-400';
    if (numValue >= 15) return 'text-blue-400';
    return 'text-white';
  };

  const rollDice = useCallback((exprToRoll = expression) => {
    if (rollingRef.current) {
      return;
    }

    if (!exprToRoll.trim()) {
      setResult('Enter expression (e.g., 2d6+3)');
      return;
    }

    rollingRef.current = true;
    onRollStart();

    // Play roll sound
    diceRollSound.pause();
    diceRollSound.currentTime = 0;
    diceRollSound.play().catch(e => console.error("Error playing roll sound:", e));

    setResult(null);
    setShowResultGlow(false);

    let calculatedResult = 0;
    let calculatedHistoryEntry = exprToRoll;
    let errorOccurred = false;

    try {
      const diceRegex = /(\d*)d(\d+)/g;
      let diceRollsDetails = [];

      const processedExpression = exprToRoll.replace(diceRegex, (match, numDiceStr, numSidesStr) => {
        const numDice = numDiceStr ? parseInt(numDiceStr, 10) : 1;
        const numSides = parseInt(numSidesStr, 10);

        if (isNaN(numDice) || isNaN(numSides) || numSides <= 0) {
          errorOccurred = true;
          throw new Error('Invalid dice expression: ' + match);
        }

        let rollSum = 0;
        let rolls = [];
        for (let i = 0; i < numDice; i++) {
          const roll = Math.floor(Math.random() * numSides) + 1;
          rolls.push(roll);
          rollSum += roll;
        }
        diceRollsDetails.push(`${numDice || 1}d${numSides} [${rolls.join(', ')}]`);
        return rollSum;
      });

      const safeProcessedExpression = processedExpression.replace(/\s/g, '');
      if (!/^[0-9+\-*/().]+$/.test(safeProcessedExpression)) {
        errorOccurred = true;
        throw new Error('Expression contains invalid characters after dice rolling.');
      }

      calculatedResult = new Function('return ' + safeProcessedExpression)();

      calculatedHistoryEntry = exprToRoll;
      if (diceRollsDetails.length > 0) {
        calculatedHistoryEntry += ` (${diceRollsDetails.join(' + ')})`;
      }
      calculatedHistoryEntry += ` = ${calculatedResult}`;

    } catch (error) {
      console.error("Error processing roll expression:", error);
      calculatedResult = 'Expression Error!';
      calculatedHistoryEntry = `Error rolling '${exprToRoll}'`;
      errorOccurred = true;
    }

    setShowAnimationOverlay(true);

    const overlayAnimationDuration = 2050;

    setTimeout(() => {
      setShowAnimationOverlay(false);
      setResult(calculatedResult);
      setShowResultGlow(true);
      setDiceHistory(prevHistory => [calculatedHistoryEntry, ...prevHistory].slice(0, 5));
      onRollEnd();
      rollingRef.current = false;

      // Play land sound
      diceLandSound.pause();
      diceLandSound.currentTime = 0;
      diceLandSound.play().catch(e => console.error("Error playing land sound:", e));

    }, overlayAnimationDuration);
  }, [expression, onRollStart, onRollEnd]);

  const handleQuickRoll = (diceValue) => {
    setExpression(diceValue);
    rollDice(diceValue);
  };

  const clearHistory = () => {
    setDiceHistory([]);
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-2xl font-medium text-gray-100 flex items-center gap-3">
          <Dices size={24} className="text-orange-400" />
          DICE ROLLER
        </h3>
        <div className="w-20 h-0.5 bg-orange-500 mt-2"></div>
      </div>

      <div className="p-6 space-y-6">
        {/* Expression Input */}
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Dice Expression
          </label>
          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') rollDice(expression); }}
              disabled={rollingRef.current}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm pr-12"
              placeholder="2d6+3, 1d20, 4d8+2..."
            />
            <button
              onClick={() => rollDice(expression)}
              disabled={rollingRef.current}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors ${
                rollingRef.current ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Play size={16} />
            </button>
          </div>
        </div>

        {/* Quick Roll Buttons */}
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Quick Rolls
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickRolls.map((dice) => (
              <button
                key={dice.value}
                onClick={() => handleQuickRoll(dice.value)}
                disabled={rollingRef.current}
                className={`px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white rounded text-sm font-medium transition-colors ${
                  rollingRef.current ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {dice.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Roll Button */}
        <button
          onClick={() => rollDice(expression)}
          disabled={rollingRef.current}
          className={`w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-500/50 ${
            rollingRef.current ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
          }`}
        >
          {rollingRef.current ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ROLLING...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Dices size={20} />
              ROLL DICE
            </div>
          )}
        </button>

        {/* Result Display */}
        <div
          ref={finalResultRef}
          className={`p-6 bg-gray-800/80 border border-gray-700 rounded-lg text-center transition-all duration-700 ease-in-out ${
            result !== null ? 'opacity-100' : 'opacity-30'
          } ${showResultGlow ? 'animate-pulse' : ''}`}
        >
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
            Result
          </div>
          <div className={`text-4xl font-extrabold ${getResultColorClass(result)}`}>
            {result !== null ? result : '?'}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Roll History
              </h4>
            </div>
            {diceHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-4 max-h-48 overflow-y-auto">
            {diceHistory.length === 0 ? (
              <p className="text-gray-500 italic text-sm text-center py-4">
                No rolls yet
              </p>
            ) : (
              <ul className="space-y-2">
                {diceHistory.map((entry, index) => (
                  <li 
                    key={index} 
                    className="text-gray-400 text-sm font-mono bg-gray-900/50 p-2 rounded border-l-2 border-orange-500/30"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showAnimationOverlay && (
        <RollAnimationOverlay
          onAnimationEnd={() => setShowAnimationOverlay(false)}
        />
      )}
    </div>
  );
}

export default DiceRoller;