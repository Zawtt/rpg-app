import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

function NotesTab() {
  const [notes, setNotes] = useState('');
  const localStorageKey = 'rpgCharacterNotes'; // Chave para o localStorage
  const theme = useTheme();

  useEffect(() => {
    // ✅ CORREÇÃO: localStorage com verificação de disponibilidade
    try {
      if (typeof Storage !== 'undefined') {
        const savedNotes = localStorage.getItem(localStorageKey);
        if (savedNotes) {
          setNotes(savedNotes);
        }
      }
    } catch (error) {
      console.warn('localStorage não disponível:', error);
    }
  }, []);

  useEffect(() => {
    // ✅ CORREÇÃO: localStorage com tratamento de erro e debounce
    const timeoutId = setTimeout(() => {
      try {
        if (typeof Storage !== 'undefined') {
          localStorage.setItem(localStorageKey, notes);
        }
      } catch (error) {
        console.warn('Erro ao salvar notas no localStorage:', error);
      }
    }, 500); // Debounce de 500ms para evitar muitas escritas

    return () => clearTimeout(timeoutId);
  }, [notes]);

  return (
    <div className={`p-4 ${theme.classes.card} rounded-md ${theme.classes.cardBorder}`}>
      <h4 className={`text-2xl font-storm-gust font-medium text-amber-100 mb-4`}>Minhas Anotações</h4>
      <textarea
        className={`w-full p-2 font-medieval bg-gray-800/80 border border-amber-600/50 text-amber-100 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-amber-400/60 resize-y break-words word-break-break-word overflow-wrap-break-word hyphens-auto`}
        style={{whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word'}}
        rows="15" // Aumentado o número de linhas para mais espaço
        placeholder="Escreva suas anotações, diário de bordo, detalhes de NPC..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      ></textarea>
    </div>
  );
}

export default NotesTab;