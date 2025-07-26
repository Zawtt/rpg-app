import React, { useState } from 'react';

function AbilitiesAndSpells({ abilities, setAbilities }) { // Recebe abilities e setAbilities via props
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityCost, setNewAbilityCost] = useState('');
  const [newAbilityDescription, setNewAbilityDescription] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); // NOVO ESTADO: Índice da habilidade sendo editada

  // Função para adicionar ou atualizar uma habilidade
  const handleSaveAbility = () => {
    if (newAbilityName.trim() === '') {
      // Não permite adicionar/salvar habilidade sem nome
      return;
    }

    const updatedAbility = {
      name: newAbilityName.trim(),
      cost: newAbilityCost.trim(),
      description: newAbilityDescription.trim()
    };

    if (editingIndex !== null) {
      // Modo de Edição: Atualiza a habilidade existente
      setAbilities(prevAbilities => {
        const newAbilities = [...prevAbilities];
        newAbilities[editingIndex] = updatedAbility;
        return newAbilities;
      });
      setEditingIndex(null); // Sai do modo de edição
    } else {
      // Modo de Adição: Adiciona uma nova habilidade
      setAbilities(prevAbilities => [
        ...prevAbilities,
        updatedAbility
      ]);
    }

    // Limpa os campos após adicionar/salvar
    setNewAbilityName('');
    setNewAbilityCost('');
    setNewAbilityDescription('');
  };

  // Função para iniciar a edição de uma habilidade
  const handleEditAbility = (index) => {
    setEditingIndex(index);
    const abilityToEdit = abilities[index];
    setNewAbilityName(abilityToEdit.name);
    setNewAbilityCost(abilityToEdit.cost);
    setNewAbilityDescription(abilityToEdit.description);
  };

  // Função para cancelar a edição
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewAbilityName('');
    setNewAbilityCost('');
    setNewAbilityDescription('');
  };

  // Função para remover uma habilidade
  const removeAbility = (indexToRemove) => {
    setAbilities(prevAbilities => prevAbilities.filter((_, index) => index !== indexToRemove));
    // Se a habilidade removida era a que estava sendo editada, cancela a edição
    if (editingIndex === indexToRemove) {
      handleCancelEdit();
    } else if (editingIndex > indexToRemove) {
      // Se a habilidade editada estava abaixo da removida, ajusta o índice
      setEditingIndex(prevIndex => prevIndex - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-700/50 rounded-lg shadow-xl border border-gray-600 backdrop-blur-sm">
      <h3 className="text-3xl font-semibold text-purple-300 mb-6">HABILIDADES & MAGIAS</h3>

      {/* Adicionar/Editar Habilidade */}
      <div className="mb-6 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <h4 className="text-xl font-medium text-purple-200 mb-4">
          {editingIndex !== null ? 'Editar Habilidade' : 'Adicionar Nova Habilidade'}
        </h4>
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
        <div className="flex gap-2"> {/* Container para os botões de adicionar/atualizar e cancelar */}
          <button
            onClick={handleSaveAbility}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200"
          >
            {editingIndex !== null ? 'Atualizar Habilidade' : 'Adicionar Habilidade'}
          </button>
          {editingIndex !== null && ( // Mostra o botão Cancelar apenas em modo de edição
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200"
            >
              Cancelar Edição
            </button>
          )}
        </div>
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
                  {/* ATUALIZADO: Adicionada a classe break-words para quebrar o texto longo */}
                  {ability.description && <p className="text-sm text-gray-300 italic break-words">{ability.description}</p>}
                </div>
                {/* ATUALIZADO: Container para os botões de ação - agora flex-col para empilhar e gap-1 */}
                <div className="flex flex-col gap-1 mt-2 sm:mt-0"> {/* Alterado de flex gap-2 para flex flex-col gap-1 */}
                  <button
                    onClick={() => handleEditAbility(index)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-0.5 px-2 rounded-md transition-colors duration-200" // py-0.5 px-2 para menor padding
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeAbility(index)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-0.5 px-2 rounded-md transition-colors duration-200" // py-0.5 px-2 para menor padding
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AbilitiesAndSpells;
