# Guia de Troubleshooting - Sistema de Salvamento RPG

## Visão Gerall

Este guia fornece instruções detalhadas para diagnosticar e resolver problemas no sistema de salvamento do aplicativo RPG. O sistema foi projetado com múltiplas camadas de proteção e recuperação automática.

## 🔍 Diagnóstico Rápido

### Verificação Inicial
1. **Abra o aplicativo**
2. **Clique no botão "Diagnóstico"** (ícone de escudo laranja no header)
3. **Execute o diagnóstico completo**
4. **Analise os resultados**

### Interpretação dos Status
- ✅ **PASSED**: Sistema funcionando corretamente
- ⚠️ **WARNING**: Problemas menores que podem afetar performance
- ❌ **FAILED**: Problemas críticos que impedem o funcionamento

## 🚨 Problemas Comuns e Soluções

### 1. Dados Não Estão Sendo Salvos

#### Sintomas:
- Alterações são perdidas ao recarregar a página
- Mensagem de erro ao tentar salvar
- Botão "Save All" não responde

#### Diagnóstico:
```javascript
// Verificar conectividade do localStorage
const connectivity = checkStorageConnectivity();
console.log('Storage disponível:', connectivity.available);
console.log('Storage funcionando:', connectivity.working);
```

#### Soluções:

**Problema: localStorage Indisponível**
- **Causa**: Navegador em modo privado ou localStorage desabilitado
- **Solução**: 
  - Sair do modo privado/incógnito
  - Verificar configurações de privacidade do navegador
  - Habilitar armazenamento local nas configurações

**Problema: Quota de Armazenamento Excedida**
- **Causa**: Dados muito grandes ou quota do navegador esgotada
- **Solução**:
  ```javascript
  // Limpar dados antigos
  localStorage.clear();
  // Ou usar o sistema de limpeza automática
  await saveSystem.cleanupCorruptedData();
  ```

**Problema: Dados Corrompidos**
- **Causa**: Interrupção durante salvamento ou dados inválidos
- **Solução**:
  - Use o sistema de backup automático
  - Restaure um backup anterior via interface de diagnóstico

### 2. Dados Carregados Incorretamente

#### Sintomas:
- Campos em branco após carregar
- Valores incorretos nos atributos
- Erro "dados corrompidos"

#### Diagnóstico:
```javascript
// Verificar integridade dos dados
const diagnostic = await saveSystem.runDiagnostic(currentData);
console.log('Erros encontrados:', diagnostic.errors);
console.log('Avisos:', diagnostic.warnings);
```

#### Soluções:

**Problema: Checksum Inválido**
- **Causa**: Dados foram modificados externamente ou corrompidos
- **Solução**:
  1. Abrir diagnóstico → aba "Backups"
  2. Restaurar backup mais recente válido
  3. Se não houver backups, reimportar dados de arquivo JSON

**Problema: Estrutura de Dados Inválida**
- **Causa**: Versão incompatível ou dados malformados
- **Solução**:
  ```javascript
  // Sanitizar dados automaticamente
  const sanitizedData = DataValidator.sanitize(corruptedData);
  await saveSystem.saveData(sanitizedData);
  ```

### 3. Performance Lenta

#### Sintomas:
- Salvamento demora mais de 2 segundos
- Interface trava durante operações
- Mensagens de "operações lentas"

#### Diagnóstico:
- Execute teste de performance no diagnóstico
- Verifique tamanho dos dados na aba "Detalhes"

#### Soluções:

**Problema: Dados Muito Grandes**
- **Causa**: Muitos itens no inventário ou descrições muito longas
- **Solução**:
  - Limpar itens desnecessários do inventário
  - Reduzir tamanho das descrições
  - Habilitar compressão automática

**Problema: Muitas Operações Simultâneas**
- **Causa**: Auto-save muito frequente ou múltiplas operações
- **Solução**:
  ```javascript
  // Ajustar intervalo do auto-save
  saveSystem.disableAutoSave();
  saveSystem.enableAutoSave(getData, 60000); // 1 minuto
  ```

### 4. Backups Não Funcionam

#### Sintomas:
- Lista de backups vazia
- Erro ao restaurar backup
- Backups não são criados automaticamente

#### Diagnóstico:
```javascript
// Verificar sistema de backup
const backups = saveSystem.getBackupList();
console.log('Backups disponíveis:', backups.length);
```

#### Soluções:

**Problema: Backups Não São Criados**
- **Causa**: Erro no sistema de backup ou quota insuficiente
- **Solução**:
  - Limpar dados antigos para liberar espaço
  - Verificar permissões do navegador
  - Forçar criação manual de backup

**Problema: Backup Corrompido**
- **Causa**: Interrupção durante criação do backup
- **Solução**:
  - Criar novo backup manualmente
  - Exportar dados como arquivo JSON para backup externo

## 🛠️ Ferramentas de Diagnóstico

### Interface de Diagnóstico

#### Aba "Visão Geral"
- Status geral do sistema
- Resumo dos testes executados
- Ações rápidas para correção

#### Aba "Testes"
- Detalhes de cada teste executado
- Resultados específicos por componente
- Tempo de execução de cada teste

#### Aba "Backups"
- Lista de todos os backups disponíveis
- Opção de restaurar backup específico
- Informações de data/hora de cada backup

#### Aba "Detalhes"
- Erros críticos encontrados
- Avisos e recomendações
- Informações técnicas do sistema

### Comandos de Console

