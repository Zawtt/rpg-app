import React, { useCallback, useMemo } from 'react';
import { Download, Gamepad2 } from 'lucide-react';

// Context e Providers
import { AppProvider, useAppContext } from './contexts/AppContext';
import ThemeProvider, { useTheme } from './components/ThemeProvider';
import ErrorBoundary from './components/ErrorBoundary';

// Componentes
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import TurnCounter from './components/TurnCounter';
import AbilitiesAndSpells from './components/AbilitiesAndSpells';
import Inventory from './components/Inventory';
import Debuffs from './components/Debuffs';
import { ToastContainer } from './components/Toast';
import ThemeSelector from './components/ThemeSelector';

// Hooks customizados
import { useAnimations, useKeyboardShortcuts } from './hooks';

// Componentes memoizados para otimização
const MemoizedCharacterSheet = React.memo(CharacterSheet);
const MemoizedAbilitiesAndSpells = React.memo(AbilitiesAndSpells);
const MemoizedInventory = React.memo(Inventory);
const MemoizedDebuffs = React.memo(Debuffs);
const MemoizedDiceRoller = React.memo(DiceRoller);
const MemoizedTurnCounter = React.memo(TurnCounter);

// Componente de conteúdo principal
function AppContent() {
  const {
    characterData,
    abilities,
    inventoryItems,
    fixedAttributes,
    debuffs,
    ui,
    computed,
    updateCharacterData,
    setAbilities,
    setInventoryItems,
    setDebuffs,
    setFixedAttributes,
    showToast
  } = useAppContext();
  
  // Obter o tema atual
  const theme = useTheme();

  // Hook para exportar dados
  const { exportData } = useAppContext();
  const { triggerShake, triggerDiceRoll } = useAnimations();
  
  
  // Ativar atalhos de teclado
  useKeyboardShortcuts();

  // Função otimizada para fixar atributos
  const handleFixAttributesFromSheet = useCallback((newAttributes) => {
    if (!Array.isArray(newAttributes)) {
      console.error('handleFixAttributesFromSheet: newAttributes deve ser um array');
      return;
    }

    setFixedAttributes(prevFixedAttributes => {
      // Usar Map para operações O(1) ao invés de findIndex O(n)
      const attributesMap = new Map(
        prevFixedAttributes.map(attr => [attr.name, attr])
      );

      // Atualizar/adicionar novos atributos
      newAttributes.forEach(newAttr => {
        if (newAttr && newAttr.name) {
          attributesMap.set(newAttr.name, newAttr);
        }
      });

      return Array.from(attributesMap.values());
    });

    showToast(`${newAttributes.length} atributo(s) fixado(s)`, 'success');
  }, [setFixedAttributes, showToast]);

  // Handlers otimizados para rolagem de dados
  const handleRollStart = useCallback(async () => {
    await triggerDiceRoll(2000);
  }, [triggerDiceRoll]);

  const handleRollEnd = useCallback(() => {
    // Callback vazio - a animação é controlada pelo triggerDiceRoll
  }, []);

  // Handler para exportar dados
  const handleExportData = useCallback(() => {
    exportData();
  }, [exportData]);

  // Memoizar componentes pesados com dependências específicas
  const memoizedCharacterSheet = useMemo(() => (
    <MemoizedCharacterSheet
      characterData={characterData}
      setCharacterData={updateCharacterData}
      onFixAttributes={handleFixAttributesFromSheet}
    />
  ), [characterData, updateCharacterData, handleFixAttributesFromSheet]);

  const memoizedAbilities = useMemo(() => (
    <MemoizedAbilitiesAndSpells />
  ), []);

  const memoizedInventory = useMemo(() => (
    <MemoizedInventory 
      inventoryItems={inventoryItems} 
      setInventoryItems={setInventoryItems} 
    />
  ), [inventoryItems, setInventoryItems]);

  const memoizedDebuffs = useMemo(() => (
    <MemoizedDebuffs />
  ), []);

  const memoizedDiceRoller = useMemo(() => (
    <MemoizedDiceRoller 
      onRollStart={handleRollStart} 
      onRollEnd={handleRollEnd} 
    />
  ), [handleRollStart, handleRollEnd]);

  return (
    <div className="min-h-screen text-gray-100 font-sans antialiased">
      {/* Theme Background */}
      <div className={`theme-background ${theme.classes.background}`}></div>
      
      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-1 overflow-hidden pointer-events-none">
        <div className={`absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full blur-[10rem] opacity-20 background-glow ${theme.effects.glow1}`}></div>
        <div className={`absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] rounded-full blur-[10rem] opacity-20 background-glow ${theme.effects.glow2}`}></div>
        <div className={`absolute top-[40%] right-[25%] w-[20rem] h-[20rem] rounded-full blur-[10rem] opacity-20 background-glow ${theme.effects.glow3}`}></div>
      </div>

      {/* Navigation Header */}
      <header className={`relative z-10 border-b ${theme.classes.cardBorder} backdrop-blur-sm ${theme.classes.card}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Título */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPgo8c3RvcCBzdG9wLWNvbG9yPSIjZjNlOGZmIi8+CjxzdG9wIG9mZnNldD0iMC41IiBzdG9wLWNvbG9yPSIjZTg3OGZmIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2Q5NDZlZiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==" 
                  alt="RPG Logo" 
                  className="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FICHA RPG
                </h1>
                <p className="text-sm text-gray-400">System created solely for the CICLO DE DOZE LUAS</p>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex items-center gap-3">
              {/* Seletor de Tema */}
              <ThemeSelector />
              
              
              {/* Botão Exportar */}
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                title="Exportar dados como JSON"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
              
              {/* Indicador de Auto-Save */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-600/20 border border-green-600/30 text-green-400 rounded-lg text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Auto-Save Ativo</span>
                <span className="sm:hidden">Auto</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-10 max-w-7xl mx-auto px-6 py-8 transition-transform duration-500 ${
        ui.isShaking ? 'animate-shake' : ''
      } main-content`}>
        <div className="grid grid-cols-12 gap-6">
          
          {/* Fixed Attributes Sidebar */}
          <aside className="col-span-12 lg:col-span-2">
            <div className={`${theme.classes.card} backdrop-blur-sm rounded-lg border ${theme.classes.cardBorder} shadow-xl sticky top-6`}>
              <div className={`p-4 border-b ${theme.classes.cardBorder}`}>
                <h3 className={`font-semibold ${theme.classes.text} flex items-center gap-2`}>
                  <Gamepad2 size={16} className={theme.classes.accent} />
                  Fixed Stats
                </h3>
                {computed.hasFixedAttributes && (
                  <div className={`text-xs ${theme.classes.textSecondary} mt-1`}>
                    {fixedAttributes.length} atributo{fixedAttributes.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {!computed.hasFixedAttributes ? (
                  <p className={`text-sm ${theme.classes.textSecondary} italic`}>No fixed attributes</p>
                ) : (
                  fixedAttributes.map((attr, index) => (
                    <div key={`${attr.name}-${index}`} className={`p-2 ${theme.classes.input} rounded border ${theme.classes.cardBorder} hover:border-gray-600 transition-colors`}>
                      <div className={`text-xs ${theme.classes.textSecondary} uppercase tracking-wider`}>
                        {attr.name}
                      </div>
                      <div className={`text-lg font-bold ${attr.color || theme.classes.accent}`}>
                        {attr.value}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Debuffs Section */}
            <div className="mt-6">
              {memoizedDebuffs}
            </div>
          </aside>

          {/* Character Sheet */}
          <section className="col-span-12 lg:col-span-6">
            {memoizedCharacterSheet}
          </section>

          {/* Tools Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Dice Roller with Turn Counter */}
            <div className="relative">
              {memoizedDiceRoller}
              <div className="absolute top-4 right-4 z-20">
                <MemoizedTurnCounter />
              </div>
            </div>

            {/* Abilities */}
            {memoizedAbilities}

            {/* Inventory */}
            {memoizedInventory}
            
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${theme.classes.cardBorder} mt-12 ${theme.classes.card}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className={`text-center ${theme.classes.textSecondary} text-sm`}>
            <p>Ficha RPG © 2025 - Zawt♥</p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 space-y-1">
                <p>Total Items: {computed.totalInventoryItems} • Active Debuffs: {computed.activeDebuffsCount}</p>
                <p>Loading: {computed.isLoading ? 'Yes' : 'No'} • Theme: {ui.theme}</p>
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Container de Toasts */}
      <ToastContainer />


      {/* Acessibilidade - Screen Reader */}
      <div
        id="sr-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* CSS customizado para animações */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .will-change-transform {
          will-change: transform;
        }

        /* Classes de acessibilidade */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Melhorias de focus para acessibilidade */
        button:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Animações reduzidas para usuários que preferem */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

// App principal com todos os providers
function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;