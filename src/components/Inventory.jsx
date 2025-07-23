import React, { useState } from 'react';

function Inventory({ inventoryItems, setInventoryItems }) { // Recebe inventoryItems e setInventoryItems via props
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  const addItem = () => {
    if (newItemName.trim() !== '') {
      setInventoryItems(prevItems => [
        ...prevItems,
        { name: newItemName.trim(), quantity: parseInt(newItemQuantity) }
      ]);
      setNewItemName('');
      setNewItemQuantity(1);
    }
  };

  const removeItem = (indexToRemove) => {
    setInventoryItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="p-6 bg-gray-700/50 rounded-lg shadow-xl border border-gray-600 backdrop-blur-sm">
      <h3 className="text-3xl font-semibold text-green-300 mb-6">INVENTÁRIO</h3>

      {/* Adicionar Novo Item */}
      <div className="mb-6 p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <h4 className="text-xl font-medium text-green-200 mb-4">Adicionar Novo Item</h4>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="newItemName" className="block text-gray-400 text-sm font-bold mb-1">Nome do Item:</label>
            <input
              type="text"
              id="newItemName"
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
              placeholder="Espada Longa, Poção de Cura"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="newItemQuantity" className="block text-gray-400 text-sm font-bold mb-1">Quantidade:</label>
            <input
              type="number"
              id="newItemQuantity"
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              min="1"
            />
          </div>
        </div>
        <button
          onClick={addItem}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200"
        >
          Adicionar Item
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="p-4 bg-gray-800/60 rounded-md border border-gray-700">
        <h4 className="text-xl font-medium text-green-200 mb-4">Meus Itens</h4>
        {inventoryItems.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum item no inventário.</p>
        ) : (
          <ul className="space-y-4">
            {inventoryItems.map((item, index) => (
              <li key={index} className="bg-gray-900 p-3 rounded-md border border-gray-700 flex justify-between items-center">
                <p className="text-lg font-semibold text-white">{item.name} <span className="text-gray-400">({item.quantity})</span></p>
                <button
                  onClick={() => removeItem(index)}
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

export default Inventory;