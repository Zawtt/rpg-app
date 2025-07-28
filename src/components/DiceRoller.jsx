import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Dices, History, Play, AlertCircle, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useValidation, useDebounce, useAccessibility } from '../hooks';
import { LoadingButton } from './LoadingSpinner';

// Sons - simulados (não funcionam em artifacts)
const playSound = (soundName) => {
  // Simular reprodução de som
  console.log(`🔊 Playing sound: ${soundName}`);
};

function DiceRoller({ onRollStart, onRollEnd }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [diceHistory, setDiceHistory] = useState([]);
  const [showAnimationOverlay, setShowAnimationOverlay] = useState(false);
  const [showResultGlow, setShowResultGlow] = useState(false);
  const [animatingResult, setAnimatingResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  const rollingRef = useRef(false);
  const finalResultRef = useRef(null);
  
  // Hooks
  const { ui, showToast, setLoading } = useAppContext();
  const { validateDiceExpression } = useValidation();
  const { announce } = useAccessibility();
  const debouncedExpression = useDebounce(expression, 500);

  // Validação em tempo real da expressão
  React.useEffect(() => {
    if (debouncedExpression.trim()) {
      const validation = validateDiceExpression(debouncedExpression);
      setValidationError(validation.isValid ? '' : validation.error);
    } else {
      setValidationError('');
    }
  }, [debouncedExpression, validateDiceExpression]);

  // Quick roll buttons memoizados
  const quickRolls = useMemo(() => [
    { label: 'd4', value: '1d4', description: 'Dado de 4 faces' },
    { label: 'd6', value: '1d6', description: 'Dado de 6 faces' },
    { label: 'd8', value: '1d8', description: 'Dado de 8 faces' },
    { label: 'd10', value: '1d10', description: 'Dado de 10 faces' },
    { label: 'd12', value: '1d12', description: 'Dado de 12 faces' },
    { label: 'd20', value: '1d20', description: 'Dado de 20 faces' },
    { label: '2d6', value: '2d6', description: '2 dados de 6 faces' },
    { label: '3d6', value: '3d6', description: '3 dados de 6 faces' }
  ], []);

  // Função para determinar cor do resultado
  const getResultColorClass = useCallback((value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'text-white';
    if (numValue === 20) return 'text-green-400';
    if (numValue === 1) return 'text-red-400';
    if (numValue >= 15) return 'text-blue-400';
    return 'text-white';
  }, []);

  // Função principal de rolagem otimizada
  const rollDice = useCallback(async (exprToRoll = expression) => {
    // Verificar se já está rolando
    if (rollingRef.current) {
      showToast('Aguarde a rolagem anterior terminar', 'warning');
      return;
    }

    // Validar expressão
    const validation = validateDiceExpression(exprToRoll);
    if (!validation.isValid) {
      showToast(validation.error, 'error');
      announce(`Erro na expressão: ${validation.error}`);
      return;
    }

    // Iniciar processo de rolagem
    rollingRef.current = true;
    setLoading({ rolling: true });
    onRollStart?.();

    // Reproduzir som
    playSound('dice_roll');

    // Limpar estados anteriores
    setResult(null);
    setShowResultGlow(false);

    let calculatedResult = 0;
    let calculatedHistoryEntry = exprToRoll;
    let errorOccurred = false;

    try {
      const diceRegex = /(\d*)d(\d+)/g;
      let diceRollsDetails = [];

      // Processar dados na expressão
      const processedExpression = exprToRoll.replace(diceRegex, (match, numDiceStr, numSidesStr) => {
        const numDice = numDiceStr ? parseInt(numDiceStr, 10) : 1;
        const numSides = parseInt(numSidesStr, 10);

        if (isNaN(numDice) || isNaN(numSides) || numSides <= 0) {
          errorOccurred = true;
          throw new Error(`Expressão inválida de dado: ${match}`);
        }

        let rollSum = 0;
        let rolls = [];
        for (let i = 0; i < numDice; i++) {
          const roll = Math.floor(Math.random() * numSides) + 1;
          rolls.push(roll);
          rollSum += roll;
        }
        
        diceRollsDetails.push(`${numDice}d${numSides} [${rolls.join(', ')}]`);
        return rollSum;
      });

      // Validar expressão processada
      const safeProcessedExpression = processedExpression.replace(/\s/g, '');
      if (!/^[0-9+\-*/().]+$/.test(safeProcessedExpression)) {
        errorOccurred = true;
        throw new Error('Expressão contém caracteres inválidos após processamento dos dados.');
      }

      // Calcular resultado final
      calculatedResult = new Function('return ' + safeProcessedExpression)();

      // Preparar entrada do histórico
      calculatedHistoryEntry = exprToRoll;
      if (diceRollsDetails.length > 0) {
        calculatedHistoryEntry += ` (${diceRollsDetails.join(' + ')})`;
      }
      calculatedHistoryEntry += ` = ${calculatedResult}`;

      // Anunciar resultado para leitores de tela
      announce(`Resultado da rolagem: ${calculatedResult}`);

    } catch (error) {
      console.error("Erro ao processar expressão de rolagem:", error);
      calculatedResult = 'Erro na Expressão!';
      calculatedHistoryEntry = `Erro ao rolar '${exprToRoll}': ${error.message}`;
      errorOccurred = true;
      
      showToast('Erro ao processar rolagem', 'error');
      announce(`Erro na rolagem: ${error.message}`);
    }

    // Mostrar animação
    setAnimatingResult(calculatedResult);
    setShowAnimationOverlay(true);

    // Simular delay de animação
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Finalizar animação
    setShowAnimationOverlay(false);
    
    setTimeout(() => {
      setResult(calculatedResult);
      setAnimatingResult(null);
      setShowResultGlow(true);
      
      // Adicionar ao histórico apenas se não houve erro
      if (!errorOccurred) {
        setDiceHistory(prevHistory => [calculatedHistoryEntry, ...prevHistory].slice(0, 10));
      }
      
      // Cleanup
      rollingRef.current = false;
      setLoading({ rolling: false });
      onRollEnd?.();
      
      // Som de pouso
      playSound('dice_land');
      
      // Remover glow após um tempo
      setTimeout(() => setShowResultGlow(false), 2000);
      
    }, 100);

  }, [expression, validateDiceExpression, showToast, announce, setLoading, onRollStart, onRollEnd]);

  // Handler para rolagem rápida
  const handleQuickRoll = useCallback((diceValue) => {
    setExpression(diceValue);
    rollDice(diceValue);
  }, [rollDice]);

  // Limpar histórico
  const clearHistory = useCallback(() => {
    if (window.confirm('Deseja limpar todo o histórico de rolagens?')) {
      setDiceHistory([]);
      showToast('Histórico limpo', 'success');
      announce('Histórico de rolagens limpo');
    }
  }, [showToast, announce]);

  // Handler para input da expressão
  const handleExpressionChange = useCallback((e) => {
    const value = e.target.value;
    // Limitar tamanho da entrada
    if (value.length <= 100) {
      setExpression(value);
    }
  }, []);

  // Handler para tecla Enter
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !rollingRef.current) {
      e.preventDefault();
      rollDice();
    }
  }, [rollDice]);

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden">
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
            Expressão de Dados
            <span className="text-gray-500 normal-case ml-2">(Ex: 2d6+3, 1d20+5)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={handleExpressionChange}
              onKeyPress={handleKeyPress}
              disabled={ui.loading.rolling}
              className={`
                w-full px-4 py-3 rounded text-gray-100 focus:outline-none focus:ring-2 transition-all duration-200 text-sm pr-12
                ${validationError 
                  ? 'bg-red-950/50 border-2 border-red-500 focus:ring-red-500' 
                  : 'bg-gray-800 border border-gray-700 focus:border-orange-500 focus:ring-orange-500'
                }
                ${ui.loading.rolling ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              placeholder="2d6+3, 1d20, 4d8+2..."
              maxLength={100}
              aria-invalid={validationError ? 'true' : 'false'}
              aria-describedby={validationError ? 'expression-error' : 'expression-help'}
            />
            
            <button
              onClick={() => rollDice()}
              disabled={ui.loading.rolling || validationError !== ''}
              className={`
                absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded transition-all duration-200
                ${ui.loading.rolling || validationError
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-orange-600 hover:bg-orange-700 hover:scale-105'
                }
                text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50
              `}
              aria-label="Rolar dados"
            >
              <Play size={16} />
            </button>
          </div>
          
          {/* Mensagem de ajuda */}
          <div id="expression-help" className="text-xs text-gray-500 mt-1">
            {expression.length}/100 caracteres • Pressione Enter ou clique em ▶ para rolar
          </div>
          
          {/* Erro de validação */}
          {validationError && (
            <div 
              id="expression-error"
              className="flex items-center gap-2 mt-2 text-red-400 text-sm"
              role="alert"
            >
              <AlertCircle size={16} />
              {validationError}
            </div>
          )}
        </div>

        {/* Quick Roll Buttons */}
        <div>
          <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Rolagens Rápidas
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickRolls.map((dice) => (
              <button
                key={dice.value}
                onClick={() => handleQuickRoll(dice.value)}
                disabled={ui.loading.rolling}
                className={`
                  px-3 py-2 border rounded text-sm font-medium transition-all duration-200
                  ${ui.loading.rolling 
                    ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50' 
                    : 'bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white hover:scale-105'
                  }
                  focus:outline-none focus:ring-2 focus:ring-orange-500/50
                `}
                title={dice.description}
                aria-label={`Rolar ${dice.description}`}
              >
                {dice.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Roll Button */}
        <LoadingButton
          onClick={() => rollDice()}
          loading={ui.loading.rolling}
          loadingText="ROLANDO..."
          loadingType="dice"
          disabled={validationError !== ''}
          className={`
            w-full py-4 font-bold rounded-lg shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500/50
            ${validationError 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 hover:scale-[1.02] text-white'
            }
          `}
          aria-label="Rolar dados com a expressão atual"
        >
          <div className="flex items-center justify-center gap-2">
            <Dices size={20} />
            ROLL DICE
          </div>
        </LoadingButton>

        {/* Result Display */}
        <div
          ref={finalResultRef}
          className={`
            p-6 bg-gray-800/80 border border-gray-700 rounded-lg text-center transition-all duration-700 ease-in-out
            ${result !== null ? 'opacity-100 transform scale-100' : 'opacity-30 transform scale-95'}
            ${showResultGlow ? 'ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/20' : ''}
          `}
          role="status"
          aria-live="polite"
        >
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
            Resultado
          </div>
          <div className={`text-4xl font-extrabold transition-colors duration-300 ${getResultColorClass(result)}`}>
            {result !== null ? result : '?'}
          </div>
          {result !== null && typeof result === 'number' && (
            <div className="text-xs text-gray-500 mt-2">
              {result === 1 && '💀 Falha Crítica!'}
              {result === 20 && '🎉 Sucesso Crítico!'}
              {result >= 15 && result < 20 && '✨ Excelente!'}
              {result >= 10 && result < 15 && '👍 Bom resultado'}
              {result < 10 && result > 1 && '😐 Resultado médio'}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
                Histórico de Rolagens
              </h4>
              <span className="text-xs text-gray-500">
                ({diceHistory.length}/10)
              </span>
            </div>
            {diceHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded px-2 py-1"
                aria-label="Limpar histórico de rolagens"
              >
                <Trash2 size={12} />
                Limpar
              </button>
            )}
          </div>
          <div className="p-4 max-h-48 overflow-y-auto">
            {diceHistory.length === 0 ? (
              <p className="text-gray-500 italic text-sm text-center py-4">
                Nenhuma rolagem realizada ainda
              </p>
            ) : (
              <ul className="space-y-2" role="log" aria-label="Histórico de rolagens">
                {diceHistory.map((entry, index) => (
                  <li 
                    key={`${entry}-${index}`}
                    className={`
                      text-gray-400 text-sm font-mono bg-gray-900/50 p-3 rounded border-l-2 transition-all duration-200
                      ${index === 0 
                        ? 'border-orange-500/50 bg-orange-500/5' 
                        : 'border-gray-600/30 hover:border-gray-500/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{entry}</span>
                      {index === 0 && (
                        <span className="text-xs text-orange-400 font-bold ml-2">
                          ÚLTIMO
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Animação de Overlay Central */}
      {showAnimationOverlay && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <div className="text-8xl font-extrabold text-white animate-bounce-slow mb-4 filter drop-shadow-lg">
              {animatingResult}
            </div>
            <div className="text-xl text-gray-300 animate-pulse">
              🎲 Rolando dados...
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.6s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Animação de Movimento do Resultado */}
      {animatingResult !== null && !showAnimationOverlay && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div className="animate-move-to-result text-4xl font-extrabold text-white flex items-center justify-center h-full filter drop-shadow-lg">
            {animatingResult}
          </div>
        </div>
      )}

      {/* CSS customizado para animações */}
      <style jsx>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: scale(0.9);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { 
            transform: translateY(0) scale(1);
          }
          50% { 
            transform: translateY(-20px) scale(1.05);
          }
        }
        
        @keyframes move-to-result {
          from {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 1;
          }
          to {
            transform: translate(0, 150px) scale(1);
            opacity: 0;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }
        
        .animate-move-to-result {
          position: absolute;
          top: 50%;
          left: 50%;
          animation: move-to-result 1s ease-out forwards;
        }

        /* Pulse animation para loading states */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(251, 146, 60, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(251, 146, 60, 0.8);
          }
        }

        /* Melhorias de acessibilidade */
        @media (prefers-reduced-motion: reduce) {
          .animate-bounce-slow,
          .animate-move-to-result,
          .animate-fade-in {
            animation: none !important;
          }
          
          * {
            transition-duration: 0.1s !important;
          }
        }

        /* Hover effects aprimorados */
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* Custom scrollbar para histórico */
        .p-4.max-h-48.overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .p-4.max-h-48.overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }

        .p-4.max-h-48.overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.5);
          border-radius: 4px;
        }

        .p-4.max-h-48.overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.7);
        }
      `}</style>
    </div>
  );
}

export default React.memo(DiceRoller);