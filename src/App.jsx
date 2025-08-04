import React, { useCallback, useMemo, Suspense, lazy } from 'react';
import { Download, Gamepad2, Loader2 } from 'lucide-react';

// Context e Providers
import { AppProvider, useAppContext } from './contexts/AppContext';
import ThemeProvider, { useTheme } from './components/ThemeProvider';
import ErrorBoundary from './components/ErrorBoundary';

// Componentes críticos (carregamento imediato)
import { ToastContainer } from './components/Toast';
import ThemeSelector from './components/ThemeSelector';

// Componentes lazy (carregamento sob demanda)
const CharacterSheet = lazy(() => import('./components/CharacterSheet'));
const DiceRoller = lazy(() => import('./components/DiceRoller'));
const TurnCounter = lazy(() => import('./components/TurnCounter'));
const AbilitiesAndSpells = lazy(() => import('./components/AbilitiesAndSpells'));
const Inventory = lazy(() => import('./components/Inventory'));
const Debuffs = lazy(() => import('./components/Debuffs'));

// Hooks customizados
import { useAnimations, useKeyboardShortcuts } from './hooks';

// Componente de Loading
const ComponentLoader = ({ className = "" }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
  </div>
);

// Logo SVG otimizado como componente
const AppLogo = React.memo(() => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path 
      d="M12 2L13.09 8.26L20 9L13.09 15.74L12 22L10.91 15.74L4 9L10.91 8.26L12 2Z" 
      fill="url(#logoGradient)" 
      stroke="#fff" 
      strokeWidth="0.5"
    />
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#f3e8ff"/>
        <stop offset="0.5" stopColor="#e879ff"/>
        <stop offset="1" stopColor="#d946ef"/>
      </linearGradient>
    </defs>
  </svg>
));

// Componente de ícone animado
const AnimatedIcon = React.memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="text-amber-400">
    <circle cx="12" cy="12" r="3" fill="currentColor">
      <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
      <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0" dur="3s" repeatCount="indefinite" />
    </circle>
  </svg>
));

