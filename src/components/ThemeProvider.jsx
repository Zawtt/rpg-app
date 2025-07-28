import React from 'react';
import { useAppContext } from '../contexts/AppContext';

// ✅ CORREÇÃO: Definição dos temas movida para dentro do arquivo (não exportada)
const themes = {
  dark: {
    name: 'Dark Knight',
    description: 'Tema escuro clássico',
    classes: {
      background: 'bg-gradient-to-br from-black via-gray-950 to-black',
      card: 'bg-gray-900/90',
      cardBorder: 'border-gray-800',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      accent: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
      input: 'bg-gray-900 border-gray-600',
      overlay: 'bg-black/70'
    },
    effects: {
      glow1: 'bg-blue-500/3',
      glow2: 'bg-purple-500/3',
      glow3: 'bg-indigo-500/3'
    }
  },
  
  cyberpunk: {
    name: 'Cyberpunk 2077',
    description: 'Futuro neon vibrante',
    classes: {
      background: 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20',
      card: 'bg-gray-900/95 backdrop-blur-lg',
      cardBorder: 'border-cyan-500/30',
      text: 'text-cyan-100',
      textSecondary: 'text-cyan-400/70',
      accent: 'text-cyan-400',
      button: 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700',
      input: 'bg-gray-900/80 border-cyan-500/30',
      overlay: 'bg-black/80'
    },
    effects: {
      glow1: 'bg-cyan-500/10 shadow-cyan-500/20',
      glow2: 'bg-purple-500/10 shadow-purple-500/20',
      glow3: 'bg-pink-500/10 shadow-pink-500/20'
    }
  },
  
  medieval: {
    name: 'Medieval Fantasy',
    description: 'Era dourada medieval',
    classes: {
      background: 'bg-gradient-to-br from-amber-900/20 via-stone-900 to-yellow-900/20',
      card: 'bg-amber-950/90 backdrop-blur-sm',
      cardBorder: 'border-amber-700/50',
      text: 'text-amber-100',
      textSecondary: 'text-amber-200/70',
      accent: 'text-yellow-400',
      button: 'bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-800 hover:to-yellow-700',
      input: 'bg-amber-950/80 border-amber-700/50',
      overlay: 'bg-amber-950/80'
    },
    effects: {
      glow1: 'bg-amber-500/8 shadow-amber-500/10',
      glow2: 'bg-yellow-500/8 shadow-yellow-500/10',
      glow3: 'bg-orange-500/8 shadow-orange-500/10'
    }
  },
  
  nature: {
    name: 'Forest Guardian',
    description: 'Harmonia da natureza',
    classes: {
      background: 'bg-gradient-to-br from-green-950 via-emerald-900/50 to-teal-950',
      card: 'bg-emerald-950/90 backdrop-blur-sm',
      cardBorder: 'border-emerald-700/50',
      text: 'text-emerald-100',
      textSecondary: 'text-emerald-200/70',
      accent: 'text-emerald-400',
      button: 'bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700',
      input: 'bg-emerald-950/80 border-emerald-700/50',
      overlay: 'bg-emerald-950/80'
    },
    effects: {
      glow1: 'bg-emerald-500/8 shadow-emerald-500/10',
      glow2: 'bg-teal-500/8 shadow-teal-500/10',
      glow3: 'bg-green-500/8 shadow-green-500/10'
    }
  },
  
  fire: {
    name: 'Dragon\'s Flame',
    description: 'Poder do fogo eterno',
    classes: {
      background: 'bg-gradient-to-br from-red-950 via-orange-900/50 to-yellow-950/30',
      card: 'bg-red-950/90 backdrop-blur-sm',
      cardBorder: 'border-red-700/50',
      text: 'text-red-100',
      textSecondary: 'text-red-200/70',
      accent: 'text-orange-400',
      button: 'bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700',
      input: 'bg-red-950/80 border-red-700/50',
      overlay: 'bg-red-950/80'
    },
    effects: {
      glow1: 'bg-red-500/8 shadow-red-500/10',
      glow2: 'bg-orange-500/8 shadow-orange-500/10',
      glow3: 'bg-yellow-500/8 shadow-yellow-500/10'
    }
  },
  
  ice: {
    name: 'Frozen Realm',
    description: 'Reino do gelo eterno',
    classes: {
      background: 'bg-gradient-to-br from-blue-950 via-cyan-900/50 to-slate-950',
      card: 'bg-blue-950/90 backdrop-blur-sm',
      cardBorder: 'border-blue-700/50',
      text: 'text-blue-100',
      textSecondary: 'text-blue-200/70',
      accent: 'text-cyan-400',
      button: 'bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700',
      input: 'bg-blue-950/80 border-blue-700/50',
      overlay: 'bg-blue-950/80'
    },
    effects: {
      glow1: 'bg-blue-500/8 shadow-blue-500/10',
      glow2: 'bg-cyan-500/8 shadow-cyan-500/10',
      glow3: 'bg-slate-500/8 shadow-slate-500/10'
    }
  },
  
  cosmic: {
    name: 'Cosmic Void',
    description: 'Mistérios do cosmos',
    classes: {
      background: 'bg-gradient-to-br from-indigo-950 via-purple-900/50 to-violet-950',
      card: 'bg-indigo-950/90 backdrop-blur-sm',
      cardBorder: 'border-purple-700/50',
      text: 'text-indigo-100',
      textSecondary: 'text-purple-200/70',
      accent: 'text-violet-400',
      button: 'bg-gradient-to-r from-indigo-700 to-purple-600 hover:from-indigo-800 hover:to-purple-700',
      input: 'bg-indigo-950/80 border-purple-700/50',
      overlay: 'bg-indigo-950/80'
    },
    effects: {
      glow1: 'bg-indigo-500/8 shadow-indigo-500/10',
      glow2: 'bg-purple-500/8 shadow-purple-500/10',
      glow3: 'bg-violet-500/8 shadow-violet-500/10'
    }
  }
};