```javascript
// Verificar conectividade
import { checkStorageConnectivity } from './utils/saveSystemDiagnostics.js';
const status = checkStorageConnectivity();

// Executar diagnóstico completo
import { runQuickDiagnostic } from './utils/saveSystemDiagnostics.js';
const result = await runQuickDiagnostic(currentData);

// Limpar dados corrompidos
import { getSaveSystem } from './utils/robustSaveSystem.js';
const saveSystem = getSaveSystem();
await saveSystem.cleanupCorruptedData();

// Forçar backup
await saveSystem.createBackup();

// Verificar integridade
import { DataValidator } from './utils/robustSaveSystem.js';
const validation = DataValidator.validate(data);
```

## 🔧 Soluções Avançadas

### Recuperação de Dados Perdidos

#### Método 1: Backup Automático
1. Abrir diagnóstico → aba "Backups"
2. Selecionar backup mais recente
3. Clicar em "Restaurar"

#### Método 2: Arquivo de Exportação
1. Localizar arquivo JSON exportado anteriormente
2. Usar função de importação no aplicativo
3. Validar dados importados

#### Método 3: Recuperação Manual
```javascript
// Acessar dados brutos do localStorage
const rawData = localStorage.getItem('rpg_character_data');
if (rawData) {
  try {
    const data = JSON.parse(rawData);
    console.log('Dados encontrados:', data);
    // Sanitizar e reimportar
    const clean = DataValidator.sanitize(data);
    await saveSystem.saveData(clean);
  } catch (error) {
    console.error('Dados corrompidos:', error);
  }
}
```

### Otimização de Performance

#### Configurações Recomendadas
```javascript
// Sistema otimizado para dados grandes
const optimizedConfig = {
  COMPRESSION_ENABLED: true,
  AUTO_SAVE_INTERVAL: 60000, // 1 minuto
  MAX_BACKUPS: 3,
  RETRY_ATTEMPTS: 2,
  VALIDATION_ENABLED: true
};

const saveSystem = createSaveSystem(optimizedConfig);
```

#### Limpeza Preventiva
```javascript
// Executar limpeza semanal
setInterval(async () => {
  await saveSystem.cleanupCorruptedData();
  console.log('Limpeza preventiva executada');
}, 7 * 24 * 60 * 60 * 1000); // 7 dias
```

### Monitoramento Contínuo

#### Configurar Alertas
```javascript
// Monitorar erros de salvamento
saveSystem.on('save-error', (error) => {
  console.error('Erro crítico de salvamento:', error);
  // Enviar alerta ou notificação
  showToast('Erro crítico no salvamento! Verifique o diagnóstico.', 'error');
});

// Monitorar avisos de validação
saveSystem.on('validation-warnings', (warnings) => {
  if (warnings.length > 5) {
    showToast('Muitos avisos de validação. Execute diagnóstico.', 'warning');
  }
});
```

## 📊 Códigos de Erro

### Erros de Armazenamento
- **STORAGE_UNAVAILABLE**: localStorage não disponível
- **STORAGE_READ_WRITE_ERROR**: Falha na leitura/escrita
- **STORAGE_ACCESS_ERROR**: Sem permissão de acesso
- **QUOTA_EXCEEDED**: Quota de armazenamento excedida

### Erros de Dados
- **MISSING_REQUIRED_FIELDS**: Campos obrigatórios ausentes
- **INVALID_DATA_TYPES**: Tipos de dados incorretos
- **DATA_CORRUPTION**: Dados corrompidos durante operação
- **SERIALIZATION_ERROR**: Falha na serialização/deserialização

### Erros de Sistema
- **DIAGNOSTIC_ERROR**: Erro durante diagnóstico
- **BACKUP_ERROR**: Falha no sistema de backup
- **VALIDATION_ERROR**: Erro na validação de dados
- **PERFORMANCE_ERROR**: Performance inadequada

## 🆘 Suporte de Emergência

### Quando Tudo Falha

#### Opção 1: Reset Completo
```javascript
// ⚠️ ATENÇÃO: Isso apagará TODOS os dados
localStorage.clear();
location.reload();
```

#### Opção 2: Modo de Recuperação
1. Abrir console do navegador (F12)
2. Executar diagnóstico manual
3. Tentar recuperação automática
4. Exportar dados restantes

#### Opção 3: Backup Externo
1. Sempre manter arquivos JSON exportados
2. Usar sistema de versionamento (Git) para dados importantes
3. Fazer backup regular em nuvem

### Contato para Suporte
- **Logs**: Sempre incluir resultado do diagnóstico
- **Reprodução**: Passos detalhados para reproduzir o problema
- **Ambiente**: Navegador, versão, sistema operacional
- **Dados**: Arquivo JSON de exemplo (sem dados sensíveis)

## 📈 Prevenção de Problemas

### Boas Práticas
1. **Execute diagnóstico semanalmente**
2. **Mantenha backups externos regulares**
3. **Monitore o tamanho dos dados**
4. **Use navegadores atualizados**
5. **Evite fechar o navegador durante salvamento**

### Configuração Recomendada
- Auto-save habilitado com intervalo de 30-60 segundos
- Máximo de 5 backups automáticos
- Compressão habilitada para dados grandes
- Validação sempre ativa
- Monitoramento de performance ativo

### Sinais de Alerta
- ⚠️ Salvamento demora mais de 2 segundos
- ⚠️ Mais de 3 avisos de validação
- ⚠️ Uso de armazenamento acima de 80%
- ⚠️ Falhas frequentes de conectividade
- ⚠️ Dados inconsistentes entre sessões

---

**Última atualização**: Janeiro 2025  
**Versão do sistema**: 2.0  
**Compatibilidade**: Navegadores modernos com suporte a ES6+