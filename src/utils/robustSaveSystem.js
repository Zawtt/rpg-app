/**
 * Sistema Robusto de Salvamento com Backup e Recuperação
 * Substitui o sistema atual com funcionalidades avançadas
 */

import { SaveSystemDiagnostics, checkStorageConnectivity } from './saveSystemDiagnostics.js';

// Configurações do sistema
const CONFIG = {
  STORAGE_KEY: 'rpg_character_data',
  BACKUP_KEY: 'rpg_character_backup',
  TEMP_KEY: 'rpg_character_temp',
  MAX_BACKUPS: 5,
  AUTO_SAVE_INTERVAL: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
  COMPRESSION_ENABLED: true,
  VALIDATION_ENABLED: true
};

// Utilitários de compressão simples (usando btoa/atob)
const CompressionUtils = {
  compress: (data) => {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (error) {
      console.warn('Falha na compressão, usando dados não comprimidos:', error);
      return JSON.stringify(data);
    }
  },

  decompress: (compressedData) => {
    try {
      // Tentar descomprimir
      const jsonString = decodeURIComponent(escape(atob(compressedData)));
      return JSON.parse(jsonString);
    } catch (error) {
      // Se falhar, assumir que são dados não comprimidos
      try {
        return JSON.parse(compressedData);
      } catch (parseError) {
        throw new Error('Dados corrompidos ou formato inválido');
      }
    }
  }
};

