import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect, useRef } from 'react';

// Context
const AppContext = createContext();

// ✅ Sistema de salvamento automático simples usando localStorage
const STORAGE_KEY = 'rpg_character_data';

const storageUtils = {
  save: (data) => {
    try {
      const dataToSave = {
        ...data,
        savedAt: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('💾 Dados salvos automaticamente');
      return true;
    } catch (error) {
      console.error('Erro ao salvar:', error);
      return false;
    }
  },
  
  load: () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('📂 Dados carregados do localStorage');
        return parsedData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar:', error);
      return null;
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Dados limpos do localStorage');
      return true;
    } catch (error) {
      console.error('Erro ao limpar:', error);
      return false;
    }
  }
};

// Estado inicial
const initialState = {
  // Dados do personagem
  characterData: {
    name: '', race: '', height: '', age: '', homeland: '', religion: '', fear: '',
    hp: '', mana: '', aura: '', er: '', en: '', ep: '', ea: '',
    vigor: '', strength: '', 
    dexterity: 0, agility: 0, rarity: 0, animalHandling: 0,
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
    theme: 'dark',
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

// Action Types - usando Object.freeze para imutabilidade
const ActionTypes = Object.freeze({
  UPDATE_CHARACTER_DATA: 'UPDATE_CHARACTER_DATA',
  RESET_CHARACTER_DATA: 'RESET_CHARACTER_DATA',
  SET_ABILITIES: 'SET_ABILITIES',
  SET_INVENTORY_ITEMS: 'SET_INVENTORY_ITEMS',
  SET_FIXED_ATTRIBUTES: 'SET_FIXED_ATTRIBUTES',
  SET_DEBUFFS: 'SET_DEBUFFS',
  SET_SHAKING: 'SET_SHAKING',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  SET_LOADING: 'SET_LOADING',
  SET_THEME: 'SET_THEME',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  LOAD_ALL_DATA: 'LOAD_ALL_DATA',
  RESET_ALL_DATA: 'RESET_ALL_DATA'
});

// ✅ MELHORADO: Reducer com melhor tipagem e validação
const appReducer = (state, action) => {
  if (!action || !action.type) {
    console.error('Ação inválida:', action);
    return state;
  }

  switch (action.type) {
    case ActionTypes.UPDATE_CHARACTER_DATA:
      if (!action.payload || typeof action.payload !== 'object') {
        console.error('Payload inválido para UPDATE_CHARACTER_DATA:', action.payload);
        return state;
      }
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
      const newAbilities = typeof action.payload === 'function' 
        ? action.payload(state.abilities)
        : action.payload;
      
      if (!Array.isArray(newAbilities)) {
        console.error('Abilities deve ser um array:', newAbilities);
        return state;
      }
      
      return {
        ...state,
        abilities: newAbilities
      };
      
    case ActionTypes.SET_INVENTORY_ITEMS:
      const newInventory = typeof action.payload === 'function'
        ? action.payload(state.inventoryItems)
        : action.payload;
        
      if (!Array.isArray(newInventory)) {
        console.error('InventoryItems deve ser um array:', newInventory);
        return state;
      }
        
      return {
        ...state,
        inventoryItems: newInventory
      };
      
    case ActionTypes.SET_FIXED_ATTRIBUTES:
      const newAttributes = typeof action.payload === 'function'
        ? action.payload(state.fixedAttributes)
        : action.payload;
        
      if (!Array.isArray(newAttributes)) {
        console.error('FixedAttributes deve ser um array:', newAttributes);
        return state;
      }
        
      return {
        ...state,
        fixedAttributes: newAttributes
      };
      
    case ActionTypes.SET_DEBUFFS:
      const newDebuffs = typeof action.payload === 'function'
        ? action.payload(state.debuffs)
        : action.payload;
        
      if (!Array.isArray(newDebuffs)) {
        console.error('Debuffs deve ser um array:', newDebuffs);
        return state;
      }
        
      return {
        ...state,
        debuffs: newDebuffs
      };
      
    case ActionTypes.SET_SHAKING:
      return {
        ...state,
        ui: { ...state.ui, isShaking: Boolean(action.payload) }
      };
      
    case ActionTypes.ADD_TOAST:
      if (!action.payload || !action.payload.id) {
        console.error('Toast inválido:', action.payload);
        return state;
      }
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
      if (!action.payload || typeof action.payload !== 'object') {
        console.error('Loading payload inválido:', action.payload);
        return state;
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: { ...state.ui.loading, ...action.payload }
        }
      };
      
    case ActionTypes.SET_THEME:
      const validThemes = ['dark', 'light', 'auto'];
      const theme = validThemes.includes(action.payload) ? action.payload : 'dark';
      return {
        ...state,
        ui: { ...state.ui, theme }
      };
      
    case ActionTypes.UPDATE_SETTINGS:
      if (!action.payload || typeof action.payload !== 'object') {
        console.error('Settings payload inválido:', action.payload);
        return state;
      }
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      
    case ActionTypes.LOAD_ALL_DATA:
      if (!action.payload || typeof action.payload !== 'object') {
        console.error('Load data payload inválido:', action.payload);
        return state;
      }
      return {
        ...action.payload,
        ui: { 
          ...initialState.ui, 
          ...action.payload.ui,
          // Preservar toasts e loading states atuais
          toasts: state.ui.toasts,
          loading: state.ui.loading
        }
      };
      
    case ActionTypes.RESET_ALL_DATA:
      return {
        ...initialState,
        ui: { 
          ...initialState.ui, 
          theme: state.ui.theme, // Manter tema atual
          toasts: state.ui.toasts,
          loading: state.ui.loading
        }
      };
      
    default:
      console.warn(`Ação não reconhecida: ${action.type}`);
      return state;
  }
};

// ✅ CORREÇÃO PRINCIPAL: Provider Component como named export
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const saveTimeoutRef = useRef(null);
  const isInitialRender = useRef(true);

  // ✅ Carregar dados salvos na inicialização
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = storageUtils.load();
        if (savedData) {
          // Validar e aplicar dados salvos
          const validData = {
            characterData: { ...initialState.characterData, ...(savedData.characterData || {}) },
            abilities: Array.isArray(savedData.abilities) ? savedData.abilities : [],
            inventoryItems: Array.isArray(savedData.inventoryItems) ? savedData.inventoryItems : [],
            fixedAttributes: Array.isArray(savedData.fixedAttributes) ? savedData.fixedAttributes : [],
            debuffs: Array.isArray(savedData.debuffs) ? savedData.debuffs : [],
            settings: { ...initialState.settings, ...(savedData.settings || {}) },
            ui: {
              ...initialState.ui,
              theme: savedData.ui?.theme || initialState.ui.theme
            }
          };
          
          dispatch({ type: ActionTypes.LOAD_ALL_DATA, payload: validData });
          console.log('✅ Dados carregados automaticamente na inicialização');
        }
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    };

    loadSavedData();
    isInitialRender.current = false;
    console.log('🚀 App inicializado com auto-save ativo');
  }, []);

  // ✅ Sistema de auto-save automático e responsivo
  useEffect(() => {
    // Não salvar no primeiro render
    if (isInitialRender.current) return;

    const saveData = () => {
      if (state.settings.autoSave) {
        const dataToSave = {
          characterData: state.characterData,
          abilities: state.abilities,
          inventoryItems: state.inventoryItems,
          fixedAttributes: state.fixedAttributes,
          debuffs: state.debuffs,
          settings: state.settings,
          ui: {
            theme: state.ui.theme,
            showLoadingStates: state.ui.showLoadingStates
          },
          timestamp: new Date().toISOString()
        };
        
        const success = storageUtils.save(dataToSave);
        if (success) {
          console.log('💾 Auto-save executado com sucesso');
        }
      }
    };

    // Limpar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce reduzido para resposta mais rápida
    saveTimeoutRef.current = setTimeout(saveData, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [
    state.characterData,
    state.abilities,
    state.inventoryItems,
    state.fixedAttributes,
    state.debuffs,
    state.settings.autoSave,
    state.ui.theme
  ]);

  // ✅ MELHORADO: Sistema de toast com auto-remove
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    if (!message || typeof message !== 'string') {
      console.error('Toast message inválido:', message);
      return;
    }

    const validTypes = ['info', 'success', 'warning', 'error'];
    const toastType = validTypes.includes(type) ? type : 'info';
    
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast = { 
      id, 
      message: message.slice(0, 200), // Limitar tamanho
      type: toastType, 
      duration: Math.max(1000, Math.min(10000, duration)) // Entre 1s e 10s
    };
    
    dispatch({ type: ActionTypes.ADD_TOAST, payload: toast });
    
    setTimeout(() => {
      dispatch({ type: ActionTypes.REMOVE_TOAST, payload: id });
    }, toast.duration);

    return id;
  }, []);

  // ✅ MELHORADO: Actions com melhor validação
  const actions = useMemo(() => ({
    // Character actions
    updateCharacterData: (updates) => {
      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        console.error('updateCharacterData: updates deve ser um objeto válido');
        showToast('Erro ao atualizar dados do personagem', 'error');
        return;
      }
      
      try {
        dispatch({ type: ActionTypes.UPDATE_CHARACTER_DATA, payload: updates });
      } catch (error) {
        console.error('Erro ao atualizar personagem:', error);
        showToast('Erro ao atualizar personagem', 'error');
      }
    },

    resetCharacterData: () => {
      try {
        dispatch({ type: ActionTypes.RESET_CHARACTER_DATA });
        showToast('Dados do personagem resetados', 'success');
      } catch (error) {
        console.error('Erro ao resetar personagem:', error);
        showToast('Erro ao resetar personagem', 'error');
      }
    },

    // Game data actions
    setAbilities: (abilitiesOrUpdater) => {
      try {
        dispatch({ type: ActionTypes.SET_ABILITIES, payload: abilitiesOrUpdater });
      } catch (error) {
        console.error('Erro ao atualizar habilidades:', error);
        showToast('Erro ao atualizar habilidades', 'error');
      }
    },

    setInventoryItems: (itemsOrUpdater) => {
      try {
        dispatch({ type: ActionTypes.SET_INVENTORY_ITEMS, payload: itemsOrUpdater });
      } catch (error) {
        console.error('Erro ao atualizar inventário:', error);
        showToast('Erro ao atualizar inventário', 'error');
      }
    },

    setFixedAttributes: (attributesOrUpdater) => {
      try {
        dispatch({ type: ActionTypes.SET_FIXED_ATTRIBUTES, payload: attributesOrUpdater });
      } catch (error) {
        console.error('Erro ao atualizar atributos:', error);
        showToast('Erro ao atualizar atributos', 'error');
      }
    },

    setDebuffs: (debuffsOrUpdater) => {
      try {
        dispatch({ type: ActionTypes.SET_DEBUFFS, payload: debuffsOrUpdater });
      } catch (error) {
        console.error('Erro ao atualizar debuffs:', error);
        showToast('Erro ao atualizar debuffs', 'error');
      }
    },

    // UI actions
    setIsShaking: (shaking) => {
      dispatch({ type: ActionTypes.SET_SHAKING, payload: Boolean(shaking) });
    },

    showToast,

    removeToast: (id) => {
      if (!id) return;
      dispatch({ type: ActionTypes.REMOVE_TOAST, payload: id });
    },

    setLoading: (loadingStates) => {
      if (!loadingStates || typeof loadingStates !== 'object') {
        console.error('setLoading: loadingStates deve ser um objeto');
        return;
      }
      dispatch({ type: ActionTypes.SET_LOADING, payload: loadingStates });
    },

    setTheme: (theme) => {
      const validThemes = ['dark', 'light', 'auto'];
      if (!validThemes.includes(theme)) {
        console.error('Tema inválido:', theme);
        return;
      }
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
      showToast(`Tema alterado para ${theme}`, 'success');
    },

    // Settings actions
    updateSettings: (settings) => {
      if (!settings || typeof settings !== 'object') {
        console.error('updateSettings: settings deve ser um objeto');
        return;
      }
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
      showToast('Configurações atualizadas', 'success');
    },

    // ✅ MODIFICADO: Save/load simulados para artifacts
    saveGame: async () => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { saving: true } });
      
      try {
        // Simular delay de save
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const dataToSave = {
          characterData: state.characterData,
          abilities: state.abilities,
          inventoryItems: state.inventoryItems,
          fixedAttributes: state.fixedAttributes,
          debuffs: state.debuffs,
          settings: state.settings,
          ui: {
            theme: state.ui.theme,
            showLoadingStates: state.ui.showLoadingStates
          },
          savedAt: new Date().toISOString()
        };
        
        const success = storageUtils.save(dataToSave);
        
        if (success) {
          showToast('Jogo salvo com sucesso! (Simulado)', 'success');
          return true;
        } else {
          throw new Error('Falha ao salvar');
        }
      } catch (error) {
        console.error('Erro ao salvar jogo:', error);
        showToast('Erro ao salvar o jogo', 'error');
        return false;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: { saving: false } });
      }
    },

    loadGame: async () => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { loading: true } });
      
      try {
        // Simular delay de load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Load não disponível em artifacts (localStorage não suportado)', 'warning');
        return false;
        
      } catch (error) {
        console.error('Erro ao carregar jogo:', error);
        showToast('Erro ao carregar o jogo', 'error');
        return false;
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: { loading: false } });
      }
    },

    // ✅ MELHORADO: Export/Import usando downloads (funciona em artifacts)
    exportData: () => {
      try {
        const dataToExport = {
          characterData: state.characterData,
          abilities: state.abilities,
          inventoryItems: state.inventoryItems,
          fixedAttributes: state.fixedAttributes,
          debuffs: state.debuffs,
          settings: state.settings,
          ui: { theme: state.ui.theme },
          metadata: {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            platform: 'claude-artifacts'
          }
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `rpg-character-${new Date().toISOString().split('T')[0]}.json`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        showToast('Dados exportados com sucesso!', 'success');
        return true;
      } catch (error) {
        console.error('Erro ao exportar dados:', error);
        showToast('Erro ao exportar dados', 'error');
        return false;
      }
    },

    importData: (file) => {
      if (!file || !(file instanceof File)) {
        showToast('Arquivo inválido', 'error');
        return Promise.reject(new Error('Arquivo inválido'));
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            
            // Validar estrutura básica
            if (!importedData || typeof importedData !== 'object') {
              throw new Error('Dados inválidos');
            }
            
            // Validar e sanitizar dados importados
            const validData = {
              characterData: { ...initialState.characterData, ...(importedData.characterData || {}) },
              abilities: Array.isArray(importedData.abilities) ? importedData.abilities : [],
              inventoryItems: Array.isArray(importedData.inventoryItems) ? importedData.inventoryItems : [],
              fixedAttributes: Array.isArray(importedData.fixedAttributes) ? importedData.fixedAttributes : [],
              debuffs: Array.isArray(importedData.debuffs) ? importedData.debuffs : [],
              settings: { ...state.settings, ...(importedData.settings || {}) },
              ui: { 
                ...state.ui, 
                theme: importedData.ui?.theme || state.ui.theme
              }
            };
            
            dispatch({ type: ActionTypes.LOAD_ALL_DATA, payload: validData });
            
            const importedAt = importedData.metadata?.exportedAt ? 
              new Date(importedData.metadata.exportedAt).toLocaleString() : 
              'data desconhecida';
            
            showToast(`Dados importados! (Exportado em: ${importedAt})`, 'success');
            resolve(true);
            
          } catch (error) {
            console.error('Erro ao importar dados:', error);
            showToast('Arquivo inválido ou corrompido', 'error');
            reject(error);
          }
        };
        
        reader.onerror = () => {
          const error = new Error('Erro ao ler arquivo');
          showToast('Erro ao ler o arquivo', 'error');
          reject(error);
        };
        
        reader.readAsText(file);
      });
    },

    // Bulk actions
    loadAllData: (data) => {
      if (!data || typeof data !== 'object') {
        showToast('Dados inválidos para carregar', 'error');
        return;
      }
      
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
        try {
          storageUtils.clear();
          dispatch({ type: ActionTypes.RESET_ALL_DATA });
          showToast('Todos os dados foram resetados', 'success');
        } catch (error) {
          console.error('Erro ao resetar dados:', error);
          showToast('Erro ao resetar dados', 'error');
        }
      }
    }
  }), [state, showToast]);

  // ✅ MELHORADO: Computed values com melhor performance
  const computed = useMemo(() => ({
    totalInventoryItems: state.inventoryItems.reduce((sum, item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return sum + Math.max(0, quantity);
    }, 0),
    
    activeDebuffsCount: state.debuffs.length,
    
    hasFixedAttributes: state.fixedAttributes.length > 0,
    
    isLoading: Object.values(state.ui.loading).some(Boolean),
    
    // Para artifacts, sempre false (sem localStorage)
    hasSavedData: false,
    
    // Stats do personagem
    characterStats: {
      hasBasicInfo: Boolean(state.characterData.name && state.characterData.race),
      hasAttributes: Object.values(state.characterData).some(value => 
        typeof value === 'number' && value > 0
      ),
      completionPercentage: (() => {
        const fields = Object.keys(initialState.characterData);
        const filledFields = fields.filter(key => {
          const value = state.characterData[key];
          return value !== '' && value !== 0 && (!Array.isArray(value) || value.length > 0);
        });
        return Math.round((filledFields.length / fields.length) * 100);
      })()
    },

    // Info de debug
    debugInfo: {
      totalToasts: state.ui.toasts.length,
      currentTheme: state.ui.theme,
      autoSaveEnabled: state.settings.autoSave,
      lastUpdate: new Date().toISOString()
    }
  }), [state]);

  // ✅ OTIMIZADO: Context value com melhor memoização
  const contextValue = useMemo(() => ({
    // Estado
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    computed,
    
    // Meta info
    meta: {
      version: '1.0',
      platform: 'claude-artifacts',
      storageMode: 'memory-only'
    }
  }), [state, actions, computed]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ CORREÇÃO: Hook exportado separadamente
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};