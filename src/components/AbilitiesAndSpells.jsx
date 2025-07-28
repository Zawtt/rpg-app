import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3, Clock, Zap, Shield, Sword, Sparkles, Save, X, Eye, Book } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from './ThemeProvider';

function AbilitiesAndSpells() {
  // ✅ CORREÇÃO: Usar context diretamente
  const { abilities, setAbilities, showToast } = useAppContext();
  const theme = useTheme();
  
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    description: '',
    cooldown: ''
  });

  // Effect para detectar cliques fora do modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedSkill(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedSkill(null);
      }
    };

    if (selectedSkill !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedSkill]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, cost, description, cooldown } = formData;
    return name.trim() && cost.trim() && description.trim() && cooldown.trim() && !isNaN(parseInt(cooldown));
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const cooldownValue = parseInt(formData.cooldown);
    if (cooldownValue < 0) {
      alert('O cooldown deve ser um número positivo.');
      return;
    }

    if (editingIndex !== null) {
      // ✅ CORREÇÃO: Usar setAbilities do context
      const updatedAbilities = abilities.map((skill, index) =>
        index === editingIndex
          ? {
              ...skill,
              name: formData.name.trim(),
              cost: formData.cost.trim(),
              description: formData.description.trim(),
              cooldown: cooldownValue,
              maxCooldown: cooldownValue
            }
          : skill
      );
      setAbilities(updatedAbilities);
      setEditingIndex(null);
      showToast('Habilidade atualizada com sucesso!', 'success');
    } else {
      const newSkill = {
        id: Date.now() + Math.random(), // Garantir unicidade
        name: formData.name.trim(),
        cost: formData.cost.trim(),
        description: formData.description.trim(),
        cooldown: cooldownValue,
        maxCooldown: cooldownValue,
        currentCooldown: 0,
        isOnCooldown: false
      };
      setAbilities([...abilities, newSkill]);
      showToast('Nova habilidade criada!', 'success');
    }
    setFormData({ name: '', cost: '', description: '', cooldown: '' });
  };

  const handleEdit = (index) => {
    if (index < 0 || index >= abilities.length) return;
    
    setEditingIndex(index);
    const skillToEdit = abilities[index];
    setFormData({
      name: skillToEdit.name || '',
      cost: skillToEdit.cost || '',
      description: skillToEdit.description || '',
      cooldown: (skillToEdit.maxCooldown || skillToEdit.cooldown || '').toString()
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setFormData({ name: '', cost: '', description: '', cooldown: '' });
  };

  const handleDelete = (indexToRemove) => {
    if (indexToRemove < 0 || indexToRemove >= abilities.length) return;
    
    // ✅ CORREÇÃO: Usar setAbilities do context
    const updatedAbilities = abilities.filter((_, index) => index !== indexToRemove);
    setAbilities(updatedAbilities);
    showToast('Habilidade removida', 'success');
    
    // Ajustar índices após remoção
    if (editingIndex === indexToRemove) {
      cancelEdit();
    } else if (editingIndex !== null && editingIndex > indexToRemove) {
      setEditingIndex(prev => prev - 1);
    }
    
    if (selectedSkill === indexToRemove) {
      setSelectedSkill(null);
    } else if (selectedSkill !== null && selectedSkill > indexToRemove) {
      setSelectedSkill(prev => prev - 1);
    }
  };

  const useSkill = (index) => {
    if (index < 0 || index >= abilities.length) return;
    
    const skill = abilities[index];
    if (!skill.isOnCooldown) {
      // ✅ CORREÇÃO: Usar setAbilities do context
      const updatedAbilities = abilities.map((s, i) =>
        i === index
          ? { ...s, isOnCooldown: true, currentCooldown: s.maxCooldown || s.cooldown || 0 }
          : s
      );
      setAbilities(updatedAbilities);
      showToast(`${skill.name} ativada! Cooldown iniciado.`, 'info');
    }
  };

  const decreaseCooldown = (index) => {
    if (index < 0 || index >= abilities.length) return;
    
    // ✅ CORREÇÃO: Usar setAbilities do context
    const updatedAbilities = abilities.map((skill, i) => {
      if (i === index && skill.isOnCooldown) {
        const newCooldown = Math.max(0, (skill.currentCooldown || 0) - 1);
        const isStillOnCooldown = newCooldown > 0;
        
        if (!isStillOnCooldown) {
          showToast(`${skill.name} está disponível novamente!`, 'success');
        }
        
        return {
          ...skill,
          currentCooldown: newCooldown,
          isOnCooldown: isStillOnCooldown
        };
      }
      return skill;
    });
    setAbilities(updatedAbilities);
  };

  const openSkillModal = (index, event) => {
    event.stopPropagation();
    if (index >= 0 && index < abilities.length) {
      setSelectedSkill(index);
    }
  };

  const getRandomIcon = useCallback(() => {
    const icons = [Zap, Shield, Sword, Sparkles];
    const Icon = icons[Math.floor(Math.random() * icons.length)];
    return <Icon size={20} />;
  }, []);

  return (
    <>
      <div className="abilities-container bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-2xl">
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
          <div className="form-container bg-gray-800/80 rounded-lg border border-gray-700 p-5">
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
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
                  placeholder="ex: Chidori"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Custo *
                </label>
                <input
                  type="text"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
                  placeholder="ex: 15 mana"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Turnos *
                </label>
                <input
                  type="number"
                  name="cooldown"
                  value={formData.cooldown}
                  onChange={handleInputChange}
                  min="0"
                  max="99"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm"
                  placeholder="3"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength={500}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm resize-none"
                  placeholder="Descreva o efeito da habilidade..."
                />
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {formData.description.length}/500
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSave}
                disabled={!validateForm()}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-100 font-medium rounded transition-colors flex items-center justify-center gap-2 text-sm"
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
          <div className="abilities-grid">
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
                    key={skill.id || `skill-${index}`}
                    className={`group relative bg-gray-800 border rounded-lg transition-all duration-300 ${
                      skill.isOnCooldown 
                        ? 'border-gray-700 bg-gray-850 opacity-60' 
                        : 'border-gray-700 hover:border-purple-500 hover:bg-gray-750 cursor-pointer'
                    }`}
                    onClick={() => {
                      skill.isOnCooldown ? decreaseCooldown(index) : useSkill(index);
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
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-purple-400 flex-shrink-0">
                            {getRandomIcon()}
                          </div>
                          <h3 className="text-lg font-medium text-gray-100 truncate">
                            {skill.name}
                          </h3>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(index);
                            }}
                            className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 p-2 rounded-lg transition-all shadow-lg"
                            title="Editar habilidade"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Deseja realmente deletar "${skill.name}"?`)) {
                                handleDelete(index);
                              }
                            }}
                            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all shadow-lg"
                            title="Deletar habilidade"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mb-3 flex-wrap">
                        <span className="inline-flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                          {skill.cost}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                          <Clock size={12} />
                          {skill.maxCooldown || skill.cooldown || 0}T
                        </span>
                      </div>

                      {!skill.isOnCooldown && (
                        <div className="mt-3 text-xs text-gray-500 italic">
                          Clique para usar • 
                          <button 
                            onClick={(e) => openSkillModal(index, e)}
                            className="ml-1 text-blue-400 hover:text-blue-300 underline"
                          >
                            Ver detalhes
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
      </div>

      {/* Modal de Detalhes */}
      {selectedSkill !== null && selectedSkill < abilities.length && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                    <Book size={28} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">
                      {abilities[selectedSkill]?.name}
                    </h2>
                    <p className="text-purple-400 text-sm">Detalhes da Habilidade</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Custo
                    </h3>
                    <div className="text-2xl font-bold text-purple-400">
                      {abilities[selectedSkill]?.cost}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Cooldown
                    </h3>
                    <div className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                      <Clock size={20} />
                      {abilities[selectedSkill]?.maxCooldown || abilities[selectedSkill]?.cooldown || 0} Turnos
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                      Status
                    </h3>
                    <div className={`text-lg font-bold ${
                      abilities[selectedSkill]?.isOnCooldown 
                        ? 'text-red-400' 
                        : 'text-green-400'
                    }`}>
                      {abilities[selectedSkill]?.isOnCooldown 
                        ? `Recarga: ${abilities[selectedSkill]?.currentCooldown || 0}T` 
                        : 'Disponível'
                      }
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-lg p-6 border border-gray-700 border-l-4 border-l-purple-500">
                  <h3 className="text-lg font-medium text-gray-100 mb-4 uppercase tracking-wider">
                    📖 Descrição
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                      {abilities[selectedSkill]?.description}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      const index = selectedSkill;
                      setSelectedSkill(null);
                      if (!abilities[index]?.isOnCooldown) {
                        useSkill(index);
                      } else {
                        decreaseCooldown(index);
                      }
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      abilities[selectedSkill]?.isOnCooldown
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {abilities[selectedSkill]?.isOnCooldown ? (
                      <>
                        <Clock size={16} />
                        Reduzir Cooldown
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        Usar Habilidade
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      const index = selectedSkill;
                      setSelectedSkill(null);
                      handleEdit(index);
                    }}
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
    </>
  );
}

export default AbilitiesAndSpells;