import React, { useState } from 'react';
import { Palette, Check, X, Sparkles } from 'lucide-react';
import { themes, useTheme } from './ThemeProvider';
import { useAppContext } from '../contexts/AppContext';
import '../index.css'; // Ensure we have access to global styles

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { ui, dispatch } = useAppContext();
  const currentTheme = ui.theme || 'dark';
  const theme = useTheme();

  const handleThemeChange = (themeName) => {
    dispatch({ type: 'SET_THEME', payload: themeName });
    console.log(`Tema alterado para ${themes[themeName].name}`);
    setIsOpen(false);
  };

  // Adicionar suporte para tecla Escape
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Cores de preview para cada tema
  const themePreviewColors = {
    dark: 'from-gray-800 to-blue-600',
    cyberpunk: 'from-cyan-600 to-purple-600',
    medieval: 'from-amber-700 to-yellow-600',
    nature: 'from-emerald-700 to-teal-600',
    fire: 'from-red-700 to-orange-600',
    ice: 'from-blue-700 to-cyan-600',
    cosmic: 'from-indigo-700 to-violet-600',
    retro: 'from-fuchsia-700 to-pink-600'
  };

  return (
    <div className="theme-selector-wrapper">
      {/* Botão para abrir seletor */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          theme-button flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 
          shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
          ${theme.classes.button} ${theme.classes.text}
        `}
        aria-label="Seletor de Temas"
      >
        <Palette size={16} />
        <span className="hidden sm:inline">Tema</span>
      </button>

      {/* Modal/Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="theme-overlay"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal de Seleção */}
          <div className="theme-dropdown" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                  <Palette size={20} />
                  Escolher Tema
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="theme-close-btn p-1 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Personalize a aparência da sua ficha
              </p>
            </div>

            {/* Lista de Temas */}
            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`
                      theme-option p-3 rounded-lg border-2 transition-all duration-300 text-left
                      hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50
                      ${currentTheme === key 
                        ? `border-${theme.dice.color.split('-')[1]} bg-${theme.dice.color.split('-')[1]}/10` 
                        : 'border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {/* Preview colorido */}
                          <div 
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${themePreviewColors[key]} shadow-lg`}
                            style={{
                              boxShadow: currentTheme === key ? `0 0 10px var(--theme-dice-shadow)` : 'none'
                            }}
                          />
                          
                          <div>
                            <h4 className="font-medium text-gray-100 flex items-center gap-1">
                              {theme.name}
                              {key === currentTheme && (
                                <Sparkles size={14} className={theme.dice.color} />
                              )}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {theme.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Indicador de seleção */}
                      {currentTheme === key && (
                        <div className={theme.dice.color}>
                          <Check size={20} />
                        </div>
                      )}
                    </div>
                    
                    {/* Preview da paleta */}
                    <div className="flex gap-1 mt-3">
                      {Object.values(theme.effects).map((effectClass, index) => (
                        <div 
                          key={index}
                          className={`h-2 rounded-full flex-1 ${effectClass.split(' ')[0]} ${currentTheme === key ? effectClass.split(' ')[2] || '' : ''}`}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer com informações */}
            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <div className="text-xs text-gray-400 space-y-1">
                <p className="flex items-center gap-1">
                  <span className="font-medium">Tema Atual:</span> 
                  {theme.name}
                </p>
                <p>
                  As alterações são aplicadas imediatamente
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .theme-selector-wrapper {
          position: relative;
          z-index: 1000;
          isolation: isolate;
        }

        .theme-button {
          position: relative;
          z-index: 1001;
        }

        .theme-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1002;
        }

        .theme-dropdown {
          position: fixed;
          top: 60px;
          right: 20px;
          width: 320px;
          max-width: 90vw;
          max-height: 384px;
          overflow-y: auto;
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgb(55, 65, 81);
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          z-index: 1003;
          animation: theme-dropdown-in 0.2s ease-out;
          transform-origin: top right;
        }

        .theme-close-btn {
          position: relative;
          z-index: 1004;
        }

        .theme-option {
          position: relative;
          z-index: 1004;
        }

        @keyframes theme-dropdown-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Garantir que o dropdown não seja cortado */
        .theme-selector-wrapper * {
          overflow: visible;
        }

        /* Media query para telas pequenas */
        @media (max-width: 640px) {
          .theme-dropdown {
            left: 50%;
            right: auto;
            transform: translateX(-50%);
            width: calc(100vw - 32px);
            max-width: 320px;
          }
        }

        /* Fix para z-index em diferentes contextos */
        .theme-dropdown {
          isolation: isolate;
        }

        /* Prevent backdrop blur conflicts */
        .theme-dropdown * {
          backdrop-filter: none;
        }

        /* Garantir que o dropdown fique sempre visível */
        .theme-selector-wrapper .theme-dropdown {
          z-index: 1003 !important;
        }

        /* Adicionar suporte para tecla Escape */
        .theme-dropdown:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ThemeSelector;