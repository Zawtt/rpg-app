import React, { useState, useCallback, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Download, 
  Upload,
  Database,
  Shield,
  Clock,
  Info
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useSaveSystem } from '../hooks';
import { useTheme } from './ThemeProvider';

const SaveSystemDiagnostic = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [backupList, setBackupList] = useState([]);
  
  const { characterData, abilities, inventoryItems, fixedAttributes, debuffs, showToast } = useAppContext();
  const { runDiagnostic, getBackupList, restoreBackup, saveAllData, loadAllData } = useSaveSystem();

  // Executar diagnóstico
  const runFullDiagnostic = useCallback(async () => {
    setIsRunning(true);
    try {
      const currentData = {
        characterData,
        abilities,
        inventoryItems,
        fixedAttributes,
        debuffs
      };

      const result = await runDiagnostic(currentData);
      setDiagnosticResult(result);
      
      if (result) {
        showToast(`Diagnóstico concluído: ${result.summary.overallStatus}`, 
          result.summary.overallStatus === 'PASSED' ? 'success' : 
          result.summary.overallStatus === 'WARNING' ? 'warning' : 'error'
        );
      }
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
      showToast('Erro ao executar diagnóstico', 'error');
    } finally {
      setIsRunning(false);
    }
  }, [characterData, abilities, inventoryItems, fixedAttributes, debuffs, runDiagnostic, showToast]);

  // Carregar lista de backups
  const loadBackups = useCallback(() => {
    try {
      const backups = getBackupList();
      setBackupList(backups);
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
      showToast('Erro ao carregar lista de backups', 'error');
    }
  }, [getBackupList, showToast]);

  // Restaurar backup
  const handleRestoreBackup = useCallback(async (backupId) => {
    try {
      const result = await restoreBackup(backupId);
      if (result.success) {
        loadBackups(); // Recarregar lista
        onClose(); // Fechar modal
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
    }
  }, [restoreBackup, loadBackups, onClose]);

  // Teste de save/load
  const testSaveLoad = useCallback(async () => {
    try {
      showToast('Iniciando teste de save/load...', 'info');
      
      // Teste de save
      const testData = {
        characterData: { ...characterData, testFlag: true },
        abilities,
        inventoryItems,
        fixedAttributes,
        debuffs
      };

      const saveResult = await saveAllData(testData);
      if (!saveResult.success) {
        throw new Error('Falha no teste de save');
      }

      // Teste de load
      const loadResult = await loadAllData();
      if (!loadResult.success) {
        throw new Error('Falha no teste de load');
      }

      showToast('Teste de save/load concluído com sucesso!', 'success');
      
      // Executar diagnóstico após teste
      await runFullDiagnostic();
      
    } catch (error) {
      console.error('Erro no teste:', error);
      showToast(`Erro no teste: ${error.message}`, 'error');
    }
  }, [characterData, abilities, inventoryItems, fixedAttributes, debuffs, saveAllData, loadAllData, showToast, runFullDiagnostic]);

  // Carregar dados iniciais
  useEffect(() => {
    if (isOpen) {
      loadBackups();
      if (!diagnosticResult) {
        runFullDiagnostic();
      }
    }
  }, [isOpen, loadBackups, runFullDiagnostic, diagnosticResult]);

  if (!isOpen) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'failed':
        return <XCircle className="text-red-400" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-400" size={16} />;
      default:
        return <Info className="text-gray-400" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASSED':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'WARNING':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'FAILED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-400" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white">Diagnóstico do Sistema de Salvamento</h2>
              <p className="text-sm text-gray-400">Verificação completa de integridade e performance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Database },
            { id: 'tests', label: 'Testes', icon: CheckCircle },
            { id: 'backups', label: 'Backups', icon: Clock },
            { id: 'details', label: 'Detalhes', icon: Info }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Geral */}
              {diagnosticResult && (
                <div className={`p-4 rounded-lg border ${getStatusColor(diagnosticResult.summary.overallStatus)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Status Geral do Sistema</h3>
                    <span className="text-2xl font-bold">
                      {diagnosticResult.summary.overallStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Testes Aprovados</div>
                      <div className="text-green-400 font-bold">{diagnosticResult.summary.passed}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Testes Falharam</div>
                      <div className="text-red-400 font-bold">{diagnosticResult.summary.failed}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Avisos</div>
                      <div className="text-yellow-400 font-bold">{diagnosticResult.summary.warnings}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Total</div>
                      <div className="text-white font-bold">{diagnosticResult.summary.total}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações Rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={runFullDiagnostic}
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className={isRunning ? 'animate-spin' : ''} size={20} />
                  {isRunning ? 'Executando...' : 'Executar Diagnóstico'}
                </button>
                
                <button
                  onClick={testSaveLoad}
                  className="flex items-center justify-center gap-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Database size={20} />
                  Testar Save/Load
                </button>
              </div>

              {/* Resumo dos Testes */}
              {diagnosticResult && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Resultados dos Testes</h3>
                  {diagnosticResult.tests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        test.status === 'passed' ? 'bg-green-400/20 text-green-400' :
                        test.status === 'failed' ? 'bg-red-400/20 text-red-400' :
                        test.status === 'warning' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-gray-400/20 text-gray-400'
                      }`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tests Tab */}
          {selectedTab === 'tests' && diagnosticResult && (
            <div className="space-y-4">
              {diagnosticResult.tests.map((test, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <h3 className="font-semibold">{test.name}</h3>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      test.status === 'passed' ? 'bg-green-400/20 text-green-400' :
                      test.status === 'failed' ? 'bg-red-400/20 text-red-400' :
                      test.status === 'warning' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-gray-400/20 text-gray-400'
                    }`}>
                      {test.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {test.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="text-sm text-gray-300">
                        • {detail}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Backups Tab */}
          {selectedTab === 'backups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Backups Disponíveis</h3>
                <button
                  onClick={loadBackups}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  <RefreshCw size={14} />
                  Atualizar
                </button>
              </div>

              {backupList.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Clock size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Nenhum backup encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {backupList.map((backup, index) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <div className="font-medium text-white">
                          Backup #{index + 1}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(backup.timestamp).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestoreBackup(backup.id)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        <Upload size={14} />
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {selectedTab === 'details' && diagnosticResult && (
            <div className="space-y-6">
              {/* Erros */}
              {diagnosticResult.errors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-400 mb-3">Erros Encontrados</h3>
                  <div className="space-y-3">
                    {diagnosticResult.errors.map((error, index) => (
                      <div key={index} className="bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                        <div className="font-medium text-red-400 mb-1">{error.type}</div>
                        <div className="text-sm text-gray-300 mb-2">{error.message}</div>
                        {error.solution && (
                          <div className="text-sm text-gray-400">
                            <strong>Solução:</strong> {error.solution}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avisos */}
              {diagnosticResult.warnings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-3">Avisos</h3>
                  <div className="space-y-3">
                    {diagnosticResult.warnings.map((warning, index) => (
                      <div key={index} className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
                        <div className="font-medium text-yellow-400 mb-1">{warning.type}</div>
                        <div className="text-sm text-gray-300 mb-2">{warning.message}</div>
                        {warning.solution && (
                          <div className="text-sm text-gray-400">
                            <strong>Recomendação:</strong> {warning.solution}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendações */}
              {diagnosticResult.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-400 mb-3">Recomendações</h3>
                  <div className="space-y-3">
                    {diagnosticResult.recommendations.map((rec, index) => (
                      <div key={index} className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            rec.priority === 'HIGH' ? 'bg-red-400/20 text-red-400' :
                            rec.priority === 'MEDIUM' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-green-400/20 text-green-400'
                          }`}>
                            {rec.priority}
                          </span>
                          <span className="font-medium text-blue-400">{rec.title}</span>
                        </div>
                        <div className="text-sm text-gray-300 mb-2">{rec.description}</div>
                        {rec.actions.length > 0 && (
                          <div className="text-sm text-gray-400">
                            <strong>Ações:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {rec.actions.map((action, actionIndex) => (
                                <li key={actionIndex}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações Técnicas */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-3">Informações Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Timestamp</div>
                    <div className="text-white">{new Date(diagnosticResult.timestamp).toLocaleString('pt-BR')}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Versão</div>
                    <div className="text-white">2.0</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="text-sm text-gray-400">
            {diagnosticResult && (
              <>Última verificação: {new Date(diagnosticResult.timestamp).toLocaleString('pt-BR')}</>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={runFullDiagnostic}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors"
            >
              <RefreshCw className={isRunning ? 'animate-spin' : ''} size={16} />
              {isRunning ? 'Executando...' : 'Executar Novamente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSystemDiagnostic;