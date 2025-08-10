import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Dices, History, Play, AlertCircle, Trash2 } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from './ThemeProvider';
import { useValidation, useDebounce, useAccessibility, useSounds } from '../hooks';
import { LoadingButton } from './LoadingSpinner';

// 🎲 NOVO GERADOR SUPER SIMPLES E EFICAZ
class TrueRandomGenerator {
  constructor() {
    // Pool de entropia que será constantemente atualizado
    this.entropyPool = new Uint32Array(16);
    this.poolIndex = 0;
    this.lastTime = performance.now();
    
    // Inicializar pool com crypto random
    this.refillEntropyPool();
    
    // Coletar entropia do mouse/teclado
    this.setupEntropyCollection();
  }
  
  // Recarregar pool de entropia com crypto.getRandomValues
  refillEntropyPool() {
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(this.entropyPool);
    } else {
      // Fallback para sistemas sem crypto API
      for (let i = 0; i < this.entropyPool.length; i++) {
        this.entropyPool[i] = Math.floor(Math.random() * 0xFFFFFFFF);
      }
    }
    this.poolIndex = 0;
  }
  
  // Coletar entropia adicional do usuário
  setupEntropyCollection() {
    let mouseEntropy = 0;
    
    const addEntropy = (e) => {
      const now = performance.now();
      const timeDelta = now - this.lastTime;
      this.lastTime = now;
      
      // Misturar posição do mouse + tempo + delta de tempo
      mouseEntropy = (mouseEntropy + e.clientX + e.clientY + timeDelta) % 0xFFFFFFFF;
      
      // Adicionar ao pool ocasionalmente
      if (Math.random() < 0.1) { // 10% das vezes
        this.entropyPool[this.poolIndex] ^= mouseEntropy;
        this.poolIndex = (this.poolIndex + 1) % this.entropyPool.length;
      }
    };
    
    window.addEventListener('mousemove', addEntropy, { passive: true });
    window.addEventListener('click', addEntropy, { passive: true });
    window.addEventListener('keydown', addEntropy, { passive: true });
  }
  
  // Gerar próximo número aleatório
  next() {
    // Recarregar pool se necessário
    if (this.poolIndex >= this.entropyPool.length - 1) {
      this.refillEntropyPool();
    }
    
    // Pegar valor do pool
    let value = this.entropyPool[this.poolIndex++];
    
    // Adicionar entropia extra do tempo atual
    const timeEntropy = performance.now() * 1000000; // Microsegundos
    value ^= Math.floor(timeEntropy) % 0xFFFFFFFF;
    
    // Aplicar hash simples para quebrar padrões
    value = this.simpleHash(value);
    
    // Normalizar para [0, 1)
    return (value >>> 0) / 0x100000000;
  }
  
  // Hash simples para quebrar padrões
  simpleHash(x) {
    x = ((x >>> 16) ^ x) * 0x45d9f3b;
    x = ((x >>> 16) ^ x) * 0x45d9f3b;
    x = (x >>> 16) ^ x;
    return x;
  }
  
  // Rolar dado de N lados
  rollDice(sides) {
    // Usar rejection sampling para distribuição uniforme perfeita
    const max = Math.floor(0x100000000 / sides) * sides;
    let value;
    
    do {
      value = Math.floor(this.next() * 0x100000000);
    } while (value >= max);
    
    return (value % sides) + 1;
  }
}

// ✅ Parser seguro para expressões matemáticas (mantido igual)
const safeEvaluateExpression = (expression) => {
  try {
    const cleanExpr = expression.replace(/\s/g, '');
    
    if (!/^[0-9+\-*/().]+$/.test(cleanExpr)) {
      throw new Error('Expressão contém caracteres não permitidos');
    }
    
    const tokens = cleanExpr.match(/(\d+\.?\d*|[+\-*/()])/g);
    if (!tokens) throw new Error('Expressão inválida');
    
    return evaluateTokens(tokens);
  } catch (error) {
    throw new Error(`Erro ao avaliar expressão: ${error.message}`);
  }
};

const evaluateTokens = (tokens) => {
  const outputQueue = [];
  const operatorStack = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
  
  for (let token of tokens) {
    if (/^\d+\.?\d*$/.test(token)) {
      outputQueue.push(parseFloat(token));
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop();
    } else if (['+', '-', '*', '/'].includes(token)) {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    }
  }
  
  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }
  
  const stack = [];
  for (let token of outputQueue) {
    if (typeof token === 'number') {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) throw new Error('Divisão por zero');
          stack.push(a / b);
          break;
        default: throw new Error(`Operador desconhecido: ${token}`);
      }
    }
  }
  
  return Math.round(stack[0] * 100) / 100;
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
  
  // 🎲 NOVO GERADOR SIMPLES E EFICAZ
  const randomGenerator = useMemo(() => new TrueRandomGenerator(), []);
  
  // Hooks
  const { ui, showToast, setLoading } = useAppContext();
  const { validateDiceExpression } = useValidation();
  const { announce } = useAccessibility();
  const { playDiceRollSound, playDiceLandSound } = useSounds();
  const debouncedExpression = useDebounce(expression, 500);
  const theme = useTheme();

  useEffect(() => {
    return () => {
      rollingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (debouncedExpression.trim()) {
      const validation = validateDiceExpression(debouncedExpression);
      setValidationError(validation.isValid ? '' : validation.error);
    } else {
      setValidationError('');
    }
  }, [debouncedExpression, validateDiceExpression]);

  const quickRolls = [
    { label: '1d2', value: '1d2', description: 'Sim ou não' },
    { label: '1d20', value: '1d20', description: 'D20 clássico' },
    { label: '1d50', value: '1d50', description: 'Desafio médio' },
    { label: '1d100', value: '1d100', description: 'Percentual' },
  ];

  const getResultColorClass = useCallback((value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'text-white';
    if (numValue === 20) return 'text-green-400';
    if (numValue === 1) return 'text-red-400';
    if (numValue >= 15) return 'text-blue-400';
    return 'text-white';
  }, []);

  // 🎲 FUNÇÃO PRINCIPAL ATUALIZADA COM NOVO GERADOR
  const rollDice = useCallback(async (exprToRoll = expression) => {
    if (rollingRef.current) {
      showToast('Aguarde a rolagem anterior terminar', 'warning');
      return;
    }

    const validation = validateDiceExpression(exprToRoll);
    if (!validation.isValid) {
      showToast(validation.error, 'error');
      announce(`Erro na expressão: ${validation.error}`);
      return;
    }

    rollingRef.current = true;
    setLoading({ rolling: true });
    onRollStart?.();
    playDiceRollSound();
    setResult(null);
    setShowResultGlow(false);

    let calculatedResult = 0;
    let calculatedHistoryEntry = exprToRoll;
    let errorOccurred = false;

    try {
      const diceRegex = /(\d*)d(\d+)/gi;
      let diceRollsDetails = [];
      
      // 🎲 USAR NOVO GERADOR AQUI
      const processedExpression = exprToRoll.replace(diceRegex, (match, numDiceStr, numSidesStr) => {
        const numDice = numDiceStr ? parseInt(numDiceStr, 10) : 1;
        const numSides = parseInt(numSidesStr, 10);

        if (isNaN(numDice) || isNaN(numSides) || numSides <= 0) {
          errorOccurred = true;
          throw new Error(`Expressão inválida de dado: ${match}`);
        }

        let rollSum = 0;
        let rolls = [];
        
        // ✨ AQUI ESTÁ A MÁGICA: Novo gerador super simples
        for (let i = 0; i < numDice; i++) {
          const roll = randomGenerator.rollDice(numSides);
          rolls.push(roll);
          rollSum += roll;
        }
        
        diceRollsDetails.push(`${numDice}d${numSides} [${rolls.join(', ')}]`);
        return rollSum;
      });

      const safeProcessedExpression = processedExpression.replace(/\s/g, '');
      if (!/^[0-9+\-*/().]+$/.test(safeProcessedExpression)) {
        errorOccurred = true;
        throw new Error('Expressão contém caracteres inválidos após processamento dos dados.');
      }

      calculatedResult = safeEvaluateExpression(safeProcessedExpression);

      calculatedHistoryEntry = exprToRoll;
      if (diceRollsDetails.length > 0) {
        calculatedHistoryEntry += ` (${diceRollsDetails.join(' + ')})`;  
      }
      calculatedHistoryEntry += ` = ${calculatedResult}`;

      announce(`Resultado da rolagem: ${calculatedResult}`);

    } catch (error) {
      console.error("Erro ao processar expressão de rolagem:", error);
      calculatedResult = 'Erro na Expressão!';
      calculatedHistoryEntry = `Erro ao rolar '${exprToRoll}': ${error.message}`;
      errorOccurred = true;
      
      showToast('Erro ao processar rolagem', 'error');
      announce(`Erro na rolagem: ${error.message}`);
    }

    // Animação de rolagem
    setAnimatingResult('?');
    setShowAnimationOverlay(true);
    
    const animationDuration = 2000;
    const updateInterval = 100;
    const startTime = Date.now();
    
    const generateRandomNumber = () => {
      if (!isNaN(calculatedResult) && typeof calculatedResult === 'number') {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
        
        const randomFactor = 1 - progress;
        const min = Math.max(1, Math.floor(calculatedResult * (1 - randomFactor * 3)));
        const max = Math.ceil(calculatedResult * (1 + randomFactor * 3));
        
        // ✨ USAR NOVO GERADOR PARA ANIMAÇÃO TAMBÉM
        const animationRange = max - min + 1;
        return min + randomGenerator.rollDice(animationRange) - 1;
      }
      
      return calculatedResult;
    };
    
    const animationInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      setAnimatingResult(generateRandomNumber());
      
      if (elapsedTime >= animationDuration - updateInterval) {
        clearInterval(animationInterval);
        setAnimatingResult(calculatedResult);
      }
    }, updateInterval);

    await new Promise(resolve => setTimeout(resolve, animationDuration));

    clearInterval(animationInterval);
    setShowAnimationOverlay(false);
    
    setTimeout(() => {
      setResult(calculatedResult);
      setAnimatingResult(null);
      setShowResultGlow(true);
      
      if (!errorOccurred) {
        setDiceHistory(prevHistory => [calculatedHistoryEntry, ...prevHistory].slice(0, 10));
      }
      
      rollingRef.current = false;
      setLoading({ rolling: false });
      onRollEnd?.();
      playDiceLandSound();
      
      setTimeout(() => setShowResultGlow(false), 2000);
      
    }, 100);

  }, [expression, validateDiceExpression, showToast, announce, setLoading, onRollStart, onRollEnd, playDiceRollSound, playDiceLandSound, randomGenerator]);

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

  // ✅ REMOVER COMPLETAMENTE ESTA FUNÇÃO COMENTADA
  // // ✅ NOVA FUNÇÃO: Teste de qualidade do gerador
  // // const testGeneratorQuality = useCallback(() => {
  // //   const testResult = hybridGenerator.testDistribution(20, 5000);
  // //   const qualityPercentage = testResult.qualityScore.toFixed(1);
  // //   
  // //   showToast(
  // //     `Qualidade do gerador: ${qualityPercentage}% (Desvio médio: ${testResult.avgDeviation.toFixed(1)})`,
  // //     testResult.qualityScore > 90 ? 'success' : testResult.qualityScore > 70 ? 'warning' : 'error'
  // //   );
  // //   
  // //   console.log('Teste de Qualidade do Gerador Híbrido:', testResult);
  // // }, [hybridGenerator, showToast]);

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-storm-gust text-white flex items-center gap-3">
              <Dices size={24} className="text-white" />
              DICE ROLLER
            </h3>
            <div className="w-20 h-0.5 bg-amber-500 mt-2"></div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Expression Input */}
        <div>
          <label className="block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
            Rolagens de Dados
          </label>
          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={handleExpressionChange}
              onKeyPress={handleKeyPress}
              disabled={ui.loading.rolling}
              className={`
                w-full px-4 py-3 rounded font-medieval text-amber-100 bg-gray-800/80 border border-amber-600/50 focus:outline-none focus:ring-2 transition-all duration-200 text-sm pr-12 placeholder-amber-400/60
                ${validationError 
                  ? 'bg-red-950/50 border-2 border-red-500 focus:ring-red-500' 
                  : 'focus:border-amber-500 focus:ring-amber-500'
                }
                ${ui.loading.rolling ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              placeholder="Ex: 1d20+5, 2d6+3, 3d8"
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
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-105'
                }
                text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50
              `}
              aria-label="Rolar dados"
            >
              <Play size={16} />
            </button>
          </div>
          
          <div id="expression-help" className="text-xs font-medieval text-amber-300/80 mt-1">
          </div>
          
          {validationError && (
            <div 
              id="expression-error"
              className="flex items-center gap-2 mt-2 text-red-400 text-sm"
              role="alert"
            >
              <AlertCircle size={16} className="text-red-400" />
              <span>Expressão inválida: {validationError}</span>
            </div>
          )}
        </div>

        {/* Quick Roll Buttons */}
        <div>
          <label className="block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
            Rolagens Rápidas
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickRolls.map((dice) => (
              <button
                key={dice.value}
                onClick={() => handleQuickRoll(dice.value)}
                disabled={ui.loading.rolling}
                className={`
                  px-3 py-2 border rounded text-sm font-medieval font-medium transition-all duration-200
                  ${ui.loading.rolling 
                    ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed opacity-50' 
                    : 'bg-gray-800/80 border-amber-600/50 text-amber-100 hover:bg-amber-900/50 hover:border-amber-500 hover:text-amber-50 hover:scale-105'
                  }
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
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
            w-full py-4 font-medieval font-bold rounded-lg shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-500/50
            ${validationError 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:scale-[1.02] text-white'
            }
          `}
          aria-label="Rolar dados com a expressão atual"
        >
          <div className="flex items-center justify-center gap">
            <Dices size={30} />
            <span className="text-sm"></span>
          </div>
        </LoadingButton>

        {/* Result Display */}
        <div
          ref={finalResultRef}
          className={`
            p-6 ${theme.classes.card} border ${theme.classes.cardBorder} rounded-lg text-center transition-all duration-700 ease-in-out relative overflow-hidden
            ${result !== null ? 'opacity-100 transform scale-100' : 'opacity-30 transform scale-95'}
            ${showResultGlow ? 'ring-4 shadow-xl' : ''}
          `}
          style={{
            boxShadow: showResultGlow ? `0 0 20px var(--theme-dice-shadow)` : 'none',
            borderColor: showResultGlow ? `var(--theme-dice-color)` : 'rgb(55, 65, 81)'
          }}
          role="status"
          aria-live="polite"
        >
          {showResultGlow && (
            <div 
              className="absolute inset-0 opacity-10 dice-animation" 
              style={{ 
                background: `radial-gradient(circle, var(--theme-dice-color) 0%, transparent 70%)`,
              }}
            />
          )}
          
          <div className="text-xs font-medieval text-amber-400 uppercase tracking-wider mb-2 relative z-10">
            RESULTADO
          </div>
          <div 
            className={`dice-result text-5xl font-extrabold transition-all duration-500 relative z-10 ${showResultGlow ? 'dice-animation' : ''}`}
            style={{
              textShadow: showResultGlow ? '0 0 10px var(--theme-dice-shadow)' : 'none'
            }}
          >
            {result !== null ? result : '?'}
          </div>
          {result !== null && typeof result === 'number' && (
            <div className={`text-sm font-medieval text-amber-300 mt-1 relative z-10 font-medium`}>
              {result === 1 && 'nah bro💀'}
              {result === 20 && '🎉CRITICO🎉'}
              {result >= 15 && result < 20 && 'Boa!!!'}
              {result >= 10 && result < 15 && 'Boa'}
              {result < 10 && result > 1 && 'bruh'}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className={`${theme.classes.card} border ${theme.classes.cardBorder} rounded-lg`}>
          <div className={`p-4 border-b ${theme.classes.cardBorder} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <History size={16} className={theme.classes.textSecondary} />
              <h3 className="text-2xl font-storm-gust text-white-100 flex items-center gap-3">Histórico</h3>
              <span className={`text-xs ${theme.classes.textSecondary}`}>
                ({diceHistory.length}/10)
              </span>
            </div>
            {diceHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className={`flex items-center gap-1 text-xs ${theme.classes.textSecondary} hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 rounded px-2 py-1`}
                aria-label="Limpar histórico de rolagens"
              >
                <Trash2 size={12} />
                Limpar
              </button>
            )}
          </div>
          <div className="p-4 max-h-48 overflow-y-auto custom-scrollbar">
            {diceHistory.length === 0 ? (
              <p className={`${theme.classes.textSecondary} italic text-sm text-center py-4`}>
                Nenhuma Rolagem ainda
              </p>
            ) : (
              <ul className="space-y-2" role="log" aria-label="Histórico">
                {diceHistory.map((entry, index) => (
                  <li 
                    key={`${entry}-${index}`}
                    className={`
                      ${theme.classes.textSecondary} text-sm font-mono ${theme.classes.input} p-3 rounded border-l-2 transition-all duration-200
                      ${index === 0 
                        ? 'border-orange-500/50 bg-orange-500/5' 
                        : `${theme.classes.cardBorder} hover:border-gray-500/50`
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
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-40 animate-fade-in">
          <div className="text-center relative">
            {/* Efeito de brilho por trás do número */}
            <div className="absolute inset-0 blur-2xl opacity-70 dice-animation" 
                 style={{ 
                   backgroundColor: 'rgba(0,0,0,0.5)',
                   boxShadow: '0 0 40px var(--theme-dice-shadow), 0 0 80px var(--theme-dice-shadow)'
                 }}>
            </div>
            
            {/* Número principal */}
            <div className="dice-result text-9xl font-extrabold mb-6 relative z-10 dice-animation"
                 style={{ 
                   textShadow: '0 0 20px var(--theme-dice-shadow), 0 0 40px var(--theme-dice-shadow)'
                 }}>
              {animatingResult}
            </div>
            
            {/* Texto de rolagem */}
            <div className="text-xl text-gray-300 animate-pulse relative z-10">
              Boa sorte
            </div>
            
            {/* Indicadores de carregamento */}
            <div className="mt-6 flex justify-center space-x-3 relative z-10">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.6s',
                    backgroundColor: ['#4ecdc4', '#44a08d', '#ff6b6b', '#f59e0b', '#8b5cf6'][i],
                    boxShadow: `0 0 10px ${['#4ecdc4', '#44a08d', '#ff6b6b', '#f59e0b', '#8b5cf6'][i]}`
                  }}
                />
              ))}
            </div>
            
            {/* Indicador de fontes ativas */}
            <div className="mt-4 text-xs text-gray-400 relative z-10">
              <div className="flex justify-center space-x-4">
                <span className="text-green-400">🔐 Crypto</span>
                <span className="text-blue-400">⚡ XorShift</span>
                <span className="text-purple-400">🖱️ Mouse</span>
                <span className="text-yellow-400">⏰ Time</span>
                <span className="text-red-400">🎲 LCG</span>
              </div>
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
      <style>{`
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
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
          }
        }
        
        @keyframes hybrid-glow {
          0%, 100% {
            box-shadow: 0 0 10px #4ecdc4, 0 0 20px #4ecdc4, 0 0 30px #4ecdc4;
          }
          25% {
            box-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff6b6b, 0 0 30px #ff6b6b;
          }
          50% {
            box-shadow: 0 0 10px #f59e0b, 0 0 20px #f59e0b, 0 0 30px #f59e0b;
          }
          75% {
            box-shadow: 0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6;
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
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.7);
        }

        /* Animação para dados */
        .dice-animation {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .dice-result {
          color: var(--theme-dice-color, #f59e0b);
        }
      `}</style>
    </div>
  );
}

export default React.memo(DiceRoller);