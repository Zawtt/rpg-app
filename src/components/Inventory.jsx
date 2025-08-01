import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Package, Plus, Trash2, Search, Hash, Eye, X, Edit3, Settings } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAppContext } from '../contexts/AppContext';

function Inventory({ inventoryItems, setInventoryItems }) {
  const { theme } = useTheme();
  const { showNotification } = useAppContext();
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, description: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Otimização com useMemo
  const totalItems = useMemo(() => {
    return inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventoryItems, searchTerm]);

  // Effect para gerenciar modal e foco
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedItem !== null) {
      // Salvar foco anterior e focar no modal
      previousFocusRef.current = document.activeElement;
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // Focar no primeiro elemento focável do modal
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector('button, input, textarea, [tabindex]:not([tabindex="-1"])');
        firstFocusable?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedItem]);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    // Restaurar foco anterior
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  const validateItem = useCallback(() => {
    if (!newItem.name.trim()) {
      showNotification('Nome do item é obrigatório', 'error');
      return false;
    }
    
    const quantity = parseInt(newItem.quantity);
    if (isNaN(quantity) || quantity < 1) {
      showNotification('Quantidade deve ser um número maior que 0', 'error');
      return false;
    }
    return true;
  }, [newItem, showNotification]);

  const addItem = useCallback(() => {
    if (!validateItem()) return;
    
    const quantity = parseInt(newItem.quantity) || 1;
    
    if (editingIndex !== null) {
      // Editando item existente
      setInventoryItems(prevItems => 
        prevItems.map((item, index) => 
          index === editingIndex 
            ? { 
                ...item,
                name: newItem.name.trim(),
                quantity,
                description: newItem.description.trim()
              }
            : item
        )
      );
      setEditingIndex(null);
      showNotification('Item atualizado com sucesso!', 'success');
    } else {
      // Novo item
      setInventoryItems(prevItems => [
        ...prevItems,
        { 
          id: Date.now(),
          name: newItem.name.trim(), 
          quantity,
          description: newItem.description.trim()
        }
      ]);
      showNotification('Item adicionado com sucesso!', 'success');
    }
    setNewItem({ name: '', quantity: 1, description: '' });
  }, [newItem, editingIndex, validateItem, setInventoryItems, showNotification]);

  const handleEdit = useCallback((index) => {
    setEditingIndex(index);
    const itemToEdit = inventoryItems[index];
    setNewItem({
      name: itemToEdit.name,
      quantity: itemToEdit.quantity,
      description: itemToEdit.description || ''
    });
    // Fechar modal se estiver aberto
    setSelectedItem(null);
  }, [inventoryItems]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setNewItem({ name: '', quantity: 1, description: '' });
    setEditMode(false);
  }, []);

  const removeItem = useCallback((idToRemove) => {
    setInventoryItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
    
    // Fechar modal se o item removido estava selecionado
    if (selectedItem !== null) {
      const selectedItemData = inventoryItems[selectedItem];
      if (selectedItemData?.id === idToRemove) {
        closeModal();
      }
    }
    
    showNotification('Item removido com sucesso!', 'success');
  }, [selectedItem, inventoryItems, setInventoryItems, showNotification, closeModal]);

  const updateQuantity = useCallback((id, newQuantity) => {
    const quantity = parseInt(newQuantity);
    
    if (isNaN(quantity) || quantity <= 0) {
      removeItem(id);
    } else {
      setInventoryItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  }, [removeItem, setInventoryItems]);

  const openItemModal = useCallback((index, event) => {
    event?.stopPropagation();
    setSelectedItem(index);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  }, [addItem]);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
    if (editingIndex !== null) {
      cancelEdit();
    }
  }, [editingIndex, cancelEdit]);

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={24} className="text-amber-400" />
            <div>
              <h3 className="text-2xl font-storm-gust text-amber-100">INVENTORY</h3>
              <div className="w-20 h-0.5 bg-amber-500 mt-1"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Botão Modo de Edição */}
            <button
              onClick={toggleEditMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medieval text-sm transition-all duration-200 ${
                editMode
                  ? 'bg-amber-600/20 text-amber-400 border border-amber-500/50'
                  : 'bg-gray-700/50 text-gray-400 border border-gray-600/50 hover:bg-gray-600/50 hover:text-gray-300'
              }`}
              aria-pressed={editMode}
            >
              <Settings size={16} />
              {editMode ? 'Sair do Modo Edição' : 'Modo Edição'}
            </button>
            <div className="text-right">
              <div className="text-sm font-medieval text-amber-400">Total Items</div>
              <div className="text-xl font-medieval font-bold text-amber-400">{totalItems}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Add New Item */}
        <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-4">
            {editingIndex !== null ? (
              <Edit3 size={20} className="text-amber-500" />
            ) : (
              <Plus size={20} className="text-amber-400" />
            )}
            <h4 className="text-lg font-storm-gust text-amber-100">
              {editingIndex !== null ? 'EDITAR ITEM' : 'ADICIONAR ITEM'}
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
                Nome do Item
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 font-medieval bg-gray-800/80 border border-amber-600/50 rounded text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm placeholder-amber-400/60"
                placeholder="Long Sword, Health Potion..."
                aria-label="Nome do item"
              />
            </div>
            <div>
              <label className="block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
                Quantidade
              </label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                min="1"
                className="w-full px-4 py-3 font-medieval bg-gray-800/80 border border-amber-600/50 rounded text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm"
                aria-label="Quantidade do item"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 font-medieval bg-gray-800/80 border border-amber-600/50 rounded text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm resize-none placeholder-amber-400/60"
                style={{whiteSpace: 'pre-line', wordBreak: 'break-word'}}
                placeholder="Descrição detalhada do item, efeitos, etc..."
                aria-label="Descrição do item"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-5">
            <button
              onClick={addItem}
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medieval font-medium rounded transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              {editingIndex !== null ? 'ATUALIZAR ITEM' : 'ADICIONAR AO INVENTÁRIO'}
            </button>
            {editingIndex !== null && (
              <button
                onClick={cancelEdit}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-amber-400 font-medieval rounded transition-colors"
                aria-label="Cancelar edição"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        {inventoryItems.length > 0 && (
          <div>
            <label className="block text-xs font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
              Buscar Itens
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 font-medieval bg-gray-800/80 border border-amber-600/50 rounded text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm placeholder-amber-400/60"
                placeholder="Buscar seus itens..."
                aria-label="Buscar itens no inventário"
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medieval-title text-amber-100">
              SEUS ITENS
            </h4>
            <div className="text-sm font-medieval text-amber-400">
              {filteredItems.length} de {inventoryItems.length} itens
            </div>
          </div>
          
          {inventoryItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <Package size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Inventário vazio</p>
              <p className="text-gray-600 text-sm">Adicione seu primeiro item acima</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
              <Search size={32} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500">Nenhum item corresponde à sua busca</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const originalIndex = inventoryItems.findIndex(origItem => origItem.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="text-lg font-medieval font-medium text-amber-100 mb-1">
                          {item.name}
                        </h5>
                        <div className="flex items-center gap-2 text-sm font-medieval text-amber-400">
                          <Hash size={12} />
                          <span>Quantidade: {item.quantity}</span>
                        </div>
                        {item.description && (
                          <div className="mt-2 text-sm font-medieval text-amber-300/80 italic" style={{wordBreak: 'break-word'}}>
                            {item.description.length > 50 
                              ? `${item.description.substring(0, 50)}...` 
                              : item.description
                            }
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded flex items-center justify-center transition-colors"
                            aria-label={`Diminuir quantidade de ${item.name}`}
                          >
                            -
                          </button>
                          <span className="text-lg font-medieval font-bold text-amber-400 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded flex items-center justify-center transition-colors"
                            aria-label={`Aumentar quantidade de ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Botão Ver Detalhes */}
                        <button
                          onClick={(e) => openItemModal(originalIndex, e)}
                          className="p-2 text-gray-500 hover:text-blue-400 transition-colors rounded"
                          title="Ver detalhes"
                          aria-label={`Ver detalhes de ${item.name}`}
                        >
                          <Eye size={16} />
                        </button>
                        
                        {/* Botões de Edição - Apenas no Modo Edição */}
                        {editMode && (
                          <>
                            <button
                              onClick={() => handleEdit(originalIndex)}
                              className="p-2 text-gray-500 hover:text-amber-400 transition-colors rounded"
                              title="Editar item"
                              aria-label={`Editar ${item.name}`}
                            >
                              <Edit3 size={16} />
                            </button>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                              title="Remover item"
                              aria-label={`Remover ${item.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Item */}
      {selectedItem !== null && inventoryItems[selectedItem] && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300"
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-600/20 rounded-lg border border-amber-500/30">
                    <Package size={28} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 id="modal-title" className="text-2xl font-storm-gust font-bold text-amber-100">
                      {inventoryItems[selectedItem].name}
                    </h2>
                    <p className="text-amber-400 font-medieval text-sm">Detalhes do Item</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                  aria-label="Fechar modal"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
                      Quantidade
                    </h3>
                    <div className="text-2xl font-medieval font-bold text-amber-400">
                      {inventoryItems[selectedItem].quantity}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-medieval font-medium text-amber-400 uppercase tracking-wider mb-2">
                      ID do Item
                    </h3>
                    <div className="text-lg font-medieval text-amber-300">
                      #{inventoryItems[selectedItem].id}
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-lg p-6 border border-gray-700 border-l-4 border-l-amber-500">
                  <h3 className="text-lg font-storm-gust text-amber-100 mb-4 uppercase tracking-wider">
                    Descrição
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p id="modal-description" className="text-amber-200/90 font-medieval leading-relaxed text-base" style={{whiteSpace: 'pre-line', wordBreak: 'break-word'}}>
                      {inventoryItems[selectedItem].description || 'Nenhuma descrição disponível para este item.'}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      const item = inventoryItems[selectedItem];
                      closeModal();
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Adicionar Quantidade
                  </button>
                  
                  <button
                    onClick={() => handleEdit(selectedItem)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Edit3 size={16} />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.3s ease-out, zoom-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Inventory;