import React, { useState } from 'react';

function AbilitiesAndSpells({ abilities, setAbilities }) { // Recebe abilities e setAbilities via props
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityCost, setNewAbilityCost] = useState('');
  const [newAbilityDescription, setNewAbilityDescription] = useState('');

  const addAbility = () => {
    if (newAbilityName.trim() !== '') {
      setAbilities(prevAbilities => [
        ...prevAbilities,
        {
          name: newAbilityName.trim(),
          cost: newAbilityCost.trim(),
          description: newAbilityDescription.trim()
        }
      ]);
      setNewAbilityName('');
      setNewAbilityCost('');
      setNewAbilityDescription('');
    }
  };

  const removeAbility = (indexToRemove) => {
    setAbilities(prevAbilities => prevAbilities.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="p-6 bg-gray-700/50 rounded-lg shadow-xl border border-gray-600 backdrop-blur-sm">
      <h3 className="text-3xl font-semibold text-purple-300 mb-6">HABILIDADES & MAGIAS</h3>

      {/* Adicionar Nova Habilidade */}
      <div className="mb-6 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <h4 className="text-xl font-medium text-purple-200 mb-4">Adicionar Nova Habilidade</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="newAbilityName" className="block text-gray-400 text-sm font-bold mb-1">Nome:</label>
            <input
              type="text"
              id="newAbilityName"
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
              placeholder="Nome da Habilidade"
              value={newAbilityName}
              onChange={(e) => setNewAbilityName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="newAbilityCost" className="block text-gray-400 text-sm font-bold mb-1">Custo:</label>
            <input
              type="text"
              id="newAbilityCost"
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
              placeholder="Custo (ex: 5 Mana)"
              value={newAbilityCost}
              onChange={(e) => setNewAbilityCost(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="newAbilityDescription" className="block text-gray-400 text-sm font-bold mb-1">Descrição:</label>
          <textarea
            id="newAbilityDescription"
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 resize-y"
            rows="3"
            placeholder="Detalhes da habilidade..."
            value={newAbilityDescription}
            onChange={(e) => setNewAbilityDescription(e.target.value)}
          ></textarea>
        </div>
        <button
          onClick={addAbility}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200"
        >
          Adicionar Habilidade
        </button>
      </div>

      {/* Lista de Habilidades */}
      <div className="p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <h4 className="text-xl font-medium text-purple-200 mb-4">Minhas Habilidades</h4>
        {abilities.length === 0 ? (
          <p className="text-gray-500 italic">Nenhuma habilidade adicionada ainda.</p>
        ) : (
          <ul className="space-y-4">
            {abilities.map((ability, index) => (
              <li key={index} className="bg-gray-900 p-3 rounded-md border border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="text-lg font-semibold text-white">{ability.name}</p>
                  {ability.cost && <p className="text-sm text-gray-400">Custo: {ability.cost}</p>}
                  {ability.description && <p className="text-sm text-gray-300 italic">{ability.description}</p>}
                </div>
                <button
                  onClick={() => removeAbility(index)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors duration-200"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AbilitiesAndSpells;