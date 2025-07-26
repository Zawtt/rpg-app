import React, { useState, useEffect } from 'react';
import { Save, Download, Gamepad2, Shield } from 'lucide-react';
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
    
    // Feedback visual melhorado
    const button = document.getElementById('save-button');
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => button.classList.remove('animate-pulse'), 1000);
    }
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
      
      // Feedback visual
      const button = document.getElementById('load-button');
      if (button) {
        button.classList.add('animate-pulse');
        setTimeout(() => button.classList.remove('animate-pulse'), 1000);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FICHA RPG
                </h1>
                <p className="text-sm text-gray-400">System created solely for the CICLO DE DOZE LUAS</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                id="save-button"
                onClick={saveAllData}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                <Save size={16} />
                Save All
              </button>
              <button
                id="load-button"
                onClick={loadAllData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                <Download size={16} />
                Load All
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-10 max-w-7xl mx-auto px-6 py-8 ${isShaking ? 'animate-shake' : ''}`}>
        <div className="grid grid-cols-12 gap-6">
          
          {/* Fixed Attributes Sidebar */}
          <aside className="col-span-12 lg:col-span-2">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-800 shadow-xl sticky top-6">
              <div className="p-4 border-b border-gray-800">
                <h3 className="font-semibold text-gray-100 flex items-center gap-2">
                  <Gamepad2 size={16} className="text-blue-400" />
                  Fixed Stats
                </h3>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {fixedAttributes.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No fixed attributes</p>
                ) : (
                  fixedAttributes.map((attr, index) => (
                    <div key={index} className="p-2 bg-gray-800 rounded border border-gray-700">
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {attr.name}
                      </div>
                      <div className="text-lg font-bold text-blue-400">
                        {attr.value}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Character Sheet */}
          <section className="col-span-12 lg:col-span-6">
            <CharacterSheet
              characterData={characterData}
              setCharacterData={setCharacterData}
              onFixAttributes={handleFixAttributesFromSheet}
            />
          </section>

          {/* Tools Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Dice Roller with Turn Counter */}
            <div className="relative">
              <DiceRoller onRollStart={handleRollStart} onRollEnd={handleRollEnd} />
              <div className="absolute top-4 right-4 z-20">
                <TurnCounter />
              </div>
            </div>

            {/* Abilities */}
            <AbilitiesAndSpells abilities={abilities} setAbilities={setAbilities} />

            {/* Inventory */}
            <Inventory inventoryItems={inventoryItems} setInventoryItems={setInventoryItems} />
            
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-gray-500 text-sm">
            <p>Ficha RPG © 2025 - Zawt♥</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;