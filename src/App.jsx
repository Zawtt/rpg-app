import React, { useState, useEffect } from 'react';
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import TurnCounter from './components/TurnCounter';
import AbilitiesAndSpells from './components/AbilitiesAndSpells';
import Inventory from './components/Inventory';

function App() {
  // Estado centralizado para a ficha do personagem
  const [characterData, setCharacterData] = useState({
    name: '', race: '', height: '', age: '', homeland: '', religion: '', fear: '',
    hp: '', mana: '', aura: '', er: '', en: '', ep: '', ea: '',
    vigor: '', strength: '', dexterity: '0', agility: '0', rarity: '0', animalHandling: '0',
    stealth: '0', adaptability: '0', perception: '0', intuition: '0', athletics: '0', initiative: '0',
    successBoxes: Array(4).fill(false), failureBoxes: Array(4).fill(false),
    characterImage: ''
  });

  // Estado centralizado para habilidades
  const [abilities, setAbilities] = useState([]);

  // Estado centralizado para itens do inventário
  const [inventoryItems, setInventoryItems] = useState([]);

  // Novo estado para controlar a animação de "tremer" global
  const [isShaking, setIsShaking] = useState(false);

  // Estado para armazenar os atributos fixados
  const [fixedAttributes, setFixedAttributes] = useState([]);

  // Chave única para o localStorage
  const localStorageKey = 'rpgCompanionData';

  // Função para salvar TODOS os dados
  const saveAllData = () => {
    const allData = {
      characterData,
      abilities,
      inventoryItems,
      fixedAttributes
    };
    localStorage.setItem(localStorageKey, JSON.stringify(allData));
    alert('Todos os dados salvos com sucesso!');
  };

  // Função para carregar TODOS os dados
  const loadAllData = () => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setCharacterData(parsedData.characterData || {
        name: '', race: '', height: '', age: '', homeland: '', religion: '', fear: '',
        hp: '', mana: '', aura: '', er: '', en: '', ep: '', ea: '',
        vigor: '', strength: '', dexterity: '0', agility: '0', rarity: '0', animalHandling: '0',
        stealth: '0', adaptability: '0', perception: '0', intuition: '0', athletics: '0', initiative: '0',
        successBoxes: Array(4).fill(false), failureBoxes: Array(4).fill(false),
        characterImage: ''
      });
      setAbilities(parsedData.abilities || []);
      setInventoryItems(parsedData.inventoryItems || []);
      setFixedAttributes(parsedData.fixedAttributes || []);
      alert('Todos os dados carregados com sucesso!');
    } else {
      alert('Nenhum dado salvo encontrado!');
    }
  };

  // Carregar dados automaticamente ao iniciar o aplicativo
  useEffect(() => {
    loadAllData();
  }, []);

  // Funções para controlar o tremor
  const handleRollStart = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleRollEnd = () => {
    // Já é desligado pelo timeout no handleRollStart
  };

  // Recebe os atributos do CharacterSheet e os adiciona/atualiza no estado
  const handleFixAttributesFromSheet = (newAttributes) => {
    setFixedAttributes(prevFixedAttributes => {
      const updatedFixedAttributes = [...prevFixedAttributes];

      newAttributes.forEach(newAttr => {
        const existingIndex = updatedFixedAttributes.findIndex(attr => attr.name === newAttr.name);

        if (existingIndex !== -1) {
          updatedFixedAttributes[existingIndex] = newAttr;
        } else {
          updatedFixedAttributes.push(newAttr);
        }
      });
      return updatedFixedAttributes;
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 flex flex-col items-center justify-center font-inter">
      {/* Cabeçalho do Aplicativo */}
      <header className="text-center mb-8">
        <h1 className="text-6xl font-extrabold text-blue-400 drop-shadow-lg animate-pulse-slow">
          FICHA DE PERSONAGEM
        </h1>
      </header>

      {/* Conteúdo Principal: Usando flexbox para controle de espaçamento */}
      {/* Removido o 'gap-8' do container principal, o espaçamento será controlado por margin-right */}
      <div className={`flex flex-col lg:flex-row w-full max-w-7xl ${isShaking ? 'animate-shake' : ''}`}>

        {/* COLUNA: Atributos Fixados (Esquerda) - Largura ajustada e margem para separação */}
        {/* lg:w-40 define uma largura de 160px. lg:mr-6 adiciona uma margem direita de 24px. */}
        <div className="w-full lg:w-40 p-4 bg-gray-800/60 rounded-lg border border-gray-700 flex flex-col gap-2 mb-4 lg:mb-0 lg:mr-6">
          <h3 className="text-xl font-semibold text-blue-300 mb-2">ATRIBUTOS FIXOS</h3>
          {fixedAttributes.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Nenhum atributo fixado ainda.</p>
          ) : (
            fixedAttributes.map((attr, index) => (
              <div key={index} className="p-2 bg-gray-900 border border-gray-700 rounded-md text-sm">
                <span className="font-bold text-gray-300">{attr.name}:</span> <span className="text-white">{attr.value}</span>
              </div>
            ))
          )}
        </div>

        {/* CONTÊINER: Ficha de Personagem e Ferramentas (Direita) - Ocupa o restante do espaço */}
        {/* flex-grow para ocupar o espaço restante. gap-4 para separar ficha e ferramentas. */}
        <div className="flex flex-col lg:flex-row gap-4 lg:flex-grow">

          {/* Coluna da Ficha de Personagem (Centro - Maior) */}
          <main className="w-full lg:w-3/5 flex-shrink-0">
            <CharacterSheet
              characterData={characterData}
              setCharacterData={setCharacterData}
              onFixAttributes={handleFixAttributesFromSheet}
            />
            {/* Botões de Salvar/Carregar movidos para aqui, abaixo da ficha */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button
                onClick={saveAllData}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-75"
              >
                SALVAR TUDO
              </button>
              <button
                onClick={loadAllData}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-75"
              >
                CARREGAR TUDO
              </button>
            </div>
          </main>

          {/* Coluna das Ferramentas (Direita - Expandida) */}
          <aside className="w-full lg:w-2/5 flex flex-col gap-4">
            <section className="relative">
              <DiceRoller onRollStart={handleRollStart} onRollEnd={handleRollEnd} />
              <div className="absolute top-2 right-4 z-10">
                <TurnCounter />
              </div>
            </section>

            <section>
              <AbilitiesAndSpells abilities={abilities} setAbilities={setAbilities} />
            </section>

            <section>
              <Inventory inventoryItems={inventoryItems} setInventoryItems={setInventoryItems} />
            </section>
          </aside>
        </div>
      </div>

      {/* Rodapé Opcional */}
      <footer className="mt-8 text-gray-500 text-sm">
        Criado para sua aventura.
      </footer>
    </div>
  );
}

export default App;
