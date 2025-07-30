import React, { useState } from 'react';
import { Skull, Plus, Trash2, Clock, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from './ThemeProvider';

function Debuffs() {
  // ✅ CORREÇÃO: Usar context ao invés de dados mockados
  const { debuffs, setDebuffs, showToast } = useAppContext();
  const theme = useTheme();
  
  const [newDebuff, setNewDebuff] = useState({ name: '', turns: 1 });

  // Cores medievais/âmbar para os debuffs
  const debuffColors = [
    { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-400' },
    { bg: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-400' },
    { bg: 'bg-yellow-600', border: 'border-yellow-500', text: 'text-yellow-400' },
    { bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-400' },
    { bg: 'bg-rose-600', border: 'border-rose-500', text: 'text-rose-400' },
    { bg: 'bg-stone-600', border: 'border-stone-500', text: 'text-stone-400' },
    { bg: 'bg-neutral-600', border: 'border-neutral-500', text: 'text-neutral-400' },
    { bg: 'bg-zinc-600', border: 'border-zinc-500', text: 'text-zinc-400' }
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

  // Theme já foi importado no topo do componente

  return (
    <div className={`debuffs-container ${theme.classes.card} backdrop-blur-sm rounded-lg border ${theme.classes.cardBorder} shadow-xl sticky top-6`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme.classes.cardBorder}`}>
        <h3 className={`font-semibold font-medieval text-amber-100 flex items-center gap-2`}>
          {/* GIF Animado SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" className="text-amber-400">
            <circle cx="12" cy="12" r="3" fill="currentColor">
              <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
              <animate attributeName="stroke-dasharray" values="0,50;25,25;50,0" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
          <Skull size={16} className="text-amber-400" />
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
              className={`w-full px-3 py-2 ${theme.classes.input} border ${theme.classes.cardBorder} rounded font-medieval text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm`}
              placeholder="Nome do debuff..."
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={newDebuff.turns}
              onChange={(e) => setNewDebuff({ ...newDebuff, turns: e.target.value })}
              min="1"
              className={`w-20 px-3 py-2 ${theme.classes.input} border ${theme.classes.cardBorder} rounded font-medieval text-amber-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors text-sm`}
              placeholder="Turnos"
            />
            <button
              onClick={addDebuff}
              className={`button-safe flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors flex items-center justify-center gap-1 text-sm font-medium font-medieval`}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>

        {/* Debuffs List */}
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {debuffs.length === 0 ? (
            <p className={`text-amber-400/60 text-sm italic text-center py-4 font-medieval`}>
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
                  <div className="flex-1 min-w-0 pr-2">
                    <div className={`font-medium font-medieval ${debuff.color.text} text-sm break-words`}>
                      {debuff.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-400/60 mt-1 font-medieval">
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
                <div className="text-xs text-amber-400/50 mt-2 italic font-medieval">
                  Clique para reduzir turno
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
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