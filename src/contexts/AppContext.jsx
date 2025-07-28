import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Context
const AppContext = createContext();

// Hook para usar o contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

// Estado inicial
const initialState = {
  // Dados do personagem
  characterData: {
    name: '', race: '', height: '', age: '', homeland: '', religion: '', fear: '',
    hp: '', mana: '', aura: '', er: '', en: '', ep: '', ea: '',
    vigor: '', strength: '', 
    dexterity: 0, agility: 0, rarity: 0, animalHandling: 0, // ✅ Consistência numérica
    stealth: 0, adaptability: 0, perception: 0, intuition: 0, athletics: 0, initiative: 0,
    successBoxes: Array(4).fill(false), 
    failureBoxes: Array(4).fill(false),
    characterImage: ''
  },
  
  // Dados do jogo
  abilities: [],
  inventoryItems: [],
  fixedAttributes: [],
  debuffs: [],
  
  // Estado da UI
  ui: {
    isShaking: false,
    toasts: [],
    loading: {
      saving: false,
      loading: false,
      rolling: false
    },
    theme: 'dark', // dark, cyberpunk, medieval, nature, fire, ice, cosmic
    showLoadingStates: false
  },
  
  // Configurações
  settings: {
    autoSave: true,
    soundEnabled: true,
    animationsEnabled: true,
    accessibilityMode: false
  }
};

// Action Types
const ActionTypes = {
  // Character
  UPDATE_CHARACTER_DATA: 'UPDATE_CHARACTER_DATA',
  RESET_CHARACTER_DATA: 'RESET_CHARACTER_DATA',
  
  // Game Data
  SET_ABILITIES: 'SET_ABILITIES',
  SET_INVENTORY_ITEMS: 'SET_INVENTORY_ITEMS',
  SET_FIXED_ATTRIBUTES: 'SET_FIXED_ATTRIBUTES',
  SET_DEBUFFS: 'SET_DEBUFFS',
  
  // UI
  SET_SHAKING: 'SET_SHAKING',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  SET_LOADING: 'SET_LOADING',
  SET_THEME: 'SET_THEME',
  
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // Bulk operations
  LOAD_ALL_DATA: 'LOAD_ALL_DATA',
  RESET_ALL_DATA: 'RESET_ALL_DATA'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_CHARACTER_DATA:
      return {
        ...state,
        characterData: { ...state.characterData, ...action.payload }
      };
      
    case ActionTypes.RESET_CHARACTER_DATA:
      return {
        ...state,
        characterData: { ...initialState.characterData }
      };
      
    case ActionTypes.SET_ABILITIES:
      return {
        ...state,
        abilities: typeof action.payload === 'function' 
          ? action.payload(state.abilities)
          : action.payload
      };
      
    case ActionTypes.SET_INVENTORY_ITEMS:
      return {
        ...state,
        inventoryItems: typeof action.payload === 'function'
          ? action.payload(state.inventoryItems)
          : action.payload
      };
      
    case ActionTypes.SET_FIXED_ATTRIBUTES:
      return {
        ...state,
        fixedAttributes: typeof action.payload === 'function'
          ? action.payload(state.fixedAttributes)
          : action.payload
      };
      
    case ActionTypes.SET_DEBUFFS:
      return {
        ...state,
        debuffs: typeof action.payload === 'function'
          ? action.payload(state.debuffs)
          : action.payload
      };
      
    case ActionTypes.SET_SHAKING:
      return {
        ...state,
        ui: { ...state.ui, isShaking: action.payload }
      };
      
    case ActionTypes.ADD_TOAST:
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: [...state.ui.toasts, action.payload]
        }
      };
      
    case ActionTypes.REMOVE_TOAST:
      return {
        ...state,
        ui: {
          ...state.ui,
          toasts: state.ui.toasts.filter(toast => toast.id !== action.payload)
        }
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: { ...state.ui.loading, ...action.payload }
        }
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload }
      };
      
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      
    case ActionTypes.LOAD_ALL_DATA:
      return {
        ...state,
        ...action.payload,
        ui: { ...state.ui, ...action.payload.ui }
      };
      
    case ActionTypes.RESET_ALL_DATA:
      return {
        ...initialState,
        ui: { ...state.ui, theme: state.ui.theme } // Manter tema atual
      };
      
    default:
      console.warn(`Ação não reconhecida: ${action.type}`);
      return state;
  }
};

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ✅ Função showToast separada para evitar referência circular
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    dispatch({ type: ActionTypes.ADD_TOAST, payload: toast });
    
    // Auto-remove
    setTimeout(() => {
      dispatch({ type: ActionTypes.REMOVE_TOAST, payload: id });
    }, duration);
  }, []);

  // ✅ Actions memoizadas com dependências corretas
  const actions = useMemo(() => ({
    // Character actions
    updateCharacterData: (updates) => {
      if (typeof updates !== 'object' || updates === null) {
        console.error('updateCharacterData: updates deve ser um objeto');
        return;
      }
      dispatch({ type: ActionTypes.UPDATE_CHARACTER_DATA, payload: updates });
    },

    resetCharacterData: () => {
      dispatch({ type: ActionTypes.RESET_CHARACTER_DATA });
    },

    // Game data actions
    setAbilities: (abilitiesOrUpdater) => {
      dispatch({ type: ActionTypes.SET_ABILITIES, payload: abilitiesOrUpdater });
    },

    setInventoryItems: (itemsOrUpdater) => {
      dispatch({ type: ActionTypes.SET_INVENTORY_ITEMS, payload: itemsOrUpdater });
    },

    setFixedAttributes: (attributesOrUpdater) => {
      dispatch({ type: ActionTypes.SET_FIXED_ATTRIBUTES, payload: attributesOrUpdater });
    },

    setDebuffs: (debuffsOrUpdater) => {
      dispatch({ type: ActionTypes.SET_DEBUFFS, payload: debuffsOrUpdater });
    },

    // UI actions
    setIsShaking: (shaking) => {
      dispatch({ type: ActionTypes.SET_SHAKING, payload: shaking });
    },

    showToast, // ✅ Usando a função separada

    removeToast: (id) => {
      dispatch({ type: ActionTypes.REMOVE_TOAST, payload: id });
    },

    setLoading: (loadingStates) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loadingStates });
    },

    setTheme: (theme) => {
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    },

    // Settings actions
    updateSettings: (settings) => {
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
    },

    // ✅ Bulk actions corrigidas
    loadAllData: (data) => {
      try {
        dispatch({ type: ActionTypes.LOAD_ALL_DATA, payload: data });
        showToast('Dados carregados com sucesso', 'success');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro ao carregar dados', 'error');
      }
    },

    resetAllData: () => {
      if (window.confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
        dispatch({ type: ActionTypes.RESET_ALL_DATA });
        showToast('Todos os dados foram resetados', 'success');
      }
    }
  }), [showToast]); // ✅ Dependência correta

  // ✅ Computed values memoizados separadamente
  const computed = useMemo(() => ({
    totalInventoryItems: state.inventoryItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    activeDebuffsCount: state.debuffs.length,
    hasFixedAttributes: state.fixedAttributes.length > 0,
    isLoading: Object.values(state.ui.loading).some(Boolean)
  }), [state.inventoryItems, state.debuffs, state.fixedAttributes, state.ui.loading]);

  // ✅ Valor do contexto memoizado com dependências corretas
  const contextValue = useMemo(() => ({
    ...state,
    ...actions,
    computed
  }), [state, actions, computed]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;