// Validador de dados
class DataValidator {
  static validate(data) {
    const errors = [];
    const warnings = [];

    if (!data || typeof data !== 'object') {
      errors.push('Dados devem ser um objeto válido');
      return { isValid: false, errors, warnings };
    }

    // Validar campos obrigatórios
    const requiredFields = ['characterData', 'abilities', 'inventoryItems', 'fixedAttributes', 'debuffs'];
    requiredFields.forEach(field => {
      if (!(field in data)) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    });

    // Validar tipos
    if (data.characterData && typeof data.characterData !== 'object') {
      errors.push('characterData deve ser um objeto');
    }

    ['abilities', 'inventoryItems', 'fixedAttributes', 'debuffs'].forEach(field => {
      if (data[field] && !Array.isArray(data[field])) {
        errors.push(`${field} deve ser um array`);
      }
    });

    // Validar dados do personagem
    if (data.characterData) {
      const charData = data.characterData;
      
      // Validar campos numéricos
      const numericFields = ['hp', 'mana', 'aura', 'er', 'en', 'ep', 'ea', 'age'];
      numericFields.forEach(field => {
        if (charData[field] !== undefined && charData[field] !== '') {
          const value = Number(charData[field]);
          if (isNaN(value)) {
            errors.push(`${field} deve ser um número válido`);
          } else if (value < 0) {
            warnings.push(`${field} tem valor negativo: ${value}`);
          } else if (value > 9999) {
            warnings.push(`${field} tem valor muito alto: ${value}`);
          }
        }
      });

      // Validar arrays de checkboxes
      ['successBoxes', 'failureBoxes'].forEach(field => {
        if (charData[field]) {
          if (!Array.isArray(charData[field])) {
            errors.push(`${field} deve ser um array`);
          } else if (charData[field].length !== 4) {
            warnings.push(`${field} deve ter exatamente 4 elementos`);
          }
        }
      });

      // Validar strings
      const stringFields = ['name', 'race', 'height', 'homeland', 'religion', 'fear'];
      stringFields.forEach(field => {
        if (charData[field] && typeof charData[field] !== 'string') {
          errors.push(`${field} deve ser uma string`);
        } else if (charData[field] && charData[field].length > 100) {
          warnings.push(`${field} é muito longo (${charData[field].length} caracteres)`);
        }
      });
    }

    // Validar itens do inventário
    if (data.inventoryItems && Array.isArray(data.inventoryItems)) {
      data.inventoryItems.forEach((item, index) => {
        if (!item.name || typeof item.name !== 'string') {
          errors.push(`Item ${index + 1}: nome é obrigatório`);
        }
        if (item.quantity !== undefined) {
          const qty = Number(item.quantity);
          if (isNaN(qty) || qty < 1) {
            errors.push(`Item ${index + 1}: quantidade deve ser um número positivo`);
          }
        }
      });
    }

    // Verificar tamanho total dos dados
    const dataSize = JSON.stringify(data).length;
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (dataSize > maxSize) {
      warnings.push(`Dados muito grandes: ${(dataSize / 1024 / 1024).toFixed(2)}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      dataSize,
      timestamp: new Date().toISOString()
    };
  }

  static sanitize(data) {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const sanitized = { ...data };

    // Sanitizar characterData
    if (sanitized.characterData) {
      const charData = { ...sanitized.characterData };
      
      // Limitar strings
      const stringFields = ['name', 'race', 'height', 'homeland', 'religion', 'fear'];
      stringFields.forEach(field => {
        if (charData[field] && typeof charData[field] === 'string') {
          charData[field] = charData[field].slice(0, 100).trim();
        }
      });

      // Sanitizar números
      const numericFields = ['hp', 'mana', 'aura', 'er', 'en', 'ep', 'ea', 'age'];
      numericFields.forEach(field => {
        if (charData[field] !== undefined && charData[field] !== '') {
          const value = Number(charData[field]);
          if (!isNaN(value)) {
            charData[field] = Math.max(0, Math.min(9999, Math.floor(value)));
          }
        }
      });

      // Sanitizar arrays de checkboxes
      ['successBoxes', 'failureBoxes'].forEach(field => {
        if (charData[field] && Array.isArray(charData[field])) {
          charData[field] = charData[field].slice(0, 4).map(Boolean);
          while (charData[field].length < 4) {
            charData[field].push(false);
          }
        }
      });

      sanitized.characterData = charData;
    }

    // Sanitizar arrays
    ['abilities', 'inventoryItems', 'fixedAttributes', 'debuffs'].forEach(field => {
      if (sanitized[field] && Array.isArray(sanitized[field])) {
        sanitized[field] = sanitized[field].filter(item => item && typeof item === 'object');
      } else {
        sanitized[field] = [];
      }
    });

    return sanitized;
  }
}

// Sistema principal de salvamento
export class RobustSaveSystem {
  constructor(options = {}) {
    this.config = { ...CONFIG, ...options };
    this.diagnostics = new SaveSystemDiagnostics();
    this.autoSaveTimer = null;
    this.isAutoSaveEnabled = false;
    this.lastSaveTime = null;
    this.saveInProgress = false;
    this.eventListeners = new Map();
  }

  /**
   * Inicializar o sistema
   */
  async initialize() {
    console.log('🚀 Inicializando sistema robusto de salvamento...');
    
    // Verificar conectividade
    const connectivity = checkStorageConnectivity();
    if (!connectivity.available) {
      throw new Error(`Sistema de armazenamento indisponível: ${connectivity.message}`);
    }

    // Executar diagnóstico inicial
    const diagnostic = await this.diagnostics.runFullDiagnostic();
    if (diagnostic.summary.overallStatus === 'FAILED') {
      console.warn('⚠️ Problemas detectados no sistema de armazenamento:', diagnostic.errors);
    }

    // Verificar e limpar dados corrompidos
    await this.cleanupCorruptedData();

    console.log('✅ Sistema de salvamento inicializado com sucesso');
    return diagnostic;
  }

  /**
   * Salvar dados com retry e backup
   */
  async saveData(data, options = {}) {
    if (this.saveInProgress) {
      throw new Error('Operação de salvamento já em andamento');
    }

    this.saveInProgress = true;
    const startTime = performance.now();

    try {
      // Validar dados se habilitado
      if (this.config.VALIDATION_ENABLED) {
        const validation = DataValidator.validate(data);
        if (!validation.isValid) {
          throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
        }
        
        if (validation.warnings.length > 0) {
          console.warn('⚠️ Avisos na validação:', validation.warnings);
          this.emit('validation-warnings', validation.warnings);
        }
      }

      // Sanitizar dados
      const sanitizedData = DataValidator.sanitize(data);
      if (!sanitizedData) {
        throw new Error('Falha na sanitização dos dados');
      }

      // Adicionar metadados
      const dataWithMetadata = {
        ...sanitizedData,
        metadata: {
          version: '2.0',
          savedAt: new Date().toISOString(),
          platform: 'robust-save-system',
          checksum: this.generateChecksum(sanitizedData)
        }
      };

      // Criar backup antes de salvar
      if (!options.skipBackup) {
        await this.createBackup();
      }

      // Tentar salvar com retry
      const success = await this.saveWithRetry(dataWithMetadata);
      
      if (success) {
        this.lastSaveTime = new Date();
        const duration = performance.now() - startTime;
        
        console.log(`💾 Dados salvos com sucesso em ${duration.toFixed(2)}ms`);
        this.emit('save-success', { data: dataWithMetadata, duration });
        
        return { success: true, duration, timestamp: this.lastSaveTime };
      } else {
        throw new Error('Falha ao salvar após todas as tentativas');
      }

    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
      this.emit('save-error', error);
      throw error;
    } finally {
      this.saveInProgress = false;
    }
  }

  /**
   * Carregar dados com verificação de integridade
   */
  async loadData(options = {}) {
    const startTime = performance.now();

    try {
      // Tentar carregar dados principais
      let data = await this.loadWithRetry(this.config.STORAGE_KEY);
      
      if (!data) {
        console.log('📂 Dados principais não encontrados, tentando backup...');
        data = await this.loadFromBackup();
      }

      if (!data) {
        console.log('📂 Nenhum dado encontrado');
        return { success: false, message: 'Nenhum dado encontrado' };
      }

      // Verificar integridade
      if (data.metadata && data.metadata.checksum) {
        const currentChecksum = this.generateChecksum(data);
        if (currentChecksum !== data.metadata.checksum) {
          console.warn('⚠️ Checksum não confere, dados podem estar corrompidos');
          
          // Tentar carregar backup
          const backupData = await this.loadFromBackup();
          if (backupData) {
            console.log('🔄 Usando dados do backup');
            data = backupData;
          }
        }
      }

      // Validar dados carregados
      if (this.config.VALIDATION_ENABLED) {
        const validation = DataValidator.validate(data);
        if (!validation.isValid) {
          console.error('❌ Dados carregados são inválidos:', validation.errors);
          
          // Tentar backup
          const backupData = await this.loadFromBackup();
          if (backupData) {
            const backupValidation = DataValidator.validate(backupData);
            if (backupValidation.isValid) {
              console.log('🔄 Usando dados válidos do backup');
              data = backupData;
            }
          }
        }
      }

      const duration = performance.now() - startTime;
      console.log(`📖 Dados carregados com sucesso em ${duration.toFixed(2)}ms`);
      
      this.emit('load-success', { data, duration });
      
      return { 
        success: true, 
        data, 
        duration,
        metadata: data.metadata || null
      };

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      this.emit('load-error', error);
      throw error;
    }
  }

  /**
   * Criar backup dos dados atuais
   */
  async createBackup() {
    try {
      const currentData = localStorage.getItem(this.config.STORAGE_KEY);
      if (!currentData) {
        return false;
      }

      // Gerenciar múltiplos backups
      const backups = this.getBackupList();
      const newBackup = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data: currentData
      };

      backups.unshift(newBackup);

      // Manter apenas os últimos N backups
      if (backups.length > this.config.MAX_BACKUPS) {
        backups.splice(this.config.MAX_BACKUPS);
      }

      localStorage.setItem(this.config.BACKUP_KEY, JSON.stringify(backups));
      console.log(`💾 Backup criado (${backups.length}/${this.config.MAX_BACKUPS})`);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      return false;
    }
  }

  /**
   * Carregar dados do backup mais recente
   */
  async loadFromBackup() {
    try {
      const backups = this.getBackupList();
      if (backups.length === 0) {
        return null;
      }

      const latestBackup = backups[0];
      const data = this.config.COMPRESSION_ENABLED 
        ? CompressionUtils.decompress(latestBackup.data)
        : JSON.parse(latestBackup.data);

      console.log(`🔄 Dados carregados do backup (${new Date(latestBackup.timestamp).toLocaleString()})`);
      return data;
    } catch (error) {
      console.error('❌ Erro ao carregar backup:', error);
      return null;
    }
  }

  /**
   * Listar backups disponíveis
   */
  getBackupList() {
    try {
      const backupsData = localStorage.getItem(this.config.BACKUP_KEY);
      return backupsData ? JSON.parse(backupsData) : [];
    } catch (error) {
      console.error('❌ Erro ao listar backups:', error);
      return [];
    }
  }

  /**
   * Restaurar backup específico
   */
  async restoreBackup(backupId) {
    try {
      const backups = this.getBackupList();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      const data = this.config.COMPRESSION_ENABLED 
        ? CompressionUtils.decompress(backup.data)
        : JSON.parse(backup.data);

      // Salvar como dados principais
      await this.saveData(data, { skipBackup: true });
      
      console.log(`🔄 Backup restaurado: ${new Date(backup.timestamp).toLocaleString()}`);
      this.emit('backup-restored', { backupId, timestamp: backup.timestamp });
      
      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error);
      throw error;
    }
  }

  /**
   * Habilitar auto-save
   */
  enableAutoSave(getData) {
    if (this.isAutoSaveEnabled) {
      return;
    }

    this.isAutoSaveEnabled = true;
    this.autoSaveTimer = setInterval(async () => {
      try {
        if (typeof getData === 'function') {
          const data = getData();
          if (data) {
            await this.saveData(data, { skipBackup: false });
            console.log('💾 Auto-save executado');
          }
        }
      } catch (error) {
        console.error('❌ Erro no auto-save:', error);
      }
    }, this.config.AUTO_SAVE_INTERVAL);

    console.log(`⏰ Auto-save habilitado (${this.config.AUTO_SAVE_INTERVAL / 1000}s)`);
  }

  /**
   * Desabilitar auto-save
   */
  disableAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    this.isAutoSaveEnabled = false;
    console.log('⏰ Auto-save desabilitado');
  }

  /**
   * Exportar dados
   */
  exportData(data, filename) {
    try {
      const exportData = {
        ...data,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          version: '2.0',
          platform: 'robust-save-system'
        }
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `rpg-character-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('📤 Dados exportados com sucesso');
      this.emit('export-success', { filename: link.download });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
      this.emit('export-error', error);
      return false;
    }
  }

  /**
   * Importar dados
   */
  async importData(file) {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof File)) {
        reject(new Error('Arquivo inválido'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Validar dados importados
          const validation = DataValidator.validate(importedData);
          if (!validation.isValid) {
            reject(new Error(`Dados inválidos: ${validation.errors.join(', ')}`));
            return;
          }

          // Salvar dados importados
          await this.saveData(importedData);
          
          console.log('📥 Dados importados com sucesso');
          this.emit('import-success', { data: importedData });
          
          resolve({ success: true, data: importedData });
        } catch (error) {
          console.error('❌ Erro ao importar dados:', error);
          this.emit('import-error', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Erro ao ler arquivo');
        this.emit('import-error', error);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Limpar dados corrompidos
   */
  async cleanupCorruptedData() {
    try {
      const keys = [this.config.STORAGE_KEY, this.config.BACKUP_KEY, this.config.TEMP_KEY];
      
      for (const key of keys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            JSON.parse(data);
          } catch (error) {
            console.warn(`🧹 Removendo dados corrompidos: ${key}`);
            localStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro na limpeza de dados corrompidos:', error);
    }
  }

  /**
   * Executar diagnóstico completo
   */
  async runDiagnostic(data) {
    return await this.diagnostics.runFullDiagnostic(data);
  }

  // Métodos auxiliares privados

  async saveWithRetry(data) {
    for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
      try {
        const serializedData = this.config.COMPRESSION_ENABLED 
          ? CompressionUtils.compress(data)
          : JSON.stringify(data);
        
        localStorage.setItem(this.config.STORAGE_KEY, serializedData);
        return true;
      } catch (error) {
        console.warn(`⚠️ Tentativa ${attempt} falhou:`, error.message);
        
        if (attempt < this.config.RETRY_ATTEMPTS) {
          await this.delay(this.config.RETRY_DELAY * attempt);
        } else {
          throw error;
        }
      }
    }
    return false;
  }

  async loadWithRetry(key) {
    for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
      try {
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        return this.config.COMPRESSION_ENABLED 
          ? CompressionUtils.decompress(data)
          : JSON.parse(data);
      } catch (error) {
        console.warn(`⚠️ Tentativa de carregamento ${attempt} falhou:`, error.message);
        
        if (attempt < this.config.RETRY_ATTEMPTS) {
          await this.delay(this.config.RETRY_DELAY * attempt);
        } else {
          throw error;
        }
      }
    }
    return null;
  }

  generateChecksum(data) {
    // Checksum simples baseado no conteúdo
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Sistema de eventos
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erro no listener do evento ${event}:`, error);
        }
      });
    }
  }

  /**
   * Destruir instância e limpar recursos
   */
  destroy() {
    this.disableAutoSave();
    this.eventListeners.clear();
    console.log('🗑️ Sistema de salvamento destruído');
  }
}

// Instância singleton para uso global
let globalSaveSystem = null;

export const createSaveSystem = (options = {}) => {
  if (globalSaveSystem) {
    globalSaveSystem.destroy();
  }
  globalSaveSystem = new RobustSaveSystem(options);
  return globalSaveSystem;
};

export const getSaveSystem = () => {
  if (!globalSaveSystem) {
    globalSaveSystem = new RobustSaveSystem();
  }
  return globalSaveSystem;
};

// Exportar utilitários
export { DataValidator, CompressionUtils };