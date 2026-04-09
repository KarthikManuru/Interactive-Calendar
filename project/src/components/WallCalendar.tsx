import { useState, useEffect } from 'react';
import { useDateRange } from '../hooks/useDateRange';
import { useCalendarNotes } from '../hooks/useCalendarNotes';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { NotesPanel } from './NotesPanel';

export const THEMES = [
  { id: 'glacier', img: '/glacier-app.jpg.jpeg', color: '#1489CD', tooltip: 'Glacier Blue' },
  { id: 'desert', img: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2074&auto=format&fit=crop', color: '#d97706', tooltip: 'Desert Amber' },
  // Swapped to an incredibly stable Pexels CDN image to prevent hotlink errors
  { id: 'aurora', img: 'https://images.pexels.com/photos/1938348/pexels-photo-1938348.jpeg?auto=compress&cs=tinysrgb&w=2000', color: '#8b5cf6', tooltip: 'Aurora Purple' },
];

export function WallCalendar() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  
  // Theme Engine
  const [themeIdx, setThemeIdx] = useState(0);
  const currentTheme = THEMES[themeIdx];

  const cycleTheme = () => {
    setThemeIdx((prev) => (prev + 1) % THEMES.length);
  };

  // Animation states
  const [flipState, setFlipState] = useState<'idle' | 'out-next' | 'in-next' | 'out-prev' | 'in-prev'>('idle');

  const dateRange = useDateRange();
  const notes = useCalendarNotes(month, year);

  const changeMonth = (newMonth: number, newYear: number, direction: 'next' | 'prev') => {
    if (flipState !== 'idle') return;
    setFlipState(`out-${direction}`);
    
    setTimeout(() => {
      setMonth(newMonth);
      setYear(newYear);
      dateRange.clearSelection();
      setFlipState(`in-${direction}`);
      
      setTimeout(() => {
        setFlipState('idle');
      }, 250);
    }, 250);
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      changeMonth(11, year - 1, 'prev');
    } else {
      changeMonth(month - 1, year, 'prev');
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      changeMonth(0, year + 1, 'next');
    } else {
      changeMonth(month + 1, year, 'next');
    }
  };

  // Unique Developer Feature: Keyboard shortcut navigation for power-users!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'TEXTAREA') return; // Don't flip while user is typing a note
      if (e.key === 'ArrowLeft') handlePrevMonth();
      if (e.key === 'ArrowRight') handleNextMonth();
      if (e.key === 't') cycleTheme(); // Power-user theme toggle
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [month, year, flipState]);

  return (
    <div className="w-full max-w-[450px] px-4 md:px-0 mx-auto relative mt-6 perspective-[1500px]">
      {/* Container holding the background shadow (static) */}
      <div className="absolute inset-0 bg-white calendar-shadow w-full mx-4 md:mx-0 max-w-[calc(100%-2rem)] md:max-w-full" />
      
      {/* Wall Calendar Page wrapper (animated) */}
      <div className={`bg-white w-full relative z-10 ${
        flipState === 'out-next' ? 'animate-flip-out-next' : 
        flipState === 'in-next' ? 'animate-flip-in-next' : 
        flipState === 'out-prev' ? 'animate-flip-out-prev' : 
        flipState === 'in-prev' ? 'animate-flip-in-prev' : ''
      }`}>
        <CalendarHeader
          month={month}
          year={year}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          theme={currentTheme}
          onCycleTheme={cycleTheme}
        />

        <div className="px-5 py-6 sm:px-6 sm:py-8 flex flex-col-reverse sm:flex-row gap-6 sm:gap-6">
          <NotesPanel
            notes={notes.notes}
            onChange={notes.updateNotes}
            isSaved={notes.isSaved}
          />

          <CalendarGrid
            month={month}
            year={year}
            dateRange={dateRange}
            theme={currentTheme}
          />
        </div>
      </div>
    </div>
  );
}
