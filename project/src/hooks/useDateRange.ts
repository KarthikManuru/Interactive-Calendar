import { useState } from 'react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function useDateRange() {
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const selectDate = (date: Date) => {
    if (!dateRange.start) {
      setDateRange({ start: date, end: null });
    } else if (!dateRange.end) {
      const start = dateRange.start;
      if (date < start) {
        setDateRange({ start: date, end: start });
      } else if (date > start) {
        setDateRange({ start, end: date });
      } else {
        setDateRange({ start: null, end: null });
      }
    } else {
      setDateRange({ start: date, end: null });
    }
  };

  const clearSelection = () => {
    setDateRange({ start: null, end: null });
    setHoverDate(null);
  };

  const isInRange = (date: Date): boolean => {
    if (!dateRange.start) return false;
    if (!dateRange.end) return date.getTime() === dateRange.start.getTime();
    return date >= dateRange.start && date <= dateRange.end;
  };

  const isStartDate = (date: Date): boolean => {
    return dateRange.start ? date.getTime() === dateRange.start.getTime() : false;
  };

  const isEndDate = (date: Date): boolean => {
    return dateRange.end ? date.getTime() === dateRange.end.getTime() : false;
  };

  const getDaysInRange = (): number => {
    if (!dateRange.start || !dateRange.end) return 0;
    const diffTime = Math.abs(dateRange.end.getTime() - dateRange.start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return {
    dateRange,
    setDateRange,
    hoverDate,
    setHoverDate,
    selectDate,
    clearSelection,
    isInRange,
    isStartDate,
    isEndDate,
    getDaysInRange,
  };
}
