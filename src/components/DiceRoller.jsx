import React, { useState, useRef, useCallback } from 'react';
import RollAnimationOverlay from './RollAnimationOverlay';

// Sons
// Caminhos explícitos para o GitHub Pages para garantir que os sons sejam encontrados.
// Substitua 'rpg-app' pelo nome exato do seu repositório se for diferente.
const diceRollSound = new Audio('/rpg-app/sounds/dice_roll.mp3');
const diceLandSound = new Audio('/rpg-app/sounds/dice_land.mp3');

function DiceRoller({ onRollStart, onRollEnd }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [diceHistory, setDiceHistory] = useState([]);
  const [showAnimationOverlay, setShowAnimationOverlay] = useState(false);
  const [showResultGlow, setShowResultGlow] = useState(false);
  const rollingRef = useRef(false); // Para evitar rolagens simultâneas

  const finalResultRef = useRef(null);

  const getResultColorClass = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'text-white';
    }
    // Mantém a lógica de cor existente, se houver uma diferença para valores < 10
    return numValue < 10 ? 'text-white' : 'text-white';
  };

  const rollDice = useCallback((exprToRoll = expression) => {
    if (rollingRef.current) {
      // Já está rolando, evita múltiplas chamadas
      return;
    }

    if (!exprToRoll.trim()) {
      setResult('Digite uma expressão (ex: 2d6+3)');
      return;
    }

    rollingRef.current = true;
    onRollStart();

    // Tocar som de rolar dados
    diceRollSound.pause();
    diceRollSound.currentTime = 0;
    diceRollSound.play().catch(e => console.error("Erro ao tocar som de rolagem:", e));

    setResult(null);
    setShowResultGlow(false);

    let calculatedResult = 0;
    let calculatedHistoryEntry = exprToRoll;
    let errorOccurred = false;

    try {
      // Regex para encontrar padrões de dados (ex: 1d6, 2d20, d10)
      const diceRegex = /(\d*)d(\d+)/g;
      let diceRollsDetails = []; // Para armazenar os detalhes de cada rolagem de dado

      // Substitui as expressões de dados pelas somas dos resultados
      const processedExpression = exprToRoll.replace(diceRegex, (match, numDiceStr, numSidesStr) => {
        const numDice = numDiceStr ? parseInt(numDiceStr, 10) : 1;
        const numSides = parseInt(numSidesStr, 10);

        if (isNaN(numDice) || isNaN(numSides) || numSides <= 0) {
          errorOccurred = true;
          throw new Error('Expressão de dado inválida: ' + match);
        }

        let rollSum = 0;
        let rolls = [];
        for (let i = 0; i < numDice; i++) {
          const roll = Math.floor(Math.random() * numSides) + 1;
          rolls.push(roll);
          rollSum += roll;
        }
        diceRollsDetails.push(`${numDice || 1}d${numSides} [${rolls.join(', ')}]`);
        return rollSum; // Retorna a soma para ser usada na expressão final
      });

      // Validação básica para garantir que a expressão processada só tem números e operadores
      const safeProcessedExpression = processedExpression.replace(/\s/g, ''); // Remove espaços
      if (!/^[0-9+\-*/().]+$/.test(safeProcessedExpression)) {
        errorOccurred = true;
        throw new Error('Expressão contém caracteres inválidos após rolagem de dados.');
      }

      // Usando Function constructor como alternativa mais segura ao eval para expressões matemáticas simples
      calculatedResult = new Function('return ' + safeProcessedExpression)();

      // Formata a entrada do histórico
      calculatedHistoryEntry = exprToRoll;
      if (diceRollsDetails.length > 0) {
        calculatedHistoryEntry += ` (${diceRollsDetails.join(' + ')})`;
      }
      calculatedHistoryEntry += ` = ${calculatedResult}`;

    } catch (error) {
      console.error("Erro ao processar expressão de rolagem:", error);
      calculatedResult = 'Erro na expressão!';
      calculatedHistoryEntry = `Erro ao rolar '${exprToRoll}'`;
      errorOccurred = true;
    }

    setShowAnimationOverlay(true);

    const overlayAnimationDuration = 2050; // Duração da animação do overlay

    setTimeout(() => {
      setShowAnimationOverlay(false);
      setResult(calculatedResult);
      setShowResultGlow(true);
      setDiceHistory(prevHistory => [calculatedHistoryEntry, ...prevHistory].slice(0, 5));
      onRollEnd();
      rollingRef.current = false; // Permite nova rolagem

      // Tocar som de dado caindo (land)
      diceLandSound.pause();
      diceLandSound.currentTime = 0;
      diceLandSound.play().catch(e => console.error("Erro ao tocar som de aterrissagem:", e));

    }, overlayAnimationDuration);
  }, [expression, onRollStart, onRollEnd]); // Dependências do useCallback

  return (
    <div className="p-6 bg-gray-700/50 rounded-lg shadow-xl border border-gray-600 backdrop-blur-sm">
      <h3 className="text-3xl font-semibold text-orange-300 mb-6">ROLAR!</h3>

      <div className="mb-4">
        <label htmlFor="diceExpression" className="block text-gray-400 text-sm font-bold mb-1">DIGITE A EXPRESSÃO:</label>
        <input
          type="text"
          id="diceExpression"
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') rollDice(expression); }}
          disabled={rollingRef.current} // Desabilita input durante rolagem
        />
      </div>

      <button
        onClick={() => rollDice(expression)}
        disabled={rollingRef.current} // Desabilita botão durante rolagem
        className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-75 mb-6
          ${rollingRef.current ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        `}
      >
        ROLAR!
      </button>

      <div
        ref={finalResultRef}
        className={`mb-6 p-4 bg-gray-900 border border-gray-700 rounded-md text-center text-4xl font-extrabold overflow-hidden
          transition-opacity duration-700 ease-in-out
          ${result !== null ? 'opacity-100' : 'opacity-0'}
          ${showResultGlow ? 'animate-final-glow-result' : ''}
          ${getResultColorClass(result)}
        `}
      >
        {result !== null ? result : 'Resultado'}
      </div>

      <div className="p-4 bg-gray-900 border border-gray-700 rounded-md">
        <h4 className="text-lg font-semibold text-gray-300 mb-2">HISTÓRICO DE ROLAGENS:</h4>
        {diceHistory.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Nenhuma rolagem ainda.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
            {diceHistory.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        )}
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