// Componente de Fixed Attributes otimizado
const FixedAttributesSidebar = React.memo(({ theme, fixedAttributes, computed }) => (
  <div className={`${theme.classes.card} backdrop-blur-sm rounded-lg border ${theme.classes.cardBorder} shadow-xl sticky top-6`}>
    <div className={`p-4 border-b ${theme.classes.cardBorder}`}>
      <h3 className="font-semibold font-medieval text-amber-100 flex items-center gap-2">
        <AnimatedIcon />
        <Gamepad2 size={16} className="text-amber-400" />
        Fixed Stats
      </h3>
      {computed.hasFixedAttributes && (
        <div className="text-xs text-amber-400/60 mt-1 font-medieval">
          {fixedAttributes.length} atributo{fixedAttributes.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
    <div className="p-4 space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600/30">
      {!computed.hasFixedAttributes ? (
        <p className="text-sm text-amber-400/60 italic font-medieval">No fixed attributes</p>
      ) : (
        fixedAttributes.map((attr, index) => (
          <div 
            key={`${attr.name}-${index}`} 
            className={`p-3 ${theme.classes.input} rounded border ${theme.classes.cardBorder} hover:border-amber-600 transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="text-xs text-amber-400/60 uppercase tracking-wider font-medieval">
              {attr.name}
            </div>
            <div className={`text-lg font-bold font-medieval ${attr.color || 'text-amber-400'}`}>
              {attr.value}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
));

// Header otimizado
const AppHeader = React.memo(({ theme, onExportData }) => (
  <header className={`relative z-10 border-b ${theme.classes.cardBorder} backdrop-blur-sm ${theme.classes.card}`}>
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center gap-10">
          <div className="p-2 bg-gradient-to-r from-black-600 to-black rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
          </div>
          <div>
            <h1 className="text-5xl font-bold font-storm-gust bg-gradient-to-r from-rose-600 via-pink-100 to-pink-900 bg-clip-text text-transparent drop-shadow-lg">
            Ciclo de Doze Luas
            </h1>
            <p className="text-sm text-white font-medieval">
              System created solely for the CICLO DE DOZE LUAS
            </p>
          </div>
        </div>
        
        {/* Botões de Ação */}
        <div className="flex items-center gap-3">
          <ThemeSelector />
          
          <button
            onClick={onExportData}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white rounded-lg font-medium font-medieval transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-amber-500/30 active:scale-95"
            title="Exportar dados como JSON"
            aria-label="Exportar dados do personagem"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-sm font-medieval">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <span className="hidden sm:inline">Auto-Save Ativo</span>
            <span className="sm:hidden">Auto</span>
          </div>
        </div>
      </div>
    </div>
  </header>
));

// Background Effects otimizado
const BackgroundEffects = React.memo(({ theme }) => (
  <div className="fixed inset-0 z-1 overflow-hidden pointer-events-none">
    <div className={`absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full blur-[10rem] opacity-20 background-glow ${theme.effects.glow1} animate-pulse`}></div>
    <div className={`absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] rounded-full blur-[10rem] opacity-20 background-glow ${theme.effects.glow2} animate-pulse`} style={{ animationDelay: '1s' }}></div>
    <div className={`absolute top-[40%] right-[25%] w-[20rem] h-[20rem] rounded-full blur-[10rem] opacity-20 background-glow ${theme.effects.glow3} animate-pulse`} style={{ animationDelay: '2s' }}></div>
  </div>
));

// Footer otimizado
const AppFooter = React.memo(({ theme, computed, ui }) => (
  <footer className={`relative z-10 border-t ${theme.classes.cardBorder} mt-12 ${theme.classes.card}`}>
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className={`text-center ${theme.classes.textSecondary} text-sm`}>
        <p>Ficha RPG © 2025 - Zawt♥</p>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 space-y-1 text-xs opacity-60">
            <p>Total Items: {computed.totalInventoryItems} • Active Debuffs: {computed.activeDebuffsCount}</p>
            <p>Loading: {computed.isLoading ? 'Yes' : 'No'} • Theme: {ui.theme}</p>
          </div>
        )}
      </div>
    </div>
  </footer>
));

// Estilos CSS otimizados
const AppStyles = React.memo(() => (
  <style>{`
    /* Animações personalizadas */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
      20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
    
    @keyframes slideInUp {
      from { 
        opacity: 0; 
        transform: translateY(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }
    
    .animate-slide-in-up {
      animation: slideInUp 0.3s ease-out;
    }
    
    .will-change-transform {
      will-change: transform;
    }

    /* Scrollbar customizada */
    .scrollbar-thin {
      scrollbar-width: thin;
    }
    
    .scrollbar-thin::-webkit-scrollbar {
      width: 6px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .scrollbar-thumb-amber-600\/30::-webkit-scrollbar-thumb {
      background: rgba(217, 119, 6, 0.3);
      border-radius: 3px;
    }
    
    .scrollbar-thumb-amber-600\/30::-webkit-scrollbar-thumb:hover {
      background: rgba(217, 119, 6, 0.5);
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
      z-index: 50;
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
      
      .animate-pulse,
      .animate-bounce,
      .animate-spin {
        animation: none !important;
      }
    }

    /* Melhorias de performance */
    .theme-background {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    
    .background-glow {
      transform: translateZ(0);
      will-change: opacity;
    }
  `}</style>
));

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
    showToast,
    exportData
  } = useAppContext();
  
  const theme = useTheme();
  const { triggerShake, triggerDiceRoll } = useAnimations();
  
  // Ativar atalhos de teclado
  useKeyboardShortcuts();

  // Handlers otimizados
  const handleFixAttributesFromSheet = useCallback((newAttributes) => {
    if (!Array.isArray(newAttributes)) {
      console.error('handleFixAttributesFromSheet: newAttributes deve ser um array');
      return;
    }

    setFixedAttributes(prevFixedAttributes => {
      const attributesMap = new Map(
        prevFixedAttributes.map(attr => [attr.name, attr])
      );

      newAttributes.forEach(newAttr => {
        if (newAttr?.name) {
          attributesMap.set(newAttr.name, newAttr);
        }
      });

      return Array.from(attributesMap.values());
    });

    showToast(`${newAttributes.length} atributo(s) fixado(s)`, 'success');
  }, [setFixedAttributes, showToast]);

  const handleRollStart = useCallback(async () => {
    await triggerDiceRoll(2000);
  }, [triggerDiceRoll]);

  const handleRollEnd = useCallback(() => {
    // Callback vazio - controlado pelo triggerDiceRoll
  }, []);

  const handleExportData = useCallback(() => {
    try {
      exportData();
      showToast('Dados exportados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      showToast('Erro ao exportar dados', 'error');
    }
  }, [exportData, showToast]);

  return (
    <div className="min-h-screen text-gray-100 font-medieval antialiased">
      {/* Theme Background */}
      <div className={`theme-background ${theme.classes.background}`}></div>
      
      {/* Background Effects */}
      <BackgroundEffects theme={theme} />

      {/* Header */}
      <AppHeader theme={theme} onExportData={handleExportData} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 transition-transform duration-500">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Fixed Attributes Sidebar */}
          <aside className="col-span-12 lg:col-span-2">
            <FixedAttributesSidebar 
              theme={theme}
              fixedAttributes={fixedAttributes}
              computed={computed}
            />
            
            {/* Debuffs Section */}
            <div className="mt-6 sticky top-[28rem]">
              <Suspense fallback={<ComponentLoader />}>
                <Debuffs />
              </Suspense>
            </div>
          </aside>

          {/* Character Sheet */}
          <section className="col-span-12 lg:col-span-6">
            <Suspense fallback={<ComponentLoader className="min-h-[500px]" />}>
              <CharacterSheet
                characterData={characterData}
                setCharacterData={updateCharacterData}
                onFixAttributes={handleFixAttributesFromSheet}
              />
            </Suspense>
          </section>

          {/* Tools Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Dice Roller with Turn Counter */}
            <div className="relative">
              <Suspense fallback={<ComponentLoader />}>
                <DiceRoller 
                  onRollStart={handleRollStart} 
                  onRollEnd={handleRollEnd} 
                />
              </Suspense>
              <div className="absolute top-4 right-4 z-20">
                <Suspense fallback={<div className="w-8 h-8" />}>
                  <TurnCounter />
                </Suspense>
              </div>
            </div>

            {/* Abilities */}
            <Suspense fallback={<ComponentLoader />}>
              <AbilitiesAndSpells />
            </Suspense>

            {/* Inventory */}
            <Suspense fallback={<ComponentLoader />}>
              <Inventory 
                inventoryItems={inventoryItems} 
                setInventoryItems={setInventoryItems} 
              />
            </Suspense>
            
          </aside>
        </div>
      </main>

      {/* Footer */}
      <AppFooter theme={theme} computed={computed} ui={ui} />

      {/* Toast Container */}
      <ToastContainer />

      {/* Screen Reader Announcements */}
      <div
        id="sr-announcements"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Estilos CSS */}
      <AppStyles />
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