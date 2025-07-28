import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

// Hook para debounce
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook para validação de dados
export const useValidation = () => {
  const validateDiceExpression = useCallback((expression) => {
    if (!expression || typeof expression !== 'string') {
      return { isValid: false, error: 'Expressão inválida' };
    }

    const trimmed = expression.trim();
    if (trimmed.length === 0) {
      return { isValid: false, error: 'Expressão não pode estar vazia' };
    }

    if (trimmed.length > 100) {
      return { isValid: false, error: 'Expressão muito longa (máximo 100 caracteres)' };
    }

    // Verificar caracteres permitidos
    const allowedPattern = /^[\d\s+\-*/dD().,]+$/;
    if (!allowedPattern.test(trimmed)) {
      return { isValid: false, error: 'Caracteres inválidos na expressão' };
    }

    // Verificar estrutura básica de dados
    const dicePattern = /(\d*)d(\d+)/gi;
    const matches = trimmed.match(dicePattern);
    
    if (matches) {
      for (const match of matches) {
        const [, numDice, numSides] = match.match(/(\d*)d(\d+)/i);
        const dice = numDice ? parseInt(numDice) : 1;
        const sides = parseInt(numSides);

        if (dice > 100) {
          return { isValid: false, error: 'Muitos dados (máximo 100)' };
        }
        if (sides > 1000) {
          return { isValid: false, error: 'Muitas faces no dado (máximo 1000)' };
        }
        if (sides < 2) {
          return { isValid: false, error: 'Dado deve ter pelo menos 2 faces' };
        }
      }
    }

    return { isValid: true, error: null };
  }, []);

  const validateCharacterField = useCallback((fieldName, value) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return { isValid: false, error: 'Valor inválido' };
    }

    const stringValue = String(value).trim();

    switch (fieldName) {
      case 'name':
        if (stringValue.length > 50) {
          return { isValid: false, error: 'Nome muito longo (máximo 50 caracteres)' };
        }
        break;
      
      case 'hp':
      case 'mana':
      case 'aura':
        const numValue = Number(stringValue);
        if (stringValue !== '' && (isNaN(numValue) || numValue < 0 || numValue > 9999)) {
          return { isValid: false, error: 'Valor deve ser entre 0 e 9999' };
        }
        break;
      
      default:
        if (stringValue.length > 100) {
          return { isValid: false, error: 'Valor muito longo (máximo 100 caracteres)' };
        }
    }

    return { isValid: true, error: null };
  }, []);

  const validateInventoryItem = useCallback((item) => {
    if (!item.name || item.name.trim().length === 0) {
      return { isValid: false, error: 'Nome do item é obrigatório' };
    }

    if (item.name.trim().length > 50) {
      return { isValid: false, error: 'Nome muito longo (máximo 50 caracteres)' };
    }

    if (item.quantity !== undefined) {
      const qty = Number(item.quantity);
      if (isNaN(qty) || qty < 1 || qty > 9999) {
        return { isValid: false, error: 'Quantidade deve ser entre 1 e 9999' };
      }
    }

    if (item.description && item.description.length > 500) {
      return { isValid: false, error: 'Descrição muito longa (máximo 500 caracteres)' };
    }

    return { isValid: true, error: null };
  }, []);

  return {
    validateDiceExpression,
    validateCharacterField,
    validateInventoryItem
  };
};

// Hook para sistema de save/load simulado
export const useSaveSystem = () => {
  const { showToast, setLoading } = useAppContext();

  const saveAllData = useCallback(async (data) => {
    setLoading({ saving: true });
    
    try {
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui você salvaria os dados em localStorage, API, etc.
      // Como não podemos usar localStorage, apenas simulamos
      console.log('Dados que seriam salvos:', data);
      
      showToast('Dados salvos com sucesso!', 'success');
      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showToast('Erro ao salvar dados', 'error');
      return { success: false, error };
    } finally {
      setLoading({ saving: false });
    }
  }, [showToast, setLoading]);

  const loadAllData = useCallback(async () => {
    setLoading({ loading: true });
    
    try {
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Aqui você carregaria os dados
      // Retornando dados simulados como exemplo
      const simulatedData = {
        characterData: {
          name: 'Personagem Exemplo',
          race: 'Humano',
          hp: '100',
          mana: '50'
          // ... outros dados
        },
        abilities: [],
        inventoryItems: [],
        fixedAttributes: [],
        debuffs: []
      };
      
      showToast('Dados carregados com sucesso!', 'success');
      return { success: true, data: simulatedData };
    } catch (error) {
      console.error('Erro ao carregar:', error);
      showToast('Erro ao carregar dados', 'error');
      return { success: false, error };
    } finally {
      setLoading({ loading: false });
    }
  }, [showToast, setLoading]);

  const exportData = useCallback((data) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `rpg-character-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      showToast('Dados exportados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      showToast('Erro ao exportar dados', 'error');
    }
  }, [showToast]);

  return {
    saveAllData,
    loadAllData,
    exportData
  };
};

// Hook para controle de animações
export const useAnimations = () => {
  const { ui, setIsShaking } = useAppContext();

  const triggerShake = useCallback((duration = 500) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), duration);
  }, [setIsShaking]);

  const [isRolling, setIsRolling] = useState(false);

  const triggerDiceRoll = useCallback((duration = 2000) => {
    return new Promise((resolve) => {
      setIsRolling(true);
      triggerShake(duration);
      
      setTimeout(() => {
        setIsRolling(false);
        resolve();
      }, duration);
    });
  }, [triggerShake]);

  return {
    isShaking: ui.isShaking,
    isRolling,
    triggerShake,
    triggerDiceRoll
  };
};

// Hook para gerenciamento de foco e acessibilidade
export const useAccessibility = () => {
  const [announceMessage, setAnnounceMessage] = useState('');
  const announceRef = useRef(null);

  const announce = useCallback((message, priority = 'polite') => {
    setAnnounceMessage(message);
    
    // Limpar após anunciar
    setTimeout(() => {
      setAnnounceMessage('');
    }, 1000);
  }, []);

  const focusElement = useCallback((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
    }
  }, []);

  const trapFocus = useCallback((containerRef) => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return {
    announce,
    announceMessage,
    announceRef,
    focusElement,
    trapFocus
  };
};

// Hook para gerenciamento de atalhos de teclado
export const useKeyboardShortcuts = () => {
  const { showToast } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + S para salvar
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        showToast('Atalho: Ctrl+S - Salvando...', 'info');
        // Aqui você chamaria a função de salvar
      }

      // Ctrl/Cmd + L para carregar
      if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        showToast('Atalho: Ctrl+L - Carregando...', 'info');
        // Aqui você chamaria a função de carregar
      }

      // Escape para fechar modais
      if (event.key === 'Escape') {
        // Este evento será capturado pelos componentes individuais
        showToast('Atalho: ESC - Fechando modal', 'info');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);
};

// Hook para otimização de performance
export const usePerformance = () => {
  const [renderCount, setRenderCount] = useState(0);
  const renderTimeRef = useRef(performance.now());

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    const now = performance.now();
    const timeSinceLastRender = now - renderTimeRef.current;
    renderTimeRef.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(`Render #${renderCount + 1}, Time since last: ${timeSinceLastRender.toFixed(2)}ms`);
    }
  });

  const measurePerf = useCallback((name, fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }, []);

  return {
    renderCount,
    measurePerf
  };
};