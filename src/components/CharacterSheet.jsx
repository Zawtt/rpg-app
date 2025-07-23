import React, { useState, useEffect } from 'react';

// CharacterSheet agora recebe characterData, setCharacterData E onFixAttributes como props
function CharacterSheet({ characterData, setCharacterData, onFixAttributes }) {
  // Desestruturar os dados da ficha para os estados locais
  const {
    name, race, height, age, homeland, religion, fear,
    hp, mana, aura, er, en, ep, ea,
    vigor, strength, dexterity, agility, rarity, animalHandling,
    stealth, adaptability, perception, intuition, athletics, initiative,
    successBoxes, failureBoxes, characterImage
  } = characterData;

  // Funções para atualizar os estados locais e, consequentemente, o estado global via setCharacterData
  const updateCharacterField = (field, value) => {
    setCharacterData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Função para lidar com o upload da imagem
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCharacterField('characterImage', reader.result); // Atualiza a imagem no estado global
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSuccessBox = (index) => {
    const newBoxes = [...successBoxes];
    newBoxes[index] = !newBoxes[index];
    updateCharacterField('successBoxes', newBoxes);
  };

  const toggleFailureBox = (index) => {
    const newBoxes = [...failureBoxes];
    newBoxes[index] = !newBoxes[index];
    updateCharacterField('failureBoxes', newBoxes);
  };

  // ATUALIZADO: Função para coletar e fixar APENAS os atributos desejados
  const handleFixAttributes = () => {
    const attributesToFix = [];
    // Mapeamento de chaves de estado para nomes amigáveis para exibição
    // APENAS os atributos que você quer fixar
    const attributeMap = {
      hp: 'HP', mana: 'MANA', aura: 'AURA', er: 'ER', en: 'EN', ep: 'EP', ea: 'EA',
    };

    // Coleta APENAS os campos específicos
    const fieldsToCollect = ['hp', 'mana', 'aura', 'er', 'en', 'ep', 'ea'];

    fieldsToCollect.forEach(field => {
      const value = characterData[field];
      // Verifica se o valor não está vazio, nulo ou indefinido
      // E converte para número se for um campo numérico, para evitar strings vazias sendo fixadas
      if (value !== '' && value !== null && value !== undefined) {
        attributesToFix.push({
          name: attributeMap[field], // Usa o nome amigável
          value: parseFloat(value) || value // Converte para número se possível, senão mantém o valor original
        });
      }
    });

    // Chama a função passada via props para atualizar o estado no componente pai (App.jsx)
    if (onFixAttributes) {
      onFixAttributes(attributesToFix);
    }
  };


  // Define as classes de estilo para os inputs de status com base na imagem
  const statusInputClass = (colorClass) => `w-full p-2 bg-gray-900 border-2 rounded-md focus:outline-none focus:ring-2 text-white placeholder-gray-500 ${colorClass}`;
  const statusLabelClass = (colorClass) => `block text-sm font-bold mb-1 ${colorClass}`;

  return (
    <div className="bg-gray-800/60 rounded-lg border border-gray-700 p-6">
      {/* Seção de Informações Básicas */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
          {/* Imagem do Personagem */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-gray-900 border border-gray-700 rounded-md">
            <div className="w-40 h-40 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600 mb-4">
              {characterImage ? (
                <img src={characterImage} alt="Personagem" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">SUA IMAGEM</span>
              )}
            </div>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              className="hidden" // Esconde o input de arquivo original
              onChange={handleImageUpload}
            />
            <label
              htmlFor="imageUpload"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md shadow-md cursor-pointer transition-colors duration-200"
            >
              CARREGAR IMAGEM
            </label>
          </div>

          {/* Campos de Texto (Nome, Altura, Raça, Idade, Reino Natal) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-400 text-sm font-bold mb-1">NOME:</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                value={name}
                onChange={(e) => updateCharacterField('name', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="religion" className="block text-gray-400 text-sm font-bold mb-1">RELIGIÃO:</label>
              <input
                type="text"
                id="religion"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                value={religion}
                onChange={(e) => updateCharacterField('religion', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-gray-400 text-sm font-bold mb-1">ALTURA:</label>
              <input
                type="text"
                id="height"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                value={height}
                onChange={(e) => updateCharacterField('height', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="race" className="block text-gray-400 text-sm font-bold mb-1">RAÇA:</label>
              <input
                type="text"
                id="race"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                value={race}
                onChange={(e) => updateCharacterField('race', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-gray-400 text-sm font-bold mb-1">IDADE:</label>
              <input
                type="number"
                id="age"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                value={age}
                onChange={(e) => updateCharacterField('age', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fear" className="block text-gray-400 text-sm font-bold mb-1">MEDO:</label>
              <input
                type="text"
                id="fear"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                value={fear}
                onChange={(e) => updateCharacterField('fear', e.target.value)}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label htmlFor="homeland" className="block text-gray-400 text-sm font-bold mb-1">REINO NATAL:</label>
              <input
                type="text"
                id="homeland"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                value={homeland}
                onChange={(e) => updateCharacterField('homeland', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Status Principais (HP, MANA, etc.) - Cores conforme imagem */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-lg">
          <div>
            <label htmlFor="hp" className={statusLabelClass('text-red-400')}>HP:</label>
            <input type="number" id="hp" className={statusInputClass('border-red-500 focus:ring-red-500')}
              value={hp} onChange={(e) => updateCharacterField('hp', e.target.value)} />
          </div>
          <div>
            <label htmlFor="en" className={statusLabelClass('text-blue-400')}>EN:</label>
            <input type="number" id="en" className={statusInputClass('border-blue-500 focus:ring-blue-500')}
              value={en} onChange={(e) => updateCharacterField('en', e.target.value)} />
          </div>
          <div>
            <label htmlFor="mana" className={statusLabelClass('text-blue-400')}>MANA:</label>
            <input type="number" id="mana" className={statusInputClass('border-blue-500 focus:ring-blue-500')}
              value={mana} onChange={(e) => updateCharacterField('mana', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ep" className={statusLabelClass('text-green-400')}>EP:</label>
            <input type="number" id="ep" className={statusInputClass('border-green-500 focus:ring-green-500')}
              value={ep} onChange={(e) => updateCharacterField('ep', e.target.value)} />
          </div>
          <div>
            <label htmlFor="aura" className={statusLabelClass('text-green-400')}>AURA:</label>
            <input type="number" id="aura" className={statusInputClass('border-green-500 focus:ring-green-500')}
              value={aura} onChange={(e) => updateCharacterField('aura', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ea" className={statusLabelClass('text-yellow-400')}>EA:</label>
            <input type="number" id="ea" className={statusInputClass('border-yellow-500 focus:ring-yellow-500')}
              value={ea} onChange={(e) => updateCharacterField('ea', e.target.value)} />
          </div>
          <div>
            <label htmlFor="er" className={statusLabelClass('text-orange-400')}>ER:</label>
            <input type="number" id="er" className={statusInputClass('border-orange-500 focus:ring-orange-500')}
              value={er} onChange={(e) => updateCharacterField('er', e.target.value)} />
          </div>
          {/* ATUALIZADO: Botão Fixar Atributos Base - Menor e Centralizado */}
          <div className="col-span-full sm:col-span-2 md:col-span-1 flex items-end justify-center"> {/* Adicionado justify-center */}
            <button
              onClick={handleFixAttributes}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded-md shadow-md transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75" // py-1 px-3 para menor padding
            >
              FIXAR ATRIBUTOS BASE
            </button>
          </div>
        </div>
      </section>

      {/* Seção de Atributos Secundários */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
          <div>
            <label htmlFor="vigor" className="block text-gray-400 text-sm font-bold mb-1">VIGOR:</label>
            <input type="number" id="vigor" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={vigor} onChange={(e) => updateCharacterField('vigor', e.target.value)} />
          </div>
          <div>
            <label htmlFor="stealth" className="block text-gray-400 text-sm font-bold mb-1">FURTIVIDADE:</label>
            <input type="number" id="stealth" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={stealth} onChange={(e) => updateCharacterField('stealth', e.target.value)} />
          </div>
          <div>
            <label htmlFor="strength" className="block text-gray-400 text-sm font-bold mb-1">FORÇA:</label>
            <input type="number" id="strength" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={strength} onChange={(e) => updateCharacterField('strength', e.target.value)} />
          </div>
          <div>
            <label htmlFor="adaptability" className="block text-gray-400 text-sm font-bold mb-1">ADAPTABILIDADE:</label>
            <input type="number" id="adaptability" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={adaptability} onChange={(e) => updateCharacterField('adaptability', e.target.value)} />
          </div>
          <div>
            <label htmlFor="dexterity" className="block text-gray-400 text-sm font-bold mb-1">DESTREZA:</label>
            <input type="number" id="dexterity" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={dexterity} onChange={(e) => updateCharacterField('dexterity', e.target.value)} />
          </div>
          <div>
            <label htmlFor="perception" className="block text-gray-400 text-sm font-bold mb-1">PERCEPÇÃO:</label>
            <input type="number" id="perception" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={perception} onChange={(e) => updateCharacterField('perception', e.target.value)} />
          </div>
          <div>
            <label htmlFor="agility" className="block text-gray-400 text-sm font-bold mb-1">AGILIDADE:</label>
            <input type="number" id="agility" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={agility} onChange={(e) => updateCharacterField('agility', e.target.value)} />
          </div>
          <div>
            <label htmlFor="intuition" className="block text-gray-400 text-sm font-bold mb-1">INTUIÇÃO:</label>
            <input type="number" id="intuition" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={intuition} onChange={(e) => updateCharacterField('intuition', e.target.value)} />
          </div>
          <div>
            <label htmlFor="rarity" className="block text-gray-400 text-sm font-bold mb-1">RARIDADE:</label>
            <input type="number" id="rarity" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={rarity} onChange={(e) => updateCharacterField('rarity', e.target.value)} />
          </div>
          <div>
            <label htmlFor="athletics" className="block text-gray-400 text-sm font-bold mb-1">ATLETISMO:</label>
            <input type="number" id="athletics" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={athletics} onChange={(e) => updateCharacterField('athletics', e.target.value)} />
          </div>
          <div>
            <label htmlFor="animalHandling" className="block text-gray-400 text-sm font-bold mb-1">LIDAR COM ANIMAIS:</label>
            <input type="number" id="animalHandling" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={animalHandling} onChange={(e) => updateCharacterField('animalHandling', e.target.value)} />
          </div>
          <div>
            <label htmlFor="initiative" className="block text-gray-400 text-sm font-bold mb-1">INICIATIVA:</label>
            <input type="number" id="initiative" className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500"
              value={initiative} onChange={(e) => updateCharacterField('initiative', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Seção Balança da Vida (Sucesso/Fracasso) */}
      <section className="mb-8 p-4 bg-gray-800/60 rounded-md border border-gray-700 text-center">
        <h4 className="text-2xl font-medium text-orange-300 mb-4">BALANÇA DA VIDA</h4>
        <div className="flex justify-center items-center space-x-8">
          <div>
            <p className="text-lg font-semibold text-green-400 mb-2">Sucesso:</p>
            <div className="flex space-x-2">
              {successBoxes.map((isChecked, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-colors duration-200 ${
                    isChecked ? 'bg-green-500 border-green-700' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                  onClick={() => toggleSuccessBox(index)}
                ></div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-red-400 mb-2">Fracasso:</p>
            <div className="flex space-x-2">
              {failureBoxes.map((isChecked, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-colors duration-200 ${
                    isChecked ? 'bg-red-500 border-red-700' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'
                  }`}
                  onClick={() => toggleFailureBox(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Os botões de salvar/carregar foram movidos para App.jsx */}
    </div>
  );
}

export default CharacterSheet;
