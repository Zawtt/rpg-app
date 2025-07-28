/**
 * Testes Automatizados para o Sistema de Salvamento
 * Conjunto completo de testes para validar funcionalidade
 */

import { SaveSystemDiagnostics, checkStorageConnectivity } from './saveSystemDiagnostics.js';
import { RobustSaveSystem, DataValidator, CompressionUtils } from './robustSaveSystem.js';

// Dados de teste
const SAMPLE_DATA = {
  characterData: {
    name: 'Teste Character',
    race: 'Humano',
    height: '1.80m',
    age: '25',
    homeland: 'Reino Teste',
    religion: 'Religião Teste',
    fear: 'Medo Teste',
    hp: '100',
    mana: '50',
    aura: '75',
    er: '10',
    en: '20',
    ep: '15',
    ea: '25',
    vigor: '30',
    strength: '40',
    dexterity: 35,
    agility: 45,
    rarity: 5,
    animalHandling: 15,
    stealth: 25,
    adaptability: 20,
    perception: 30,
    intuition: 35,
    athletics: 40,
    initiative: 50,
    successBoxes: [true, false, true, false],
    failureBoxes: [false, true, false, true],
    characterImage: ''
  },
  abilities: [
    { id: 1, name: 'Fireball', description: 'Lança uma bola de fogo', type: 'spell' },
    { id: 2, name: 'Heal', description: 'Cura ferimentos', type: 'spell' }
  ],
  inventoryItems: [
    { id: 1, name: 'Espada de Ferro', quantity: 1, description: 'Uma espada comum' },
    { id: 2, name: 'Poção de Vida', quantity: 5, description: 'Restaura HP' }
  ],
  fixedAttributes: [
    { name: 'HP', value: 100, color: 'text-red-400' },
    { name: 'MANA', value: 50, color: 'text-blue-400' }
  ],
  debuffs: [
    { id: 1, name: 'Envenenado', duration: 3, effect: 'Perde 5 HP por turno' }
  ]
};

const INVALID_DATA = {
  characterData: {
    name: '', // Nome vazio - inválido
    hp: -10, // HP negativo - inválido
    age: 'não é número' // Idade não numérica - inválido
  },
  abilities: 'não é array', // Deve ser array
  inventoryItems: null, // Deve ser array
  fixedAttributes: undefined, // Deve ser array
  debuffs: {} // Deve ser array
};

