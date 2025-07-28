import React, { useState, useCallback, useMemo } from 'react';
import { Pin, Upload, AlertCircle } from 'lucide-react';
import { useValidation, useDebounce } from '../hooks';
import { useTheme } from './ThemeProvider';
import { useAppContext } from '../contexts/AppContext'; // ✅ Importar o contexto

// Componente otimizado para inputs com validação
const ValidatedInput = React.memo(({
  id,
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  placeholder = '',
  maxLength,
  min,
  max,
  required = false,
  fieldName,
  ...props
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const { validateCharacterField } = useValidation();
  const debouncedValue = useDebounce(value, 300);
  
  // Validar quando o valor debounced muda
  React.useEffect(() => {
    if (touched && fieldName) {
      const validation = validateCharacterField(fieldName, debouncedValue);
      setError(validation.isValid ? '' : validation.error);
    }
  }, [debouncedValue, touched, fieldName, validateCharacterField]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (fieldName) {
      const validation = validateCharacterField(fieldName, value);
      setError(validation.isValid ? '' : validation.error);
    }
  }, [value, fieldName, validateCharacterField]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    
    // Validação em tempo real para casos críticos
    if (type === 'number' && newValue !== '') {
      const numValue = Number(newValue);
      if (isNaN(numValue) || (min !== undefined && numValue < min) || (max !== undefined && numValue > max)) {
        return; // Não permitir entrada inválida
      }
    }
    
    onChange(e);
  }, [onChange, type, min, max]);

  return (
    <div className="relative">
      <label 
        htmlFor={id} 
        className={`block text-sm font-bold mb-1 ${error ? 'text-red-400' : 'text-gray-400'}`}
      >
        {label}:
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`
          w-full p-2 rounded-md focus:outline-none focus:ring-2 transition-all duration-200
          ${error 
            ? 'border-2 border-red-500 bg-red-950/20 focus:ring-red-500' 
            : 'border border-gray-600 bg-gray-900 focus:ring-blue-500'
          }
          text-white placeholder-gray-500 ${className}
        `}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <div 
          id={`${id}-error`}
          className="flex items-center gap-1 mt-1 text-red-400 text-xs"
          role="alert"
        >
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </div>
  );
});

ValidatedInput.displayName = 'ValidatedInput';

