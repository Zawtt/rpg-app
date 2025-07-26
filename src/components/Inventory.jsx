import React, { useState } from 'react';
import { Package, Plus, Trash2, Search, Hash } from 'lucide-react';

function Inventory({ inventoryItems, setInventoryItems }) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const addItem = () => {
    if (newItemName.trim() !== '') {
      setInventoryItems(prevItems => [
        ...prevItems,
        { 
          id: Date.now(),
          name: newItemName.trim(), 
          quantity: parseInt(newItemQuantity) || 1 
        }
      ]);
      setNewItemName('');
      setNewItemQuantity(1);
    }
  };

  const removeItem = (idToRemove) => {
    setInventoryItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };

  const updateQuantity = (id, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setInventoryItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={24} className="text-emerald-400" />
            <div>
              <h3 className="text-2xl font-medium text-gray-100">INVENTORY</h3>
              <div className="w-20 h-0.5 bg-emerald-500 mt-1"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Items</div>
            <div className="text-xl font-bold text-emerald-400">{totalItems}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Add New Item */}
        <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Plus size={20} className="text-emerald-400" />
            <h4 className="text-lg font-medium text-gray-100">ADD ITEM</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-sm"
                placeholder="Long Sword, Health Potion..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                min="1"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-sm"
              />
            </div>
          </div>
          
          <button
            onClick={addItem}
            className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            ADD TO INVENTORY
          </button>
        </div>

        {/* Search */}
        {inventoryItems.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Search Items
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-sm"
                placeholder="Search your items..."
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-100">
              YOUR ITEMS
            </h4>
            <div className="text-sm text-gray-400">
              {filteredItems.length} of {inventoryItems.length} items
            </div>
          </div>
          
          {inventoryItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <Package size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Empty inventory</p>
              <p className="text-gray-600 text-sm">Add your first item above</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
              <Search size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500">No items match your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id || `${item.name}-${Math.random()}`}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="text-lg font-medium text-gray-100 mb-1">
                        {item.name}
                      </h5>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Hash size={12} />
                        <span>Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="text-lg font-bold text-emerald-400 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inventory;