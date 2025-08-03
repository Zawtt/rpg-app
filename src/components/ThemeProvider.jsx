import React from 'react';
import { useAppContext } from '../contexts/AppContext';

// Definição dos temas com efeitos visuais mais dramáticos
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
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans'
    },
    animations: {
      transition: 'transition-all duration-300',
      hover: 'hover:scale-105',
      active: 'active:scale-95'
    },
    dice: {
      color: 'text-blue-400',
      shadow: 'shadow-blue-500/50',
      animation: 'animate-pulse'
    }
  },
  
  cyberpunk: {
    name: 'Gaby Theme',
    description: 'Pink Neon',
    classes: {
      background: 'bg-gradient-to-br from-black via-black to-black',
      card: 'bg-gray-900 backdrop-blur-lg border-l-4 border-r-5',
      cardBorder: 'border-pink-500/50',
      text: 'text-red-100',
      textSecondary: 'text-white-100',
      accent: 'text-red-400',
      button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
      input: 'bg-gray-900/80 border-pink-500/30',
      overlay: 'bg-black/80 backdrop-blur-md'
    },
    effects: {
      glow1: 'bg-pink-500/20 shadow-cyan-500/30 animate-pulse',
      glow2: 'bg-purple-500/20 shadow-purple-500/30 animate-pulse',
      glow3: 'bg-pink-500/20 shadow-pink-500/30 animate-pulse'
    },
    fonts: {
      heading: 'font-mono',
      body: 'font-mono'
    },
    animations: {
      transition: 'transition-all duration-300',
      hover: 'hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20',
      active: 'active:scale-95'
    },
    dice: {
      color: 'text-pink-400',
      shadow: 'shadow-pink-500/50',
      animation: 'animate-pulse'
    }
  },
  medieval: {
  name: 'Guizin Theme',
  description: 'Era dourada',
  classes: {
    background: 'bg-gradient-to-br from-black via-black to-black',
    card: 'bg-gray-950 backdrop-blur-sm border-double border-4',
    cardBorder: 'border-amber-700/80',
    text: 'text-amber-100',
    textSecondary: 'text-amber-200/90',
    accent: 'text-yellow-600',
    button: 'bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-800 hover:to-yellow-700',
    input: 'bg-gray-900 border-gray-700/80',
    overlay: 'bg-gray-900'
  },
  effects: {
    glow1: 'bg-amber-500/10 shadow-amber-500/20',
    glow2: 'bg-yellow-500/10 shadow-yellow-500/20',
    glow3: 'bg-orange-500/10 shadow-orange-500/20'
  },
  fonts: {
    heading: 'font-serif',
    body: 'font-serif'
  },
  animations: {
    transition: 'transition-all duration-500',
    hover: 'hover:scale-105 hover:shadow-xl',
    active: 'active:scale-95'
  },
  dice: {
    color: 'text-amber-500',
    shadow: 'shadow-amber-500/50',
    animation: 'animate-bounce'
  }
},
  
  nature: {
    name: 'Forest Guardian',
    description: 'Harmonia da natureza',
    classes: {
      background: 'bg-gradient-to-br from-green-950 via-emerald-900/50 to-teal-950',
      card: 'bg-emerald-950/80 backdrop-blur-sm border-l-2 border-r-2 border-t-0 border-b-0',
      cardBorder: 'border-emerald-700/50',
      text: 'text-emerald-100',
      textSecondary: 'text-emerald-200/70',
      accent: 'text-emerald-400',
      button: 'bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700',
      input: 'bg-emerald-950/80 border-emerald-700/50',
      overlay: 'bg-emerald-950/80'
    },
    effects: {
      glow1: 'bg-emerald-500/15 shadow-emerald-500/20',
      glow2: 'bg-teal-500/15 shadow-teal-500/20',
      glow3: 'bg-green-500/15 shadow-green-500/20'
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans'
    },
    animations: {
      transition: 'transition-all duration-700 ease-in-out',
      hover: 'hover:scale-105 hover:rotate-1',
      active: 'active:scale-95 active:rotate-0'
    },
    dice: {
      color: 'text-emerald-400',
      shadow: 'shadow-emerald-500/50',
      animation: 'animate-bounce'
    }
  },
  
  fire: {
    name: 'Dragon\'s Flame',
    description: 'Poder do fogo eterno',
    classes: {
      background: 'bg-gradient-to-br from-red-950 via-orange-900/50 to-yellow-950/30',
      card: 'bg-red-950/80 backdrop-blur-sm border-t-4',
      cardBorder: 'border-red-700/70',
      text: 'text-red-100',
      textSecondary: 'text-red-200/90',
      accent: 'text-orange-400',
      button: 'bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700',
      input: 'bg-red-950/80 border-red-700/50',
      overlay: 'bg-red-950/80'
    },
    effects: {
      glow1: 'bg-red-500/20 shadow-red-500/30 animate-pulse',
      glow2: 'bg-orange-500/20 shadow-orange-500/30 animate-pulse',
      glow3: 'bg-yellow-500/20 shadow-yellow-500/30 animate-pulse'
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans'
    },
    animations: {
      transition: 'transition-all duration-300',
      hover: 'hover:scale-105 hover:shadow-lg hover:shadow-red-500/30',
      active: 'active:scale-95'
    },
    dice: {
      color: 'text-red-500',
      shadow: 'shadow-red-500/50',
      animation: 'animate-ping'
    }
  },
  
  ice: {
    name: 'Frozen Realm',
    description: 'Reino do gelo eterno',
    classes: {
      background: 'bg-gradient-to-br from-blue-950 via-cyan-900/50 to-slate-950',
      card: 'bg-blue-950/70 backdrop-blur-lg border-t border-b',
      cardBorder: 'border-blue-700/50',
      text: 'text-blue-100',
      textSecondary: 'text-blue-200/70',
      accent: 'text-cyan-400',
      button: 'bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700',
      input: 'bg-blue-950/80 border-blue-700/50',
      overlay: 'bg-blue-950/80'
    },
    effects: {
      glow1: 'bg-blue-500/15 shadow-blue-500/20',
      glow2: 'bg-cyan-500/15 shadow-cyan-500/20',
      glow3: 'bg-slate-500/15 shadow-slate-500/20'
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans'
    },
    animations: {
      transition: 'transition-all duration-500 ease-in-out',
      hover: 'hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20',
      active: 'active:scale-95'
    },
    dice: {
      color: 'text-cyan-400',
      shadow: 'shadow-cyan-500/50',
      animation: 'animate-pulse'
    }
  },
  
  cosmic: {
    name: 'Cosmic Void',
    description: 'Mistérios do cosmos',
    classes: {
      background: 'bg-[url("/stars-bg.jpg")] bg-cover bg-fixed bg-indigo-950',
      card: 'bg-indigo-950/70 backdrop-blur-lg border-none',
      cardBorder: 'border-purple-700/50',
      text: 'text-indigo-100',
      textSecondary: 'text-purple-200/70',
      accent: 'text-violet-400',
      button: 'bg-gradient-to-r from-indigo-700 to-purple-600 hover:from-indigo-800 hover:to-purple-700',
      input: 'bg-indigo-950/80 border-purple-700/50',
      overlay: 'bg-indigo-950/80'
    },
    effects: {
      glow1: 'bg-indigo-500/20 shadow-indigo-500/30 animate-pulse',
      glow2: 'bg-purple-500/20 shadow-purple-500/30 animate-pulse',
      glow3: 'bg-violet-500/20 shadow-violet-500/30 animate-pulse'
    },
    fonts: {
      heading: 'font-sans',
      body: 'font-sans'
    },
    animations: {
      transition: 'transition-all duration-700',
      hover: 'hover:scale-105 hover:rotate-1 hover:shadow-lg hover:shadow-purple-500/20',
      active: 'active:scale-95 active:rotate-0'
    },
    dice: {
      color: 'text-purple-400',
      shadow: 'shadow-purple-500/50',
      animation: 'animate-spin'
    }
  },
  
  retro: {
    name: 'Retro Arcade',
    description: 'Nostalgia dos anos 80',
    classes: {
      background: 'bg-gradient-to-br from-purple-950 via-fuchsia-900 to-pink-950',
      card: 'bg-gray-950/90 backdrop-blur-sm border-2 border-fuchsia-500/70',
      cardBorder: 'border-fuchsia-500/70',
      text: 'text-fuchsia-100',
      textSecondary: 'text-fuchsia-300/80',
      accent: 'text-fuchsia-400',
      button: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700',
      input: 'bg-gray-950/90 border-fuchsia-500/50',
      overlay: 'bg-gray-950/90'
    },
    effects: {
      glow1: 'bg-fuchsia-500/20 shadow-fuchsia-500/30 animate-pulse',
      glow2: 'bg-pink-500/20 shadow-pink-500/30 animate-pulse',
      glow3: 'bg-purple-500/20 shadow-purple-500/30 animate-pulse'
    },
    fonts: {
      heading: 'font-mono',
      body: 'font-mono'
    },
    animations: {
      transition: 'transition-all duration-300',
      hover: 'hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/30',
      active: 'active:scale-95'
    },
    dice: {
      color: 'text-fuchsia-400',
      shadow: 'shadow-fuchsia-500/50',
      animation: 'animate-bounce'
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
        /* Classes básicas do tema */
        --theme-bg-primary: ${theme.classes.background};
        --theme-bg-card: ${theme.classes.card};
        --theme-border: ${theme.classes.cardBorder};
        --theme-text: ${theme.classes.text};
        --theme-text-secondary: ${theme.classes.textSecondary};
        --theme-accent: ${theme.classes.accent};
        --theme-button: ${theme.classes.button};
        --theme-input: ${theme.classes.input};
        --theme-overlay: ${theme.classes.overlay};
        
        /* Fontes do tema */
        --theme-font-heading: ${theme.fonts.heading};
        --theme-font-body: ${theme.fonts.body};
        
        /* Animações do tema */
        --theme-transition: ${theme.animations.transition};
        --theme-hover: ${theme.animations.hover};
        --theme-active: ${theme.animations.active};
        
        /* Estilo dos dados */
        --theme-dice-color: ${theme.dice.color};
        --theme-dice-shadow: ${theme.dice.shadow};
        --theme-dice-animation: ${theme.dice.animation};
      }
      
      /* Aplicar fontes globalmente */
      body {
        font-family: var(--theme-font-body);
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--theme-font-heading);
      }
      
      /* Aplicar animações aos elementos interativos */
      .theme-animated {
        transition: all 0.3s ease;
      }
      
      .theme-animated:hover {
        ${theme.animations.hover.replace('hover:', '')};
      }
      
      .theme-animated:active {
        ${theme.animations.active.replace('active:', '')};
      }
      
      /* Estilo para os dados */
      .dice-result {
        color: var(--theme-dice-color);
        text-shadow: 0 0 10px var(--theme-dice-shadow);
      }
      
      .dice-animation {
        ${theme.dice.animation};
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