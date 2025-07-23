import React, { useState, useEffect } from 'react';

function NotesTab() {
  const [notes, setNotes] = useState('');
  const localStorageKey = 'rpgCharacterNotes'; // Chave para o localStorage

  useEffect(() => {
    const savedNotes = localStorage.getItem(localStorageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, notes);
  }, [notes]); // Salva sempre que as notas mudam

  return (
    <div className="p-4 bg-gray-800/60 rounded-md border border-gray-700">
      <h4 className="text-2xl font-medium text-purple-300 mb-4">Minhas Anotações</h4>
      <textarea
        className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500 resize-y"
        rows="15" // Aumentado o número de linhas para mais espaço
        placeholder="Escreva suas anotações, diário de bordo, detalhes de NPC..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>
    </div>
  );
}

export default NotesTab;