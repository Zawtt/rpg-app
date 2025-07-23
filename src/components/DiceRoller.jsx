import React, { useState, useRef } from 'react';
import RollAnimationOverlay from './RollAnimationOverlay';

// Sons
const diceRollSound = new Audio('/sounds/dice_roll.mp3');

function DiceRoller({ onRollStart, onRollEnd }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null); // O resultado final que aparece lentamente
  const [diceHistory, setDiceHistory] = useState([]);
  const [showAnimationOverlay, setShowAnimationOverlay] = useState(false);
  const [currentRollResult, setCurrentRollResult] = useState(null); // Armazena o resultado da rolagem atual
  const [currentHistoryEntry, setCurrentHistoryEntry] = useState(''); // Armazena a entrada de histórico da rolagem atual
  const [showResultGlow, setShowResultGlow] = useState(false);

  // Referência para o elemento ONDE o resultado final aparecerá no DiceRoller
  const finalResultRef = useRef(null);

  // Função para determinar a classe da cor do resultado
  const getResultColorClass = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'text-white'; // Cor padrão se não for um número (ex: "Erro na expressão!")
    }

    if (numValue < 10) {
      return 'text-white-500'; // Abaixo de 10, vermelho
    } else {
      return 'text-white-500'; // 10 ou acima, verde
    }
  };

  const rollDice = async (expr = expression) => {
    if (!expr) {
      setResult('Digite uma expressão (ex: 2d6+3)');
      return;
    }

    // 1. Inicia a animação global (tremor, etc.)
    onRollStart();

    // 2. Toca o som de rolagem
    diceRollSound.pause();
    diceRollSound.currentTime = 0;
    diceRollSound.play().catch(e => console.error("Erro ao tocar som:", e));

    // 3. Oculta o resultado local do DiceRoller imediatamente e desativa o brilho
    setResult(null); // Limpa o resultado anterior, garantindo que o novo apareça com a transição
    setShowResultGlow(false);

    // 4. Calcula o resultado da rolagem *agora*
    let calculatedResult = 0;
    let calculatedHistoryEntry = expr;

    try {
      const diceRegex = /(\d*)d(\d+)/g;
      let diceRolls = [];

      const processedExpression = expr.replace(diceRegex, (match, numDiceStr, numSidesStr) => {
        const numDice = numDiceStr ? parseInt(numDiceStr) : 1;
        const numSides = parseInt(numSidesStr);
        let rollSum = 0;
        let rolls = [];

        for (let i = 0; i < numDice; i++) {
          const roll = Math.floor(Math.random() * numSides) + 1;
          rolls.push(roll);
          rollSum += roll;
        }
        diceRolls.push(`${numDiceStr || '1'}d${numSides} [${rolls.join(',')}] = ${rollSum}`);
        return rollSum;
      });

      // eslint-disable-next-line no-eval
      calculatedResult = eval(processedExpression);

      if (diceRolls.length > 0) {
        calculatedHistoryEntry += ` => ${diceRolls.join(' + ')}`;
      }
      calculatedHistoryEntry += ` = ${calculatedResult}`;

    } catch (error) {
      calculatedResult = 'Erro na expressão!';
      calculatedHistoryEntry = `Erro ao rolar '${expr}'`;
    }

    // 5. Armazena o resultado e a entrada do histórico para uso posterior (após a animação)
    setCurrentRollResult(calculatedResult);
    setCurrentHistoryEntry(calculatedHistoryEntry);

    // 6. Mostra o overlay da animação
    setShowAnimationOverlay(true);

    // DURAÇÃO TOTAL da animação do Overlay:
    // entering (300ms) + rolling (25 * 50ms = 1250ms) + exiting (500ms) = 2050ms
    const overlayAnimationDuration = 2050;

    // 7. Configura um atraso para ocultar o overlay e revelar o resultado final
    setTimeout(() => {
      setShowAnimationOverlay(false); // Esconde o overlay

      // Agora que o overlay sumiu, revelamos o resultado final e ativamos o brilho
      setResult(currentRollResult); // Usa o resultado que foi calculado anteriormente
      setShowResultGlow(true); // Ativa o brilho

      // Adiciona o histórico AGORA (depois que a animação da rolagem terminou e o resultado foi exibido)
      setDiceHistory(prevHistory => [currentHistoryEntry, ...prevHistory].slice(0, 5));

      onRollEnd(); // Sinaliza que a animação global (incluindo o tremor da ficha) terminou
    }, overlayAnimationDuration);
  };

  return (
    <div className="p-6 bg-gray-700/50 rounded-lg shadow-xl border border-gray-600 backdrop-blur-sm">
      <h3 className="text-3xl font-semibold text-orange-300 mb-6">ROLAR!</h3>

      {/* Input de Expressão */}
      <div className="mb-4">
        <label htmlFor="diceExpression" className="block text-gray-400 text-sm font-bold mb-1">DIGITE A EXPRESSÃO:</label>
        <input
          type="text"
          id="diceExpression"
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
          // REMOVIDO: placeholder="Ex: 2d6+3"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') rollDice(); }}
        />
      </div>

      {/* Botão ROLAR! */}
      <button
        onClick={() => rollDice()}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-75 mb-6"
      >
        ROLAR!
      </button>

      {/* Resultado Final no DiceRoller */}
      <div
        ref={finalResultRef}
        className={`mb-6 p-4 bg-gray-900 border border-gray-700 rounded-md text-center text-4xl font-extrabold overflow-hidden
          transition-opacity duration-700 ease-in-out // Para o surgimento gradual
          ${result !== null ? 'opacity-100' : 'opacity-0'} // Controla a visibilidade
          ${showResultGlow ? 'animate-final-glow-result' : ''} // Aplica a animação de brilho e pulsação
          ${getResultColorClass(result)} // APLICA A CLASSE DE COR AQUI
        `}
      >
        {result !== null ? result : 'Resultado'}
      </div>

      {/* Histórico de Rolagens */}
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

      {/* Renderiza o overlay da animação se estiver ativo */}
      {showAnimationOverlay && (
        <RollAnimationOverlay
          onAnimationEnd={() => setShowAnimationOverlay(false)}
        />
      )}
    </div>
  );
}

export default DiceRoller;