// ✅ Componente principal corrigido - usando contexto diretamente
function CharacterSheet({ onFixAttributes }) {
  const theme = useTheme();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  // ✅ Usar o contexto diretamente ao invés de props
  const { characterData, updateCharacterData, showToast } = useAppContext();

  // Sistema de toast simples (fallback)
  const showToastFallback = useCallback((message, type = 'info') => {
    if (showToast) {
      showToast(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
      alert(message);
    }
  }, [showToast]);

  // ✅ Dados com valores padrão seguros
  const safeCharacterData = useMemo(() => ({
    name: characterData?.name || '',
    race: characterData?.race || '',
    height: characterData?.height || '',
    age: characterData?.age || '',
    homeland: characterData?.homeland || '',
    religion: characterData?.religion || '',
    fear: characterData?.fear || '',
    hp: characterData?.hp || '',
    mana: characterData?.mana || '',
    aura: characterData?.aura || '',
    er: characterData?.er || '',
    en: characterData?.en || '',
    ep: characterData?.ep || '',
    ea: characterData?.ea || '',
    vigor: characterData?.vigor || '',
    strength: characterData?.strength || '',
    dexterity: characterData?.dexterity || '',
    agility: characterData?.agility || '',
    rarity: characterData?.rarity || '',
    animalHandling: characterData?.animalHandling || '',
    stealth: characterData?.stealth || '',
    adaptability: characterData?.adaptability || '',
    perception: characterData?.perception || '',
    intuition: characterData?.intuition || '',
    athletics: characterData?.athletics || '',
    initiative: characterData?.initiative || '',
    successBoxes: characterData?.successBoxes || [false, false, false, false],
    failureBoxes: characterData?.failureBoxes || [false, false, false, false],
    characterImage: characterData?.characterImage || ''
  }), [characterData]);

  // Desestruturar os dados seguros da ficha
  const {
    name, race, height, age, homeland, religion, fear,
    hp, mana, aura, er, en, ep, ea,
    vigor, strength, dexterity, agility, rarity, animalHandling,
    stealth, adaptability, perception, intuition, athletics, initiative,
    successBoxes, failureBoxes, characterImage
  } = safeCharacterData;

  // ✅ Função otimizada para atualizar campos
  const updateCharacterField = useCallback((field, value) => {
    if (typeof updateCharacterData !== 'function') {
      console.error('updateCharacterData não está disponível no contexto');
      return;
    }

    try {
      updateCharacterData({ [field]: value });
    } catch (error) {
      console.error('Erro ao atualizar campo:', error);
      showToastFallback('Erro ao atualizar campo', 'error');
    }
  }, [updateCharacterData, showToastFallback]);

  // Handler para upload de imagem com validação
  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validações
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      setImageError('Imagem muito grande (máximo 5MB)');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setImageError('Tipo de arquivo não suportado (apenas JPEG, PNG, GIF, WebP)');
      return;
    }

    setImageLoading(true);
    setImageError('');

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCharacterField('characterImage', reader.result);
        setImageLoading(false);
      };
      reader.onerror = () => {
        setImageError('Erro ao carregar imagem');
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setImageError('Erro ao processar imagem');
      setImageLoading(false);
    }
  }, [updateCharacterField]);

  // Handlers para checkboxes otimizados
  const toggleSuccessBox = useCallback((index) => {
    const newBoxes = [...successBoxes];
    newBoxes[index] = !newBoxes[index];
    updateCharacterField('successBoxes', newBoxes);
  }, [successBoxes, updateCharacterField]);

  const toggleFailureBox = useCallback((index) => {
    const newBoxes = [...failureBoxes];
    newBoxes[index] = !newBoxes[index];
    updateCharacterField('failureBoxes', newBoxes);
  }, [failureBoxes, updateCharacterField]);

  // Função otimizada para fixar atributos com validação
  const handleFixAttributes = useCallback(() => {
    const attributesToFix = [];
    const attributeMap = {
      hp: { name: 'HP', color: 'text-red-400' },
      mana: { name: 'MANA', color: 'text-blue-400' },
      aura: { name: 'AURA', color: 'text-white' },
      er: { name: 'ER', color: 'text-cyan-300' },
      en: { name: 'EN', color: 'text-red-800' },
      ep: { name: 'EP', color: 'text-green-400' },
      ea: { name: 'EA', color: 'text-yellow-400' },
    };

    const fieldsToCollect = ['hp', 'mana', 'aura', 'er', 'en', 'ep', 'ea'];

    fieldsToCollect.forEach(field => {
      const value = safeCharacterData[field];
      if (value !== '' && value !== null && value !== undefined) {
        const numValue = parseFloat(value);
        attributesToFix.push({
          name: attributeMap[field].name,
          value: isNaN(numValue) ? value : numValue,
          color: attributeMap[field].color
        });
      }
    });

    if (attributesToFix.length === 0) {
      showToastFallback('Nenhum atributo válido para fixar', 'warning');
      return;
    }

    if (onFixAttributes) {
      onFixAttributes(attributesToFix);
    }
  }, [safeCharacterData, onFixAttributes, showToastFallback]);

  // Memoizar grupos de campos para otimização
  const basicInfoFields = useMemo(() => (
    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ValidatedInput
        id="name"
        label="NOME"
        value={name}
        onChange={(e) => updateCharacterField('name', e.target.value)}
        fieldName="name"
        maxLength={50}
        placeholder="Nome do personagem"
      />
      <ValidatedInput
        id="religion"
        label="RELIGIÃO"
        value={religion}
        onChange={(e) => updateCharacterField('religion', e.target.value)}
        maxLength={30}
        placeholder="Crença religiosa"
      />
      <ValidatedInput
        id="height"
        label="ALTURA"
        value={height}
        onChange={(e) => updateCharacterField('height', e.target.value)}
        maxLength={20}
        placeholder="Ex: 1,75m"
      />
      <ValidatedInput
        id="race"
        label="RAÇA"
        value={race}
        onChange={(e) => updateCharacterField('race', e.target.value)}
        maxLength={30}
        placeholder="Raça do personagem"
      />
      <ValidatedInput
        id="age"
        label="IDADE"
        type="number"
        value={age}
        onChange={(e) => updateCharacterField('age', e.target.value)}
        min={0}
        max={9999}
        placeholder="Anos"
      />
      <ValidatedInput
        id="fear"
        label="MEDO"
        value={fear}
        onChange={(e) => updateCharacterField('fear', e.target.value)}
        maxLength={50}
        placeholder="Maior medo"
      />
      <div className="col-span-1 sm:col-span-2">
        <ValidatedInput
          id="homeland"
          label="REINO NATAL"
          value={homeland}
          onChange={(e) => updateCharacterField('homeland', e.target.value)}
          maxLength={50}
          placeholder="Local de origem"
        />
      </div>
    </div>
  ), [name, religion, height, race, age, fear, homeland, updateCharacterField]);

  const statusFields = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-lg">
      {/* Primeira linha: HP e AURA */}
      <ValidatedInput
        id="hp"
        label="HP"
        type="number"
        value={hp}
        onChange={(e) => updateCharacterField('hp', e.target.value)}
        fieldName="hp"
        min={0}
        max={9999}
        className="border-red-500 focus:ring-red-500"
      />
      <ValidatedInput
        id="aura"
        label="AURA"
        type="number"
        value={aura}
        onChange={(e) => updateCharacterField('aura', e.target.value)}
        fieldName="aura"
        min={0}
        max={9999}
        className="border-gray-400 focus:ring-gray-400"
      />
      
      {/* Segunda linha: MANA e EN */}
      <ValidatedInput
        id="mana"
        label="MANA"
        type="number"
        value={mana}
        onChange={(e) => updateCharacterField('mana', e.target.value)}
        fieldName="mana"
        min={0}
        max={9999}
        className="border-blue-500 focus:ring-blue-500"
      />
      <ValidatedInput
        id="en"
        label="EN"
        type="number"
        value={en}
        onChange={(e) => updateCharacterField('en', e.target.value)}
        min={0}
        max={9999}
        className="border-red-800 focus:ring-red-800"
      />
      
      {/* Terceira linha: EP, EA, ER */}
      <ValidatedInput
        id="ep"
        label="EP"
        type="number"
        value={ep}
        onChange={(e) => updateCharacterField('ep', e.target.value)}
        min={0}
        max={9999}
        className="border-green-500 focus:ring-green-500"
      />
      <ValidatedInput
        id="ea"
        label="EA"
        type="number"
        value={ea}
        onChange={(e) => updateCharacterField('ea', e.target.value)}
        min={0}
        max={9999}
        className="border-yellow-500 focus:ring-yellow-500"
      />
      <ValidatedInput
        id="er"
        label="ER"
        type="number"
        value={er}
        onChange={(e) => updateCharacterField('er', e.target.value)}
        min={0}
        max={9999}
        className="border-cyan-300 focus:ring-cyan-300"
      />
      
      {/* Botão Fixar Atributos */}
      <div className="col-span-full sm:col-span-2 md:col-span-1 flex items-end justify-center">
        <button
          onClick={handleFixAttributes}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-red-500/30 
            transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 
            focus:ring-offset-2 focus:ring-offset-gray-900 uppercase tracking-wider text-sm font-bold
            ${theme.classes.button} ${theme.classes.text}
          `}
          aria-label="Fixar atributos principais na barra lateral"
        >
          <Pin size={16} className="text-red-200" />
          FIXAR STATS
        </button>
      </div>
    </div>
  ), [hp, aura, mana, en, ep, ea, er, updateCharacterField, handleFixAttributes, theme.classes]);

  const secondaryAttributesFields = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
      <ValidatedInput
        id="vigor"
        label="VIGOR"
        type="number"
        value={vigor}
        onChange={(e) => updateCharacterField('vigor', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="stealth"
        label="FURTIVIDADE"
        type="number"
        value={stealth}
        onChange={(e) => updateCharacterField('stealth', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="strength"
        label="FORÇA"
        type="number"
        value={strength}
        onChange={(e) => updateCharacterField('strength', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="adaptability"
        label="ADAPTABILIDADE"
        type="number"
        value={adaptability}
        onChange={(e) => updateCharacterField('adaptability', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="dexterity"
        label="DESTREZA"
        type="number"
        value={dexterity}
        onChange={(e) => updateCharacterField('dexterity', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="perception"
        label="PERCEPÇÃO"
        type="number"
        value={perception}
        onChange={(e) => updateCharacterField('perception', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="agility"
        label="AGILIDADE"
        type="number"
        value={agility}
        onChange={(e) => updateCharacterField('agility', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="intuition"
        label="INTUIÇÃO"
        type="number"
        value={intuition}
        onChange={(e) => updateCharacterField('intuition', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="rarity"
        label="RARIDADE"
        type="number"
        value={rarity}
        onChange={(e) => updateCharacterField('rarity', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="athletics"
        label="ATLETISMO"
        type="number"
        value={athletics}
        onChange={(e) => updateCharacterField('athletics', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="animalHandling"
        label="LIDAR COM ANIMAIS"
        type="number"
        value={animalHandling}
        onChange={(e) => updateCharacterField('animalHandling', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
      <ValidatedInput
        id="initiative"
        label="INICIATIVA"
        type="number"
        value={initiative}
        onChange={(e) => updateCharacterField('initiative', e.target.value)}
        min={0}
        max={999}
        className="border-pink-500 focus:ring-pink-500"
      />
    </div>
  ), [vigor, stealth, strength, adaptability, dexterity, perception, agility, intuition, rarity, athletics, animalHandling, initiative, updateCharacterField]);

  return (
    <div className={`${theme.classes.card} ${theme.classes.cardBorder} backdrop-blur-sm rounded-lg border p-6 relative z-20`}>
      {/* Seção de Informações Básicas */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
          {/* Imagem do Personagem */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-gray-900 border border-gray-700 rounded-md">
            <div className="w-40 h-40 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600 mb-4 relative">
              {imageLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : characterImage ? (
                <img 
                  src={characterImage} 
                  alt="Personagem" 
                  className="w-full h-full object-cover"
                  onError={() => setImageError('Erro ao carregar imagem')}
                />
              ) : (
                <span className="text-gray-400 text-sm text-center px-2">SUA IMAGEM</span>
              )}
            </div>
            
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={imageLoading}
              aria-describedby="image-help"
            />
            
            <label
              htmlFor="imageUpload"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md shadow-md cursor-pointer 
                transition-all duration-200 font-bold text-sm
                ${imageLoading 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-orange-600 hover:bg-orange-700 hover:scale-105'
                } 
                text-white focus-within:ring-2 focus-within:ring-orange-500/50
              `}
            >
              <Upload size={16} />
              {imageLoading ? 'CARREGANDO...' : 'CARREGAR IMAGEM'}
            </label>
            
            <div id="image-help" className="text-xs text-gray-500 mt-2 text-center">
              Máximo 5MB • JPEG, PNG, GIF, WebP
            </div>
            
            {imageError && (
              <div className="flex items-center gap-1 mt-2 text-red-400 text-xs" role="alert">
                <AlertCircle size={12} />
                {imageError}
              </div>
            )}
          </div>

          {/* Campos de Informações Básicas */}
          {basicInfoFields}
        </div>
      </section>

      {/* Seção de Status Principais */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 uppercase tracking-wider">
          Status Principais
        </h3>
        {statusFields}
      </section>

      {/* Seção de Atributos Secundários */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 uppercase tracking-wider">
          Atributos Secundários
        </h3>
        {secondaryAttributesFields}
      </section>

      {/* Seção Balança da Vida */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700 text-center">
        <h4 className="text-2xl font-medium text-orange-300 mb-4 uppercase tracking-wider">
          BALANÇA DA VIDA
        </h4>
        <div className="flex justify-center items-center space-x-8">
          {/* Sucesso */}
          <div>
            <p className="text-lg font-semibold text-green-400 mb-2">Sucesso:</p>
            <div className="flex space-x-2" role="group" aria-label="Caixas de sucesso">
              {successBoxes.map((isChecked, index) => (
                <button
                  key={`success-${index}`}
                  onClick={() => toggleSuccessBox(index)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50
                    ${isChecked 
                      ? 'bg-green-500 border-green-700 transform scale-110' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600 hover:scale-105'
                    }
                  `}
                  aria-label={`Caixa de sucesso ${index + 1} ${isChecked ? 'marcada' : 'desmarcada'}`}
                  aria-pressed={isChecked}
                />
              ))}
            </div>
          </div>
          
          {/* Fracasso */}
          <div>
            <p className="text-lg font-semibold text-red-400 mb-2">Fracasso:</p>
            <div className="flex space-x-2" role="group" aria-label="Caixas de fracasso">
              {failureBoxes.map((isChecked, index) => (
                <button
                  key={`failure-${index}`}
                  onClick={() => toggleFailureBox(index)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50
                    ${isChecked 
                      ? 'bg-red-500 border-red-700 transform scale-110' 
                      : 'bg-gray-700 border-gray-500 hover:bg-gray-600 hover:scale-105'
                    }
                  `}
                  aria-label={`Caixa de fracasso ${index + 1} ${isChecked ? 'marcada' : 'desmarcada'}`}
                  aria-pressed={isChecked}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Contador visual */}
        <div className="mt-4 text-sm text-gray-400">
          <span className="inline-flex items-center gap-2">
            <span className="text-green-400">
              Sucessos: {successBoxes.filter(Boolean).length}/4
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-red-400">
              Fracassos: {failureBoxes.filter(Boolean).length}/4
            </span>
          </span>
        </div>
      </section>

      {/* Seção de Atalhos de Teclado (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <section className="p-4 bg-gray-800/40 rounded-md border border-gray-700/50">
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 transition-colors">
              ⌨️ Atalhos de Teclado (Dev)
            </summary>
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p><kbd className="px-1 bg-gray-700 rounded">Ctrl+S</kbd> - Salvar dados</p>
              <p><kbd className="px-1 bg-gray-700 rounded">Ctrl+L</kbd> - Carregar dados</p>
              <p><kbd className="px-1 bg-gray-700 rounded">Tab</kbd> - Navegar entre campos</p>
              <p><kbd className="px-1 bg-gray-700 rounded">Enter</kbd> - Confirmar/Ativar</p>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}

export default React.memo(CharacterSheet);