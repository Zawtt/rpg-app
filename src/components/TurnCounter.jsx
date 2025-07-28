import React, { useState, useEffect } from 'react';

function TurnCounter() {
  const [turn, setTurn] = useState(1);
  const localStorageKey = 'rpgTurnCounter';

  useEffect(() => {
    // ✅ CORREÇÃO: localStorage com verificação de disponibilidade
    try {
      if (typeof Storage !== 'undefined') {
        const savedTurn = localStorage.getItem(localStorageKey);
        if (savedTurn) {
          const parsedTurn = parseInt(savedTurn, 10);
          if (!isNaN(parsedTurn) && parsedTurn > 0) {
            setTurn(parsedTurn);
          }
        }
      }
    } catch (error) {
      console.warn('localStorage não disponível:', error);
    }
  }, []);

  useEffect(() => {
    // ✅ CORREÇÃO: localStorage com tratamento de erro
    try {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem(localStorageKey, turn.toString());
      }
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }, [turn]);

  const incrementTurn = () => {
    setTurn(prevTurn => prevTurn + 1);
  };

  const decrementTurn = () => {
    setTurn(prevTurn => Math.max(1, prevTurn - 1)); // Garante que o turno não seja menor que 1
  };

  const resetTurn = () => {
    if (window.confirm('Tem certeza que deseja reiniciar o contador de turnos?')) {
      setTurn(1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 w-24 h-24 text-center select-none transform transition-transform duration-200 hover:scale-105 z-20">
      <p className="text-gray-400 text-xs font-bold uppercase -mb-1">Turno</p>
      <div className="text-5xl font-extrabold text-teal-400 leading-none">
        {turn}
      </div>
      <div className="flex w-full justify-between items-center mt-1">
        <button
          onClick={decrementTurn}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-1.5 py-0.5 rounded-md text-sm transition-colors duration-200"
          title="Turno Anterior"
        >
          -
        </button>
        <button
          onClick={resetTurn}
          className="bg-red-700 hover:bg-red-600 text-white font-bold px-1.5 py-0.5 rounded-md text-sm transition-colors duration-200"
          title="Reiniciar Turno"
        >
          Reset
        </button>
        <button
          onClick={incrementTurn}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-1.5 py-0.5 rounded-md text-sm transition-colors duration-200"
          title="Próximo Turno"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default TurnCounter;