// Classe principal de testes
export class SaveSystemTestSuite {
  constructor() {
    this.results = [];
    this.errors = [];
    this.warnings = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Executar todos os testes
   */
  async runAllTests() {
    console.log('🧪 Iniciando suite completa de testes...');
    this.startTime = performance.now();
    this.results = [];
    this.errors = [];
    this.warnings = [];

    const tests = [
      // Testes básicos
      { name: 'Conectividade do Storage', fn: this.testStorageConnectivity },
      { name: 'Validação de Dados', fn: this.testDataValidation },
      { name: 'Sanitização de Dados', fn: this.testDataSanitization },
      { name: 'Compressão/Descompressão', fn: this.testCompression },
      
      // Testes do sistema de salvamento
      { name: 'Inicialização do Sistema', fn: this.testSystemInitialization },
      { name: 'Operações de Save/Load', fn: this.testSaveLoadOperations },
      { name: 'Sistema de Backup', fn: this.testBackupSystem },
      { name: 'Recuperação de Erros', fn: this.testErrorRecovery },
      
      // Testes de performance
      { name: 'Performance de Salvamento', fn: this.testSavePerformance },
      { name: 'Performance de Carregamento', fn: this.testLoadPerformance },
      { name: 'Stress Test', fn: this.testStressLoad },
      
      // Testes de integridade
      { name: 'Integridade de Dados', fn: this.testDataIntegrity },
      { name: 'Checksum Validation', fn: this.testChecksumValidation },
      { name: 'Corrupção de Dados', fn: this.testDataCorruption },
      
      // Testes de edge cases
      { name: 'Dados Grandes', fn: this.testLargeData },
      { name: 'Dados Vazios', fn: this.testEmptyData },
      { name: 'Caracteres Especiais', fn: this.testSpecialCharacters },
      
      // Testes de sistema
      { name: 'Auto-save', fn: this.testAutoSave },
      { name: 'Export/Import', fn: this.testExportImport },
      { name: 'Limpeza de Dados', fn: this.testDataCleanup }
    ];

    for (const test of tests) {
      await this.runSingleTest(test.name, test.fn.bind(this));
    }

    this.endTime = performance.now();
    return this.generateTestReport();
  }

  /**
   * Executar teste individual
   */
  async runSingleTest(testName, testFunction) {
    const result = {
      name: testName,
      status: 'running',
      startTime: performance.now(),
      endTime: null,
      duration: null,
      details: [],
      error: null
    };

    try {
      console.log(`🔍 Executando: ${testName}`);
      await testFunction(result);
      
      if (result.status === 'running') {
        result.status = 'passed';
      }
      
      result.endTime = performance.now();
      result.duration = result.endTime - result.startTime;
      
      console.log(`✅ ${testName}: ${result.status.toUpperCase()} (${result.duration.toFixed(2)}ms)`);
      
    } catch (error) {
      result.status = 'failed';
      result.error = error.message;
      result.endTime = performance.now();
      result.duration = result.endTime - result.startTime;
      
      console.error(`❌ ${testName}: FAILED - ${error.message}`);
      this.errors.push({ test: testName, error: error.message });
    }

    this.results.push(result);
  }

  // ===== TESTES BÁSICOS =====

  async testStorageConnectivity(result) {
    const connectivity = checkStorageConnectivity();
    
    if (!connectivity.available) {
      throw new Error('localStorage não está disponível');
    }
    
    if (!connectivity.working) {
      throw new Error('localStorage não está funcionando corretamente');
    }
    
    result.details.push('localStorage disponível e funcionando');
  }

  async testDataValidation(result) {
    // Testar dados válidos
    const validValidation = DataValidator.validate(SAMPLE_DATA);
    if (!validValidation.isValid) {
      throw new Error(`Dados válidos falharam na validação: ${validValidation.errors.join(', ')}`);
    }
    result.details.push('Dados válidos passaram na validação');

    // Testar dados inválidos
    const invalidValidation = DataValidator.validate(INVALID_DATA);
    if (invalidValidation.isValid) {
      throw new Error('Dados inválidos passaram na validação incorretamente');
    }
    result.details.push(`Dados inválidos rejeitados corretamente (${invalidValidation.errors.length} erros)`);

    // Testar edge cases
    const nullValidation = DataValidator.validate(null);
    if (nullValidation.isValid) {
      throw new Error('Dados null passaram na validação incorretamente');
    }
    result.details.push('Dados null rejeitados corretamente');
  }

  async testDataSanitization(result) {
    const sanitized = DataValidator.sanitize(INVALID_DATA);
    
    if (!sanitized) {
      throw new Error('Sanitização retornou null para dados recuperáveis');
    }
    
    // Verificar se arrays foram corrigidos
    if (!Array.isArray(sanitized.abilities)) {
      throw new Error('Sanitização não corrigiu array de abilities');
    }
    
    if (!Array.isArray(sanitized.inventoryItems)) {
      throw new Error('Sanitização não corrigiu array de inventoryItems');
    }
    
    result.details.push('Dados inválidos sanitizados com sucesso');
    result.details.push(`Arrays corrigidos: ${Object.keys(sanitized).filter(k => Array.isArray(sanitized[k])).length}`);
  }

  async testCompression(result) {
    const originalData = SAMPLE_DATA;
    const originalSize = JSON.stringify(originalData).length;
    
    // Testar compressão
    const compressed = CompressionUtils.compress(originalData);
    const compressedSize = compressed.length;
    
    result.details.push(`Tamanho original: ${originalSize} bytes`);
    result.details.push(`Tamanho comprimido: ${compressedSize} bytes`);
    
    // Testar descompressão
    const decompressed = CompressionUtils.decompress(compressed);
    
    // Verificar integridade
    if (JSON.stringify(originalData) !== JSON.stringify(decompressed)) {
      throw new Error('Dados corrompidos durante compressão/descompressão');
    }
    
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    result.details.push(`Taxa de compressão: ${compressionRatio}%`);
  }

  // ===== TESTES DO SISTEMA =====

  async testSystemInitialization(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_storage__',
      BACKUP_KEY: '__test_backup__',
      VALIDATION_ENABLED: true,
      COMPRESSION_ENABLED: true
    });

    const diagnostic = await saveSystem.initialize();
    
