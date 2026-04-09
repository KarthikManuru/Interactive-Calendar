import { useState, useEffect } from 'react';

export function useCalendarNotes(month: number, year: number) {
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const storageKey = `calendar-notes-${year}-${month}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setNotes(saved);
      setIsSaved(true);
    }
  }, [month, year, storageKey]);

  const updateNotes = (text: string) => {
    setNotes(text);
    setIsSaved(false);
  };

  const saveNotes = () => {
    localStorage.setItem(storageKey, notes);
    setIsSaved(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes) {
        saveNotes();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [notes]);

  return {
    notes,
    updateNotes,
    isSaved,
  };
}
