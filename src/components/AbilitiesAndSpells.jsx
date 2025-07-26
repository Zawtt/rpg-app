import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Edit3, Clock, Zap, Shield, Sword, Sparkles, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

function AbilitiesAndSpells({ abilities, setAbilities }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null); // Nova state para controlar qual habilidade está expandida
  const expandedRef = useRef(null); // Ref para detectar cliques fora da habilidade expandida
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    description: '',
    cooldown: ''
  });

  // Effect para detectar cliques fora da habilidade expandida
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expandedRef.current && !expandedRef.current.contains(event.target)) {
        setExpandedIndex(null);
      }
    };

    if (expandedIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedIndex]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    if (formData.name.trim() && formData.cost.trim() && formData.description.trim() && formData.cooldown.trim()) {
      if (editingIndex !== null) {
        // Editando habilidade existente
        setAbilities(abilities.map((skill, index) => 
          index === editingIndex 
            ? { 
                ...skill, 
                name: formData.name.trim(),
                cost: formData.cost.trim(), 
                description: formData.description.trim(),
                cooldown: parseInt(formData.cooldown),
                maxCooldown: parseInt(formData.cooldown)
              }
            : skill
        ));
        setEditingIndex(null);
      } else {
        // Nova habilidade
        const newSkill = {
          id: Date.now(),
          name: formData.name.trim(),
          cost: formData.cost.trim(),
          description: formData.description.trim(),
          cooldown: parseInt(formData.cooldown),
          maxCooldown: parseInt(formData.cooldown),
          currentCooldown: 0,
          isOnCooldown: false
        };
        setAbilities([...abilities, newSkill]);
      }
      setFormData({ name: '', cost: '', description: '', cooldown: '' });
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const skillToEdit = abilities[index];
    setFormData({
      name: skillToEdit.name,
      cost: skillToEdit.cost,
      description: skillToEdit.description,
      cooldown: (skillToEdit.maxCooldown || skillToEdit.cooldown || '').toString()
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setFormData({ name: '', cost: '', description: '', cooldown: '' });
  };

  const handleDelete = (indexToRemove) => {
    setAbilities(abilities.filter((_, index) => index !== indexToRemove));
    if (editingIndex === indexToRemove) {
      cancelEdit();
    } else if (editingIndex > indexToRemove) {
      setEditingIndex(prevIndex => prevIndex - 1);
    }
    // Fechar expansão se a habilidade deletada estiver expandida
    if (expandedIndex === indexToRemove) {
      setExpandedIndex(null);
    } else if (expandedIndex > indexToRemove) {
      setExpandedIndex(prevIndex => prevIndex - 1);
    }
  };

  const useSkill = (index) => {
    const skill = abilities[index];
    if (!skill.isOnCooldown) {
      setAbilities(abilities.map((s, i) => 
        i === index
          ? { ...s, isOnCooldown: true, currentCooldown: s.maxCooldown || s.cooldown || 0 }
          : s
      ));
    }
  };

  const decreaseCooldown = (index) => {
    setAbilities(abilities.map((skill, i) => {
      if (i === index && skill.isOnCooldown) {
        const newCooldown = (skill.currentCooldown || 0) - 1;
        return {
          ...skill,
          currentCooldown: newCooldown,
          isOnCooldown: newCooldown > 0
        };
      }
      return skill;
    }));
  };

  // Função para expandir/colapsar habilidade
  const toggleExpand = (index, event) => {
    event.stopPropagation(); // Impede que o clique também use a habilidade
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Função para fechar expansão
  const closeExpanded = (event) => {
    event.stopPropagation();
    setExpandedIndex(null);
  };

  const getRandomIcon = () => {
    const icons = [Zap, Shield, Sword, Sparkles];
    const Icon = icons[Math.floor(Math.random() * icons.length)];
    return <Icon size={20} />;
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-2xl font-medium text-gray-100 flex items-center gap-3">
          <Sparkles size={24} className="text-purple-400" />
          HABILIDADES
        </h3>
        <div className="w-20 h-0.5 bg-purple-500 mt-2"></div>
      </div>

      <div className="p-6 space-y-6">
        {/* Form Section */}
        <div className="bg-gray-800/80 rounded-lg border border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-4">
            {editingIndex !== null ? (
              <Edit3 size={20} className="text-amber-500" />
            ) : (
              <Plus size={20} className="text-gray-400" />
            )}
            <h4 className="text-lg font-medium text-gray-100">
              {editingIndex !== null ? 'EDITAR HABILIDADE' : 'NOVA HABILIDADE'}
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
                placeholder="ex: chidori aaaa"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Custo
              </label>
              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
                placeholder="ex: 15 mana"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Turnos
              </label>
              <input
                type="number"
                name="cooldown"
                value={formData.cooldown}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
                placeholder="3"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm resize-none"
                placeholder="Ex: Faz coco a quantos metros..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-gray-100 font-medium rounded transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Save size={16} />
              {editingIndex !== null ? 'ATUALIZAR' : 'CRIAR'}
            </button>
            {editingIndex !== null && (
              <button
                onClick={cancelEdit}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Abilities Grid */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-100">
              REGISTRO DE HABILIDADES
            </h4>
            <div className="text-sm text-gray-400">
              {abilities.length} habilidade{abilities.length !== 1 ? 's' : ''} registrada{abilities.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {abilities.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
              <Sparkles size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma habilidade criada</p>
              <p className="text-gray-600 text-sm">Crie sua primeira habilidade de combate</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {abilities.map((skill, index) => (
                <div
                  key={skill.id || index}
                  ref={expandedIndex === index ? expandedRef : null}
                  className={`relative bg-gray-800 border rounded-lg transition-all duration-300 ${
                    skill.isOnCooldown 
                      ? 'border-gray-700 bg-gray-850 opacity-60' 
                      : 'border-gray-700 hover:border-purple-500 hover:bg-gray-750'
                  } ${expandedIndex === index ? 'col-span-full z-10' : 'cursor-pointer'}`}
                  onClick={() => {
                    if (expandedIndex !== index) {
                      skill.isOnCooldown ? decreaseCooldown(index) : useSkill(index);
                    }
                  }}
                >
                  {/* Cooldown Overlay */}
                  {skill.isOnCooldown && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/90 rounded-lg backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-red-400 mb-2">
                          {skill.currentCooldown || 0}
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">
                          RECARGA
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Clique para reduzir
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-purple-400">
                          {getRandomIcon()}
                        </div>
                        <h3 className="text-lg font-medium text-gray-100">
                          {skill.name}
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        {/* Botão de Expandir/Colapsar */}
                        <button
                          onClick={(e) => toggleExpand(index, e)}
                          className="text-gray-500 hover:text-purple-400 transition-colors p-1 rounded"
                          title={expandedIndex === index ? "Colapsar" : "Expandir"}
                        >
                          {expandedIndex === index ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index);
                          }}
                          className="text-gray-500 hover:text-amber-400 transition-colors p-1 rounded"
                          title="Editar habilidade"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded"
                          title="Deletar habilidade"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mb-3">
                      <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                        {skill.cost}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                        <Clock size={12} />
                        {skill.maxCooldown || skill.cooldown || 0}T
                      </span>
                    </div>
                    
                    {/* Descrição - Só mostra quando expandida */}
                    {expandedIndex === index && (
                      <div className="space-y-4">
                        <div className="border-t border-gray-700 pt-4">
                          <h5 className="text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                            Descrição
                          </h5>
                          <p className="text-gray-400 text-sm leading-relaxed bg-gray-900/50 p-3 rounded border-l-4 border-purple-500/50">
                            {skill.description}
                          </p>
                        </div>
                        
                        {/* Botão para fechar */}
                        <div className="flex justify-end pt-2 border-t border-gray-700">
                          <button
                            onClick={closeExpanded}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            <X size={14} />
                            Fechar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Instruções de uso - Só mostra quando não expandida */}
                    {!skill.isOnCooldown && expandedIndex !== index && (
                      <div className="mt-3 text-xs text-gray-500 italic">
                        Clique para usar • 
                        <button 
                          onClick={(e) => toggleExpand(index, e)}
                          className="ml-1 text-purple-400 hover:text-purple-300 underline"
                        >
                          Detalhes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-gray-750 {
          background-color: rgb(55 65 81 / 0.5);
        }
        .bg-gray-850 {
          background-color: rgb(31 41 55 / 0.8);
        }
      `}</style>
    </div>
  );
}

export default AbilitiesAndSpells;