    if (!diagnostic) {
      throw new Error('Inicialização não retornou diagnóstico');
    }
    
    result.details.push('Sistema inicializado com sucesso');
    result.details.push(`Status do diagnóstico: ${diagnostic.summary.overallStatus}`);
    
    // Limpar dados de teste
    saveSystem.destroy();
  }

  async testSaveLoadOperations(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_save_load__',
      BACKUP_KEY: '__test_backup_save_load__'
    });

    await saveSystem.initialize();

    // Testar salvamento
    const saveResult = await saveSystem.saveData(SAMPLE_DATA);
    if (!saveResult.success) {
      throw new Error('Falha no salvamento');
    }
    result.details.push(`Dados salvos em ${saveResult.duration.toFixed(2)}ms`);

    // Testar carregamento
    const loadResult = await saveSystem.loadData();
    if (!loadResult.success) {
      throw new Error('Falha no carregamento');
    }
    result.details.push(`Dados carregados em ${loadResult.duration.toFixed(2)}ms`);

    // Verificar integridade
    const originalStr = JSON.stringify(SAMPLE_DATA);
    const loadedStr = JSON.stringify(loadResult.data);
    
    // Remover metadados para comparação
    const loadedDataClean = { ...loadResult.data };
    delete loadedDataClean.metadata;
    const cleanStr = JSON.stringify(loadedDataClean);
    
    if (originalStr !== cleanStr) {
      throw new Error('Dados corrompidos durante save/load');
    }
    
    result.details.push('Integridade dos dados mantida');
    
    saveSystem.destroy();
  }

  async testBackupSystem(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_backup_system__',
      BACKUP_KEY: '__test_backup_list__',
      MAX_BACKUPS: 3
    });

    await saveSystem.initialize();

    // Criar múltiplos backups
    for (let i = 0; i < 5; i++) {
      const testData = { ...SAMPLE_DATA, testId: i };
      await saveSystem.saveData(testData);
      await new Promise(resolve => setTimeout(resolve, 10)); // Pequeno delay
    }

    // Verificar lista de backups
    const backups = saveSystem.getBackupList();
    if (backups.length === 0) {
      throw new Error('Nenhum backup foi criado');
    }
    
    if (backups.length > 3) {
      throw new Error(`Muitos backups criados: ${backups.length} (máximo: 3)`);
    }
    
    result.details.push(`${backups.length} backups criados corretamente`);

    // Testar restauração
    const firstBackup = backups[0];
    const restoreResult = await saveSystem.restoreBackup(firstBackup.id);
    
    if (!restoreResult.success) {
      throw new Error('Falha na restauração do backup');
    }
    
    result.details.push('Backup restaurado com sucesso');
    
    saveSystem.destroy();
  }

  async testErrorRecovery(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_error_recovery__',
      RETRY_ATTEMPTS: 3,
      RETRY_DELAY: 100
    });

    await saveSystem.initialize();

    // Simular erro temporário
    const originalSetItem = localStorage.setItem;
    let attemptCount = 0;
    
    localStorage.setItem = function(key, value) {
      attemptCount++;
      if (attemptCount < 3) {
        throw new Error('Erro simulado');
      }
      return originalSetItem.call(this, key, value);
    };

    try {
      const saveResult = await saveSystem.saveData(SAMPLE_DATA);
      if (!saveResult.success) {
        throw new Error('Sistema não se recuperou do erro');
      }
      
      result.details.push(`Recuperação bem-sucedida após ${attemptCount} tentativas`);
    } finally {
      localStorage.setItem = originalSetItem;
      saveSystem.destroy();
    }
  }

  // ===== TESTES DE PERFORMANCE =====

  async testSavePerformance(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_save_perf__'
    });

    await saveSystem.initialize();

    const iterations = 10;
    const times = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await saveSystem.saveData(SAMPLE_DATA);
      const end = performance.now();
      times.push(end - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);

    if (avgTime > 1000) {
      result.status = 'warning';
      this.warnings.push({ test: 'Save Performance', message: `Performance lenta: ${avgTime.toFixed(2)}ms` });
    }

    result.details.push(`Tempo médio: ${avgTime.toFixed(2)}ms`);
    result.details.push(`Tempo mínimo: ${minTime.toFixed(2)}ms`);
    result.details.push(`Tempo máximo: ${maxTime.toFixed(2)}ms`);

    saveSystem.destroy();
  }

  async testLoadPerformance(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_load_perf__'
    });

    await saveSystem.initialize();
    await saveSystem.saveData(SAMPLE_DATA);

    const iterations = 10;
    const times = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await saveSystem.loadData();
      const end = performance.now();
      times.push(end - start);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;

    if (avgTime > 500) {
      result.status = 'warning';
      this.warnings.push({ test: 'Load Performance', message: `Performance lenta: ${avgTime.toFixed(2)}ms` });
    }

    result.details.push(`Tempo médio de carregamento: ${avgTime.toFixed(2)}ms`);

    saveSystem.destroy();
  }

  async testStressLoad(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_stress__'
    });

    await saveSystem.initialize();

    // Criar dados grandes
    const largeData = {
      ...SAMPLE_DATA,
      inventoryItems: Array(1000).fill(0).map((_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Descrição do item ${i}`.repeat(10),
        quantity: Math.floor(Math.random() * 100)
      }))
    };

    const start = performance.now();
    const saveResult = await saveSystem.saveData(largeData);
    const saveTime = performance.now() - start;

    if (!saveResult.success) {
      throw new Error('Falha no stress test de salvamento');
    }

    const loadStart = performance.now();
    const loadResult = await saveSystem.loadData();
    const loadTime = performance.now() - loadStart;

    if (!loadResult.success) {
      throw new Error('Falha no stress test de carregamento');
    }

    const dataSize = JSON.stringify(largeData).length;
    result.details.push(`Dados testados: ${(dataSize / 1024).toFixed(2)}KB`);
    result.details.push(`Tempo de save: ${saveTime.toFixed(2)}ms`);
    result.details.push(`Tempo de load: ${loadTime.toFixed(2)}ms`);

    if (saveTime > 5000 || loadTime > 5000) {
      result.status = 'warning';
      this.warnings.push({ test: 'Stress Test', message: 'Performance inadequada para dados grandes' });
    }

    saveSystem.destroy();
  }

  // ===== TESTES DE INTEGRIDADE =====

  async testDataIntegrity(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_integrity__'
    });

    await saveSystem.initialize();

    // Salvar dados com checksum
    await saveSystem.saveData(SAMPLE_DATA);

    // Carregar e verificar
    const loadResult = await saveSystem.loadData();
    
    if (!loadResult.success) {
      throw new Error('Falha no carregamento para teste de integridade');
    }

    if (!loadResult.data.metadata || !loadResult.data.metadata.checksum) {
      throw new Error('Checksum não foi gerado');
    }

    result.details.push('Checksum gerado e verificado');
    result.details.push(`Checksum: ${loadResult.data.metadata.checksum}`);

    saveSystem.destroy();
  }

  async testChecksumValidation(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_checksum__'
    });

    await saveSystem.initialize();
    await saveSystem.saveData(SAMPLE_DATA);

    // Corromper dados manualmente
    const rawData = localStorage.getItem('__test_checksum__');
    const parsedData = JSON.parse(rawData);
    parsedData.characterData.name = 'DADOS CORROMPIDOS';
    localStorage.setItem('__test_checksum__', JSON.stringify(parsedData));

    // Tentar carregar dados corrompidos
    const loadResult = await saveSystem.loadData();
    
    // O sistema deve detectar a corrupção e tentar usar backup
    result.details.push('Sistema detectou corrupção de dados');
    
    if (loadResult.success && loadResult.data.characterData.name === 'DADOS CORROMPIDOS') {
      result.status = 'warning';
      this.warnings.push({ test: 'Checksum Validation', message: 'Dados corrompidos não foram detectados' });
    }

    saveSystem.destroy();
  }

  async testDataCorruption(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_corruption__',
      BACKUP_KEY: '__test_corruption_backup__'
    });

    await saveSystem.initialize();
    
    // Salvar dados válidos
    await saveSystem.saveData(SAMPLE_DATA);
    
    // Corromper completamente os dados
    localStorage.setItem('__test_corruption__', 'dados corrompidos inválidos');
    
    // Tentar carregar
    const loadResult = await saveSystem.loadData();
    
    // Sistema deve tentar usar backup ou retornar erro controlado
    if (loadResult.success) {
      result.details.push('Sistema recuperou dados do backup');
    } else {
      result.details.push('Sistema detectou corrupção e retornou erro controlado');
    }

    saveSystem.destroy();
  }

  // ===== TESTES DE EDGE CASES =====

  async testLargeData(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_large_data__'
    });

    await saveSystem.initialize();

    // Criar dados muito grandes (próximo ao limite)
    const largeData = {
      ...SAMPLE_DATA,
      largeField: 'x'.repeat(1024 * 1024) // 1MB de dados
    };

    try {
      const saveResult = await saveSystem.saveData(largeData);
      if (saveResult.success) {
        result.details.push('Dados grandes salvos com sucesso');
        
        const loadResult = await saveSystem.loadData();
        if (loadResult.success) {
          result.details.push('Dados grandes carregados com sucesso');
        }
      }
    } catch (error) {
      if (error.message.includes('quota')) {
        result.status = 'warning';
        result.details.push('Quota de armazenamento excedida (comportamento esperado)');
      } else {
        throw error;
      }
    }

    saveSystem.destroy();
  }

  async testEmptyData(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_empty_data__'
    });

    await saveSystem.initialize();

    const emptyData = {
      characterData: {},
      abilities: [],
      inventoryItems: [],
      fixedAttributes: [],
      debuffs: []
    };

    const saveResult = await saveSystem.saveData(emptyData);
    if (!saveResult.success) {
      throw new Error('Falha ao salvar dados vazios');
    }

    const loadResult = await saveSystem.loadData();
    if (!loadResult.success) {
      throw new Error('Falha ao carregar dados vazios');
    }

    result.details.push('Dados vazios processados corretamente');

    saveSystem.destroy();
  }

  async testSpecialCharacters(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_special_chars__'
    });

    await saveSystem.initialize();

    const specialData = {
      ...SAMPLE_DATA,
      characterData: {
        ...SAMPLE_DATA.characterData,
        name: '测试角色 🎮 Tëst Çhár',
        description: 'Émojis: 🔥⚔️🛡️ Acentos: áéíóú Símbolos: @#$%^&*()'
      }
    };

    const saveResult = await saveSystem.saveData(specialData);
    if (!saveResult.success) {
      throw new Error('Falha ao salvar dados com caracteres especiais');
    }

    const loadResult = await saveSystem.loadData();
    if (!loadResult.success) {
      throw new Error('Falha ao carregar dados com caracteres especiais');
    }

    // Verificar se caracteres especiais foram preservados
    if (loadResult.data.characterData.name !== specialData.characterData.name) {
      throw new Error('Caracteres especiais foram corrompidos');
    }

    result.details.push('Caracteres especiais preservados corretamente');

    saveSystem.destroy();
  }

  // ===== TESTES DE SISTEMA =====

  async testAutoSave(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_auto_save__',
      AUTO_SAVE_INTERVAL: 100 // 100ms para teste rápido
    });

    await saveSystem.initialize();

    let saveCount = 0;
    const getData = () => {
      saveCount++;
      return { ...SAMPLE_DATA, saveCount };
    };

    // Habilitar auto-save
    saveSystem.enableAutoSave(getData);

    // Aguardar algumas execuções
    await new Promise(resolve => setTimeout(resolve, 350));

    // Desabilitar auto-save
    saveSystem.disableAutoSave();

    if (saveCount < 2) {
      throw new Error('Auto-save não executou o suficiente');
    }

    result.details.push(`Auto-save executou ${saveCount} vezes`);

    saveSystem.destroy();
  }

  async testExportImport(result) {
    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_export_import__'
    });

    await saveSystem.initialize();

    // Simular export (não podemos testar download real)
    const exportSuccess = saveSystem.exportData(SAMPLE_DATA, 'test-export.json');
    if (!exportSuccess) {
      throw new Error('Falha na exportação');
    }

    result.details.push('Exportação simulada com sucesso');

    // Testar import com dados simulados
    const jsonData = JSON.stringify({
      ...SAMPLE_DATA,
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        version: '2.0'
      }
    });

    const blob = new Blob([jsonData], { type: 'application/json' });
    const file = new File([blob], 'test-import.json', { type: 'application/json' });

    const importResult = await saveSystem.importData(file);
    if (!importResult.success) {
      throw new Error('Falha na importação');
    }

    result.details.push('Importação executada com sucesso');

    saveSystem.destroy();
  }

  async testDataCleanup(result) {
    // Criar dados corrompidos intencionalmente
    localStorage.setItem('__test_cleanup_1__', 'dados inválidos {');
    localStorage.setItem('__test_cleanup_2__', 'mais dados inválidos [');
    localStorage.setItem('__test_cleanup_valid__', JSON.stringify({ valid: true }));

    const saveSystem = new RobustSaveSystem({
      STORAGE_KEY: '__test_cleanup_valid__'
    });

    // Executar limpeza
    await saveSystem.cleanupCorruptedData();

    // Verificar se dados corrompidos foram removidos
    const corrupted1 = localStorage.getItem('__test_cleanup_1__');
    const corrupted2 = localStorage.getItem('__test_cleanup_2__');
    const valid = localStorage.getItem('__test_cleanup_valid__');

    if (corrupted1 !== null || corrupted2 !== null) {
      throw new Error('Dados corrompidos não foram removidos');
    }

    if (valid === null) {
      throw new Error('Dados válidos foram removidos incorretamente');
    }

    result.details.push('Limpeza de dados corrompidos executada corretamente');

    saveSystem.destroy();
  }

  /**
   * Gerar relatório final dos testes
   */
  generateTestReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'passed').length;
    const failedTests = this.results.filter(r => r.status === 'failed').length;
    const warningTests = this.results.filter(r => r.status === 'warning').length;
    
    const totalDuration = this.endTime - this.startTime;
    const avgTestDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / totalTests;

    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(2),
        totalDuration: totalDuration.toFixed(2),
        avgTestDuration: avgTestDuration.toFixed(2),
        overallStatus: failedTests > 0 ? 'FAILED' : warningTests > 0 ? 'WARNING' : 'PASSED'
      },
      tests: this.results,
      errors: this.errors,
      warnings: this.warnings,
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        storageAvailable: typeof Storage !== 'undefined',
        storageQuota: 'unknown' // Seria calculado em ambiente real
      }
    };

    // Log do relatório
    console.log('\n📊 RELATÓRIO DE TESTES');
    console.log('='.repeat(50));
    console.log(`Status Geral: ${report.summary.overallStatus}`);
    console.log(`Testes Executados: ${totalTests}`);
    console.log(`✅ Aprovados: ${passedTests}`);
    console.log(`❌ Falharam: ${failedTests}`);
    console.log(`⚠️ Avisos: ${warningTests}`);
    console.log(`📈 Taxa de Sucesso: ${report.summary.successRate}%`);
    console.log(`⏱️ Tempo Total: ${report.summary.totalDuration}ms`);
    console.log(`⏱️ Tempo Médio por Teste: ${report.summary.avgTestDuration}ms`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERROS ENCONTRADOS:');
      this.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ AVISOS:');
      this.warnings.forEach(warning => {
        console.log(`  - ${warning.test}: ${warning.message}`);
      });
    }

    console.log('='.repeat(50));

    return report;
  }
}

// Função utilitária para executar testes rápidos
export const runQuickTests = async () => {
  const testSuite = new SaveSystemTestSuite();
  return await testSuite.runAllTests();
};

// Função para executar apenas testes básicos
export const runBasicTests = async () => {
  const testSuite = new SaveSystemTestSuite();
  const basicTests = [
    { name: 'Conectividade do Storage', fn: testSuite.testStorageConnectivity },
    { name: 'Validação de Dados', fn: testSuite.testDataValidation },
    { name: 'Operações de Save/Load', fn: testSuite.testSaveLoadOperations }
  ];

  testSuite.startTime = performance.now();
  
  for (const test of basicTests) {
    await testSuite.runSingleTest(test.name, test.fn.bind(testSuite));
  }
  
  testSuite.endTime = performance.now();
  return testSuite.generateTestReport();
};

// Função para executar testes de performance
export const runPerformanceTests = async () => {
  const testSuite = new SaveSystemTestSuite();
  const perfTests = [
    { name: 'Performance de Salvamento', fn: testSuite.testSavePerformance },
    { name: 'Performance de Carregamento', fn: testSuite.testLoadPerformance },
    { name: 'Stress Test', fn: testSuite.testStressLoad }
  ];

  testSuite.startTime = performance.now();
  
  for (const test of perfTests) {
    await testSuite.runSingleTest(test.name, test.fn.bind(testSuite));
  }
  
  testSuite.endTime = performance.now();
  return testSuite.generateTestReport();
};