/**
 * Sistema de Diagnóstico para Salvamento de Dados
 * Identifica e resolve problemas na funcionalidade de save/load
 */

// Utilitários de diagnóstico
export class SaveSystemDiagnostics {
  constructor() {
    this.diagnosticResults = [];
    this.errors = [];
    this.warnings = [];
    this.isRunning = false;
  }

  /**
   * Executa diagnóstico completo do sistema de salvamento
   */
  async runFullDiagnostic(data = null) {
    this.isRunning = true;
    this.diagnosticResults = [];
    this.errors = [];
    this.warnings = [];

    console.log('🔍 Iniciando diagnóstico completo do sistema de salvamento...');

    try {
      // 1. Verificar disponibilidade do localStorage
      await this.checkStorageAvailability();
      
      // 2. Verificar integridade dos dados
      await this.checkDataIntegrity(data);
      
      // 3. Testar operações de save/load
      await this.testSaveLoadOperations();
      
      // 4. Verificar permissões e quotas
      await this.checkStorageQuota();
      
      // 5. Validar estrutura de dados
      await this.validateDataStructure(data);
      
      // 6. Testar serialização/deserialização
      await this.testSerialization(data);
      
      // 7. Verificar performance
      await this.checkPerformance();

      console.log('✅ Diagnóstico completo finalizado');
      return this.generateReport();
      
    } catch (error) {
      this.errors.push({
        type: 'DIAGNOSTIC_ERROR',
        message: 'Erro durante execução do diagnóstico',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      return this.generateReport();
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * 1. Verificar disponibilidade do localStorage
   */
  async checkStorageAvailability() {
    const test = {
      name: 'Storage Availability',
      status: 'running',
      details: []
    };

    try {
      // Testar se localStorage está disponível
      if (typeof Storage === 'undefined') {
        test.status = 'failed';
        test.details.push('localStorage não está disponível neste ambiente');
        this.errors.push({
          type: 'STORAGE_UNAVAILABLE',
          message: 'localStorage não suportado',
          solution: 'Use um ambiente que suporte Web Storage API'
        });
      } else {
        // Testar escrita/leitura
        const testKey = '__rpg_diagnostic_test__';
        const testValue = JSON.stringify({ test: true, timestamp: Date.now() });
        
        localStorage.setItem(testKey, testValue);
        const retrieved = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        if (retrieved === testValue) {
          test.status = 'passed';
          test.details.push('localStorage funcionando corretamente');
        } else {
          test.status = 'failed';
          test.details.push('Falha na operação de escrita/leitura do localStorage');
          this.errors.push({
            type: 'STORAGE_READ_WRITE_ERROR',
            message: 'Erro ao escrever/ler do localStorage',
            solution: 'Verificar permissões do navegador e modo privado'
          });
        }
      }
    } catch (error) {
      test.status = 'failed';
      test.details.push(`Erro ao testar localStorage: ${error.message}`);
      this.errors.push({
        type: 'STORAGE_ACCESS_ERROR',
        message: error.message,
        solution: 'Verificar se o navegador permite acesso ao localStorage'
      });
    }

    this.diagnosticResults.push(test);
  }

  /**
   * 2. Verificar integridade dos dados
   */
  async checkDataIntegrity(data) {
    const test = {
      name: 'Data Integrity',
      status: 'running',
      details: []
    };

    try {
      if (!data) {
        test.status = 'warning';
        test.details.push('Nenhum dado fornecido para verificação');
        this.warnings.push({
          type: 'NO_DATA_PROVIDED',
          message: 'Dados não fornecidos para diagnóstico'
        });
        this.diagnosticResults.push(test);
        return;
      }

      // Verificar estrutura básica
      const requiredFields = ['characterData', 'abilities', 'inventoryItems', 'fixedAttributes', 'debuffs'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        test.status = 'failed';
        test.details.push(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
        this.errors.push({
          type: 'MISSING_REQUIRED_FIELDS',
          message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
          solution: 'Garantir que todos os campos obrigatórios estejam presentes'
        });
      }

      // Verificar tipos de dados
      const typeErrors = [];
      if (data.characterData && typeof data.characterData !== 'object') {
        typeErrors.push('characterData deve ser um objeto');
      }
      if (data.abilities && !Array.isArray(data.abilities)) {
        typeErrors.push('abilities deve ser um array');
      }
      if (data.inventoryItems && !Array.isArray(data.inventoryItems)) {
        typeErrors.push('inventoryItems deve ser um array');
      }

      if (typeErrors.length > 0) {
        test.status = 'failed';
        test.details.push(...typeErrors);
        this.errors.push({
          type: 'INVALID_DATA_TYPES',
          message: typeErrors.join('; '),
          solution: 'Corrigir tipos de dados conforme especificação'
        });
      }

      // Verificar tamanho dos dados
      const dataSize = JSON.stringify(data).length;
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (dataSize > maxSize) {
        test.status = 'warning';
        test.details.push(`Dados muito grandes: ${(dataSize / 1024 / 1024).toFixed(2)}MB`);
        this.warnings.push({
          type: 'LARGE_DATA_SIZE',
          message: `Dados ocupam ${(dataSize / 1024 / 1024).toFixed(2)}MB`,
          solution: 'Considerar compressão ou limpeza de dados desnecessários'
        });
      }

      if (test.status === 'running') {
        test.status = 'passed';
        test.details.push('Integridade dos dados verificada com sucesso');
      }

    } catch (error) {
      test.status = 'failed';
      test.details.push(`Erro na verificação de integridade: ${error.message}`);
      this.errors.push({
        type: 'INTEGRITY_CHECK_ERROR',
        message: error.message,
        solution: 'Verificar estrutura dos dados'
      });
    }

    this.diagnosticResults.push(test);
  }

  /**
   * 3. Testar operações de save/load
   */
  async testSaveLoadOperations() {
    const test = {
      name: 'Save/Load Operations',
      status: 'running',
      details: []
    };

    try {
      const testData = {
        characterData: { name: 'Test Character', hp: '100' },
        abilities: [{ name: 'Test Ability', description: 'Test' }],
        inventoryItems: [{ name: 'Test Item', quantity: 1 }],
        fixedAttributes: [],
        debuffs: [],
        timestamp: new Date().toISOString(),
        testFlag: true
      };

      const testKey = '__rpg_save_test__';

      // Testar salvamento
      const saveStart = performance.now();
      localStorage.setItem(testKey, JSON.stringify(testData));
      const saveTime = performance.now() - saveStart;
      
      test.details.push(`Salvamento executado em ${saveTime.toFixed(2)}ms`);

      // Testar carregamento
      const loadStart = performance.now();
      const loadedData = JSON.parse(localStorage.getItem(testKey));
      const loadTime = performance.now() - loadStart;
      
      test.details.push(`Carregamento executado em ${loadTime.toFixed(2)}ms`);

      // Verificar integridade dos dados carregados
      if (JSON.stringify(testData) === JSON.stringify(loadedData)) {
        test.status = 'passed';
        test.details.push('Dados salvos e carregados com integridade mantida');
      } else {
        test.status = 'failed';
        test.details.push('Dados corrompidos durante save/load');
        this.errors.push({
          type: 'DATA_CORRUPTION',
          message: 'Dados foram corrompidos durante operação de save/load',
          solution: 'Verificar processo de serialização/deserialização'
        });
      }

      // Limpar dados de teste
      localStorage.removeItem(testKey);

      // Verificar performance
      if (saveTime > 1000 || loadTime > 1000) {
        this.warnings.push({
          type: 'SLOW_OPERATIONS',
          message: `Operações lentas - Save: ${saveTime.toFixed(2)}ms, Load: ${loadTime.toFixed(2)}ms`,
          solution: 'Considerar otimização dos dados ou uso de compressão'
        });
      }

    } catch (error) {
      test.status = 'failed';
      test.details.push(`Erro nas operações de save/load: ${error.message}`);
      this.errors.push({
        type: 'SAVE_LOAD_ERROR',
        message: error.message,
        solution: 'Verificar implementação das funções de save/load'
      });
    }

    this.diagnosticResults.push(test);
  }

  /**
   * 4. Verificar permissões e quotas
   */
  async checkStorageQuota() {
    const test = {
      name: 'Storage Quota',
      status: 'running',
      details: []
    };

    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
        const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
        const usagePercent = ((estimate.usage / estimate.quota) * 100).toFixed(2);

        test.details.push(`Uso atual: ${usedMB}MB de ${quotaMB}MB (${usagePercent}%)`);

        if (usagePercent > 90) {
          test.status = 'warning';
          this.warnings.push({
            type: 'HIGH_STORAGE_USAGE',
            message: `Uso de armazenamento alto: ${usagePercent}%`,
            solution: 'Limpar dados desnecessários ou implementar limpeza automática'
          });
        } else {
          test.status = 'passed';
        }
      } else {
        test.status = 'warning';
        test.details.push('API de quota de armazenamento não disponível');
        this.warnings.push({
          type: 'QUOTA_API_UNAVAILABLE',
          message: 'Não é possível verificar quota de armazenamento',
          solution: 'Monitorar uso manualmente'
        });
      }
    } catch (error) {
      test.status = 'failed';
      test.details.push(`Erro ao verificar quota: ${error.message}`);
      this.errors.push({
        type: 'QUOTA_CHECK_ERROR',
        message: error.message,
        solution: 'Verificar suporte do navegador para Storage API'
      });
    }

    this.diagnosticResults.push(test);
  }

  /**
   * 5. Validar estrutura de dados
   */
  async validateDataStructure(data) {
    const test = {
      name: 'Data Structure Validation',
      status: 'running',
      details: []
    };

    try {
      if (!data) {
        test.status = 'skipped';
        test.details.push('Nenhum dado fornecido para validação');
        this.diagnosticResults.push(test);
        return;
      }

      const validationErrors = [];

      // Validar characterData
      if (data.characterData) {
        const charData = data.characterData;
        
        // Verificar campos numéricos
        const numericFields = ['hp', 'mana', 'aura', 'er', 'en', 'ep', 'ea'];
        numericFields.forEach(field => {
          if (charData[field] !== undefined && charData[field] !== '') {
            const value = Number(charData[field]);
            if (isNaN(value) || value < 0) {
              validationErrors.push(`${field} deve ser um número não negativo`);
            }
          }
        });

        // Verificar arrays
        if (charData.successBoxes && !Array.isArray(charData.successBoxes)) {
          validationErrors.push('successBoxes deve ser um array');
        }
        if (charData.failureBoxes && !Array.isArray(charData.failureBoxes)) {
          validationErrors.push('failureBoxes deve ser um array');
        }
      }

      // Validar arrays
      ['abilities', 'inventoryItems', 'fixedAttributes', 'debuffs'].forEach(field => {
        if (data[field] && !Array.isArray(data[field])) {
          validationErrors.push(`${field} deve ser um array`);
        }
      });

      if (validationErrors.length > 0) {
        test.status = 'failed';
        test.details.push(...validationErrors);
        this.errors.push({
          type: 'STRUCTURE_VALIDATION_ERROR',
          message: validationErrors.join('; '),
          solution: 'Corrigir estrutura dos dados conforme especificação'
        });
      } else {
        test.status = 'passed';
        test.details.push('Estrutura de dados válida');
      }

    } catch (error) {
      test.status = 'failed';
      test.details.push(`Erro na validação de estrutura: ${error.message}`);
      this.errors.push({
        type: 'VALIDATION_ERROR',
        message: error.message,
        solution: 'Verificar implementação da validação'
      });
    }

    this.diagnosticResults.push(test);
  }

  /**
   * 6. Testar serialização/deserialização
   */
  async testSerialization(data) {
    const test = {
      name: 'Serialization Test',
      status: 'running',
      details: []
    };

    try {
      if (!data) {
        test.status = 'skipped';
        test.details.push('Nenhum dado fornecido para teste de serialização');
        this.diagnosticResults.push(test);
        return;
      }

      // Testar JSON.stringify
      const serializeStart = performance.now();
      const serialized = JSON.stringify(data);
      const serializeTime = performance.now() - serializeStart;

      test.details.push(`Serialização executada em ${serializeTime.toFixed(2)}ms`);

      // Testar JSON.parse
      const deserializeStart = performance.now();
      const deserialized = JSON.parse(serialized);
      const deserializeTime = performance.now() - deserializeStart;

      test.details.push(`Deserialização executada em ${deserializeTime.toFixed(2)}ms`);

      // Verificar integridade
      const originalStr = JSON.stringify(data);
      const deserializedStr = JSON.stringify(deserialized);

      if (originalStr === deserializedStr) {
        test.status = 'passed';
        test.details.push('Serialização/deserialização manteve integridade dos dados');
      } else {
        test.status = 'failed';
        test.details.push('Dados foram alterados durante serialização/deserialização');
        this.errors.push({
          type: 'SERIALIZATION_ERROR',
          message: 'Dados corrompidos durante serialização',
          solution: 'Verificar se todos os dados são serializáveis (sem funções, etc.)'
        });
      }

      // Verificar performance
      if (serializeTime > 500 || deserializeTime > 500) {
        this.warnings.push({
          type: 'SLOW_SERIALIZATION',
          message: `Serialização lenta - Serialize: ${serializeTime.toFixed(2)}ms, Deserialize: ${deserializeTime.toFixed(2)}ms`,
          solution: 'Considerar redução do tamanho dos dados'
        });
      }

    } catch (error) {
      test.status = 'failed';
      test.details.push(`Erro na serialização: ${error.message}`);
      this.errors.push({
        type: 'SERIALIZATION_EXCEPTION',
        message: error.message,
        solution: 'Verificar se os dados contêm apenas tipos serializáveis'
      });
    }

    this.diagnosticResults.push(test);
  }

  /**
   * 7. Verificar performance
   */
  async checkPerformance() {
    const test = {
      name: 'Performance Check',
      status: 'running',
      details: []
    };

    try {
      // Testar múltiplas operações
      const iterations = 10;
      const testData = { test: 'performance', data: new Array(1000).fill('test') };
      const testKey = '__rpg_perf_test__';

      let totalSaveTime = 0;
      let totalLoadTime = 0;

      for (let i = 0; i < iterations; i++) {
        // Save
        const saveStart = performance.now();
        localStorage.setItem(testKey, JSON.stringify(testData));
        totalSaveTime += performance.now() - saveStart;

        // Load
        const loadStart = performance.now();
        JSON.parse(localStorage.getItem(testKey));
        totalLoadTime += performance.now() - loadStart;
      }

      localStorage.removeItem(testKey);

      const avgSaveTime = totalSaveTime / iterations;
      const avgLoadTime = totalLoadTime / iterations;

      test.details.push(`Tempo médio de save: ${avgSaveTime.toFixed(2)}ms`);
      test.details.push(`Tempo médio de load: ${avgLoadTime.toFixed(2)}ms`);

      if (avgSaveTime < 50 && avgLoadTime < 50) {
        test.status = 'passed';
        test.details.push('Performance adequada');
      } else if (avgSaveTime < 200 && avgLoadTime < 200) {
        test.status = 'warning';
        test.details.push('Performance aceitável mas pode ser melhorada');
        this.warnings.push({
          type: 'MODERATE_PERFORMANCE',
          message: `Performance moderada - Save: ${avgSaveTime.toFixed(2)}ms, Load: ${avgLoadTime.toFixed(2)}ms`,
          solution: 'Considerar otimizações nos dados'
        });
      } else {
        test.status = 'failed';
        test.details.push('Performance inadequada');
        this.errors.push({
          type: 'POOR_PERFORMANCE',
          message: `Performance ruim - Save: ${avgSaveTime.toFixed(2)}ms, Load: ${avgLoadTime.toFixed(2)}ms`,
          solution: 'Otimizar estrutura de dados e implementar cache'
        });
      }

    } catch (error) {
      test.status = 'failed';
      test.details.push(`Erro no teste de performance: ${error.message}`);
      this.errors.push({
        type: 'PERFORMANCE_TEST_ERROR',
        message: error.message,
        solution: 'Verificar implementação do teste de performance'
      });
    }

    this.diagnosticResults.push(test);
  }

  /**
   * Gerar relatório final
   */
  generateReport() {
    const passedTests = this.diagnosticResults.filter(t => t.status === 'passed').length;
    const failedTests = this.diagnosticResults.filter(t => t.status === 'failed').length;
    const warningTests = this.diagnosticResults.filter(t => t.status === 'warning').length;
    const skippedTests = this.diagnosticResults.filter(t => t.status === 'skipped').length;

    const report = {
      summary: {
        total: this.diagnosticResults.length,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests,
        skipped: skippedTests,
        overallStatus: failedTests > 0 ? 'FAILED' : warningTests > 0 ? 'WARNING' : 'PASSED'
      },
      tests: this.diagnosticResults,
      errors: this.errors,
      warnings: this.warnings,
      timestamp: new Date().toISOString(),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  /**
   * Gerar recomendações baseadas nos resultados
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.errors.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Corrigir Erros Críticos',
        description: 'Existem erros que impedem o funcionamento correto do sistema de salvamento',
        actions: this.errors.map(e => e.solution).filter(Boolean)
      });
    }

    if (this.warnings.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Resolver Avisos',
        description: 'Existem problemas que podem afetar a performance ou confiabilidade',
        actions: this.warnings.map(w => w.solution).filter(Boolean)
      });
    }

    // Recomendações gerais
    recommendations.push({
      priority: 'LOW',
      title: 'Melhorias Gerais',
      description: 'Implementar melhorias para maior robustez',
      actions: [
        'Implementar sistema de backup automático',
        'Adicionar compressão de dados',
        'Implementar retry automático em caso de falha',
        'Adicionar logs detalhados',
        'Implementar validação em tempo real'
      ]
    });

    return recommendations;
  }
}

// Função utilitária para executar diagnóstico rápido
export const runQuickDiagnostic = async (data) => {
  const diagnostics = new SaveSystemDiagnostics();
  return await diagnostics.runFullDiagnostic(data);
};

// Função para verificar apenas conectividade
export const checkStorageConnectivity = () => {
  try {
    const testKey = '__rpg_connectivity_test__';
    const testValue = 'test';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    return {
      available: true,
      working: retrieved === testValue,
      message: retrieved === testValue ? 'localStorage funcionando' : 'localStorage com problemas'
    };
  } catch (error) {
    return {
      available: false,
      working: false,
      message: `localStorage indisponível: ${error.message}`
    };
  }
};