// ✅ CORREÇÃO: Hook useTheme movido para dentro do arquivo
const useTheme = () => {
  const { ui } = useAppContext();
  return themes[ui.theme] || themes.dark;
};

// ✅ CORREÇÃO: Componente ThemeProvider como export default único
function ThemeProvider({ children }) {
  const theme = useTheme();
  
  // Aplicar classes CSS customizadas baseadas no tema
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Remover classes de tema anteriores
    Object.keys(themes).forEach(themeName => {
      root.classList.remove(`theme-${themeName}`);
    });
    
    // Adicionar classe do tema atual
    root.classList.add(`theme-${theme.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
    
    // Definir variáveis CSS customizadas
    const style = document.createElement('style');
    style.id = 'theme-variables';
    
    // Remover style anterior se existir
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.textContent = `
      :root {
        --theme-bg-primary: ${theme.classes.background};
        --theme-bg-card: ${theme.classes.card};
        --theme-border: ${theme.classes.cardBorder};
        --theme-text: ${theme.classes.text};
        --theme-text-secondary: ${theme.classes.textSecondary};
        --theme-accent: ${theme.classes.accent};
        --theme-button: ${theme.classes.button};
        --theme-input: ${theme.classes.input};
        --theme-overlay: ${theme.classes.overlay};
      }
      
      /* ✅ Garantir que o fundo fique atrás de todo conteúdo */
      .theme-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
      }
      
      /* ✅ Garantir que o conteúdo principal fique acima */
      .main-content {
        position: relative;
        z-index: 10;
      }
      
      /* ✅ Efeitos de brilho com z-index baixo */
      .background-glow {
        position: fixed;
        z-index: 1;
        pointer-events: none;
        will-change: transform;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [theme]);

  return (
    <>
      {/* ✅ Fundo do tema com z-index baixo */}
      <div className={`theme-background ${theme.classes.background}`} />
      
      {/* ✅ Efeitos de brilho com z-index controlado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl background-glow ${theme.effects.glow1}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl background-glow ${theme.effects.glow2}`}></div>
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl background-glow ${theme.effects.glow3}`}></div>
      </div>
      
      {/* ✅ Conteúdo principal com z-index alto */}
      <div className="main-content">
        {children}
      </div>
    </>
  );
}

// ✅ CORREÇÃO: Exportações separadas para evitar problema com Fast Refresh
// Export do objeto themes para componentes que precisam da lista de temas
export { themes };

// Export do hook useTheme para componentes que precisam do tema atual
export { useTheme };

// ✅ CORREÇÃO: Export default apenas do componente principal
export default ThemeProvider;