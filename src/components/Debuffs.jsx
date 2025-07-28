import React, { useState } from 'react';
import { Skull, Plus, Trash2, Clock, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

function Debuffs() {
  // ✅ CORREÇÃO: Usar context ao invés de dados mockados
  const { debuffs, setDebuffs, showToast } = useAppContext();
  
  const [newDebuff, setNewDebuff] = useState({ name: '', turns: 1 });

  // Cores aleatórias para os debuffs
  const debuffColors = [
    { bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-400' },
    { bg: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-400' },
    { bg: 'bg-yellow-600', border: 'border-yellow-500', text: 'text-yellow-400' },
    { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400' },
    { bg: 'bg-pink-600', border: 'border-pink-500', text: 'text-pink-400' },
    { bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-400' },
    { bg: 'bg-rose-600', border: 'border-rose-500', text: 'text-rose-400' },
    { bg: 'bg-violet-600', border: 'border-violet-500', text: 'text-violet-400' }
  ];

  const getRandomColor = () => {
    return debuffColors[Math.floor(Math.random() * debuffColors.length)];
  };

  const addDebuff = () => {
    if (newDebuff.name.trim() && newDebuff.turns > 0) {
      const debuffWithColor = {
        id: Date.now(),
        name: newDebuff.name.trim(),
        turns: parseInt(newDebuff.turns),
        maxTurns: parseInt(newDebuff.turns),
        color: getRandomColor()
      };
      setDebuffs([...debuffs, debuffWithColor]);
      setNewDebuff({ name: '', turns: 1 });
      showToast(`Debuff "${debuffWithColor.name}" adicionado!`, 'warning');
    }
  };

  const removeDebuff = (idToRemove) => {
    const debuffToRemove = debuffs.find(d => d.id === idToRemove);
    setDebuffs(debuffs.filter(debuff => debuff.id !== idToRemove));
    if (debuffToRemove) {
      showToast(`Debuff "${debuffToRemove.name}" removido`, 'success');
    }
  };

  const decreaseTurn = (id) => {
    const updatedDebuffs = debuffs.map(debuff => {
      if (debuff.id === id) {
        const newTurns = debuff.turns - 1;
        if (newTurns <= 0) {
          showToast(`Debuff "${debuff.name}" expirou!`, 'success');
          return null;
        }
        return { ...debuff, turns: newTurns };
      }
      return debuff;
    }).filter(Boolean);
    
    setDebuffs(updatedDebuffs);
  };

  return (
    <div className="debuffs-container bg-gray-950/90 backdrop-blur-sm rounded-lg border border-gray-800 shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-semibold text-gray-100 flex items-center gap-2">
          <Skull size={16} className="text-red-400" />
          Debuffs
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Add New Debuff */}
        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={newDebuff.name}
              onChange={(e) => setNewDebuff({ ...newDebuff, name: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addDebuff()}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm"
              placeholder="Nome do debuff..."
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={newDebuff.turns}
              onChange={(e) => setNewDebuff({ ...newDebuff, turns: e.target.value })}
              min="1"
              className="w-20 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors text-sm"
              placeholder="Turnos"
            />
            <button
              onClick={addDebuff}
              className="button-safe flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center justify-center gap-1 text-sm font-medium"
            >
              <Plus size={14} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Debuffs List */}
        <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-visible">
          {debuffs.length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Nenhum debuff ativo
            </p>
          ) : (
            debuffs.map((debuff) => (
              <div
                key={debuff.id}
                className={`debuff-item p-3 ${debuff.color.bg}/20 rounded border ${debuff.color.border}/30 cursor-pointer hover:${debuff.color.bg}/30 transition-colors`}
                onClick={() => decreaseTurn(debuff.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${debuff.color.text} text-sm truncate`}>
                      {debuff.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock size={10} />
                      <span>{debuff.turns} turnos restantes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`text-2xl font-bold ${debuff.color.text}`}>
                      {debuff.turns}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDebuff(debuff.id);
                      }}
                      className="button-safe p-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 italic">
                  Clique para reduzir turno
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .debuffs-container {
          position: relative;
          z-index: 25;
          isolation: isolate;
        }

        .debuff-item {
          position: relative;
          z-index: 26;
          overflow: visible;
          contain: layout style;
        }

        /* Garante que botões não saiam do container */
        .button-safe {
          position: relative;
          z-index: 27;
          isolation: isolate;
          min-width: 0;
          white-space: nowrap;
        }

        /* Garante que elementos não sejam cortados */
        .debuffs-container * {
          overflow: visible;
        }

        /* Container específico para botões */
        .debuffs-container .flex {
          overflow: visible;
          align-items: stretch;
        }

        /* Fix para hover states que podem causar problemas */
        .debuff-item:hover {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}

export default Debuffs;