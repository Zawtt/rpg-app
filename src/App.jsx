import React, { useState, useEffect } from 'react';
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import TurnCounter from './components/TurnCounter';
import AbilitiesAndSpells from './components/AbilitiesAndSpells';
import Inventory from './components/Inventory';

function App() {
  // Estado centralizado para a ficha do personagem - CORRIGIDO AQUI
  const [characterData, setCharacterData] = useState({
    name: '', race: '', height: '', age: '', homeland: '', religion: '', fear: '',
    hp: '', mana: '', aura: '', er: '', en: '', ep: '', ea: '',
    vigor: '', strength: '', dexterity: '', agility: '', rarity: '', animalHandling: '',
    stealth: '', adaptability: '', perception: '', intuition: '', athletics: '', initiative: '',
    successBoxes: Array(4).fill(false), failureBoxes: Array(4).fill(false),
    characterImage: ''
  });

  // Estado centralizado para habilidades
  const [abilities, setAbilities] = useState([]);

  // Estado centralizado para itens do inventário
  const [inventoryItems, setInventoryItems] = useState([]);

  // Novo estado para controlar a animação de "tremer" global
  const [isShaking, setIsShaking] = useState(false);

  // Chave única para o localStorage
  const localStorageKey = 'rpgCompanionData';

  // Função para salvar TODOS os dados
  const saveAllData = () => {
    const allData = {
      characterData,
      abilities,
      inventoryItems
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
        vigor: '', strength: '', dexterity: '', agility: '', rarity: '', animalHandling: '',
        stealth: '', adaptability: '', perception: '', intuition: '', athletics: '', initiative: '',
        successBoxes: Array(4).fill(false), failureBoxes: Array(4).fill(false),
        characterImage: ''
      });
      setAbilities(parsedData.abilities || []);
      setInventoryItems(parsedData.inventoryItems || []);
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
    // O tremor dura 0.5s, então desliga ele depois de um tempo
    setTimeout(() => setIsShaking(false), 500); // 500ms = 0.5s
  };

  const handleRollEnd = () => {
    // Isso é chamado quando a animação do número gigante termina
    // Se quiser que o tremor dure mais ou tenha outro efeito no final, pode ajustar aqui
    // setIsShaking(false); // Já é desligado pelo timeout no handleRollStart
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 flex flex-col items-center justify-center">
      {/* Cabeçalho do Aplicativo */}
      <header className="text-center mb-8">
        <h1 className="text-6xl font-extrabold text-blue-400 drop-shadow-lg animate-pulse-slow">
          RPG Companion
        </h1>
        <p className="text-xl mt-2 text-purple-300">
          Sua jornada começa aqui.
        </p>
      </header>

      {/* Conteúdo Principal: Ficha de Personagem (Esquerda) e Ferramentas (Direita) */}
      <div className={`flex flex-col lg:flex-row w-full max-w-7xl gap-4 ${isShaking ? 'animate-shake' : ''}`}>

        {/* Coluna da Ficha de Personagem (Esquerda - Maior) */}
        <main className="w-full lg:w-3/5 flex-shrink-0">
          <CharacterSheet characterData={characterData} setCharacterData={setCharacterData} />
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

        {/* Coluna das Ferramentas (Direita - Menor) */}
        <aside className="w-full lg:w-2/5 flex flex-col gap-4">
          {/* Container para DiceRoller e TurnCounter para posicionamento relativo */}
          <section className="relative">
            <DiceRoller onRollStart={handleRollStart} onRollEnd={handleRollEnd} />
            {/* TurnCounter será posicionado ABSOLUTAMENTE dentro desta section */}
            <div className="absolute top-2 right-4 z-10">
              <TurnCounter />
            </div>
          </section>

          {/* Área de Habilidades e Magias */}
          <section>
            <AbilitiesAndSpells abilities={abilities} setAbilities={setAbilities} />
          </section>

          {/* Área do Inventário */}
          <section>
            <Inventory inventoryItems={inventoryItems} setInventoryItems={setInventoryItems} />
          </section>
        </aside>
      </div>

      {/* Rodapé Opcional */}
      <footer className="mt-8 text-gray-500 text-sm">
        Criado para sua aventura.
      </footer>
    </div>
  );
}

export default App;