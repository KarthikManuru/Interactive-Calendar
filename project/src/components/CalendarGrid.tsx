import { useDateRange } from '../hooks/useDateRange';

interface CalendarGridProps {
  month: number;
  year: number;
  dateRange: ReturnType<typeof useDateRange>;
  theme: { id: string; img: string; color: string; tooltip: string };
}

const dayHeaders = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const holidays: Record<string, string> = {
  // Indian national/common fixed-date holidays format "Month-Date" (0-indexed month)
  "0-1": "New Year's Day",
  "0-14": "Makar Sankranti",
  "0-26": "Republic Day",
  "3-14": "Ambedkar Jayanti",
  "4-1": "Labour Day",
  "7-15": "Independence Day",
  "9-2": "Gandhi Jayanti",
  "11-25": "Christmas Day"
};

export function CalendarGrid({ month, year, dateRange, theme }: CalendarGridProps) {
  const today = new Date();
  
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    // Adjust so MON is 0, SUN is 6
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const daysInPrevMonth = getDaysInMonth(month - 1, year);

  // Rebuilding days array to include actual dates from prev/next months
  type DayObj = { day: number; isPrev?: boolean; isNext?: boolean; actualMonth: number; actualYear: number };
  const days: DayObj[] = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    let pMonth = month - 1;
    let pYear = year;
    if (pMonth < 0) {
      pMonth = 11;
      pYear--;
    }
    days.push({ day: daysInPrevMonth - i, isPrev: true, actualMonth: pMonth, actualYear: pYear });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, actualMonth: month, actualYear: year });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    let nMonth = month + 1;
    let nYear = year;
    if (nMonth > 11) {
      nMonth = 0;
      nYear++;
    }
    days.push({ day: i, isNext: true, actualMonth: nMonth, actualYear: nYear });
  }

  const handleDateClick = (dayObj: DayObj) => {
    const date = new Date(dayObj.actualYear, dayObj.actualMonth, dayObj.day);
    dateRange.selectDate(date);
  };

  const handleDateHover = (dayObj: DayObj) => {
    const date = new Date(dayObj.actualYear, dayObj.actualMonth, dayObj.day);
    dateRange.setHoverDate(date);
  };

  const isDateInRange = (dayObj: DayObj) => {
    const date = new Date(dayObj.actualYear, dayObj.actualMonth, dayObj.day);
    return dateRange.isInRange(date);
  };

  const isDateStart = (dayObj: DayObj) => {
    const date = new Date(dayObj.actualYear, dayObj.actualMonth, dayObj.day);
    return dateRange.isStartDate(date);
  };

  const isDateEnd = (dayObj: DayObj) => {
    const date = new Date(dayObj.actualYear, dayObj.actualMonth, dayObj.day);
    return dateRange.isEndDate(date);
  };

  // Extract opacity-modified colors for the range highlighting
  // Note: For a production app we'd use hex->rgba functions, but here we can just use opacity styles
  
  return (
    <div className="flex-1 w-full mt-4 md:mt-0">
      <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-4">
        {dayHeaders.map((day, idx) => (
          <div 
            key={day} 
            className={`text-[12px] sm:text-sm font-bold text-center h-6 transition-colors duration-500`}
            style={{ color: idx >= 5 ? theme.color : '#1f2937' }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1">
        {days.map((dayObj, idx) => {
          const isWeekend = (idx % 7) >= 5;
          const isCurrentMonth = !dayObj.isPrev && !dayObj.isNext;
          const isStart = isDateStart(dayObj);
          const isEnd = isDateEnd(dayObj);
          const inRange = isDateInRange(dayObj);
          const isToday = today.getDate() === dayObj.day && today.getMonth() === dayObj.actualMonth && today.getFullYear() === dayObj.actualYear;
          
          const holidayKey = `${dayObj.actualMonth}-${dayObj.day}`;
          const holidayName = holidays[holidayKey];

          let textColor = '#1f2937'; // gray-800
          if (!isCurrentMonth) {
            textColor = '#d1d5db'; // gray-300
          } else if (isWeekend) {
            textColor = theme.color;
          }

          if (isStart || isEnd) {
            textColor = '#ffffff';
          }

          // Generate dynamic inline styles for the selection logic based on the theme
          const cellStyle: React.CSSProperties = {};
          if (isStart || isEnd) {
            cellStyle.backgroundColor = theme.color;
          } else if (inRange) {
            // Faux opacity by blending with white or just lowering opacity of background layer
          }
          if (isToday && (!isStart && !isEnd)) {
            cellStyle.boxShadow = `0 0 0 2px ${theme.color}99`; // 60% opacity hex
            cellStyle.backgroundColor = `${theme.color}11`; // ~5% opacity hex
          }

          return (
            <div
              key={idx}
              className={`
                h-10 flex items-center justify-center text-sm font-semibold relative cursor-pointer
              `}
              onClick={() => handleDateClick(dayObj)}
              onMouseEnter={() => handleDateHover(dayObj)}
              onMouseLeave={() => dateRange.setHoverDate(null)}
              title={holidayName}
            >
              {/* Range background bar */}
              {inRange && !isStart && !isEnd && (
                <div 
                  className="absolute inset-0 rounded-md transition-colors duration-500"
                  style={{ backgroundColor: `${theme.color}22` }} // ~15% opacity highlight
                />
              )}
              
              <div 
                className={`
                  w-8 h-8 flex flex-col items-center justify-center rounded-full z-10 transition-all duration-500 relative
                  ${!(isStart || isEnd) ? 'hover:bg-gray-100' : ''}
                  ${isToday && (!isStart && !isEnd) ? 'animate-pulse font-bold' : ''}
                `}
                style={{ ...cellStyle, color: textColor }}
              >
                {dayObj.day}
                {holidayName && (
                  <div className={`absolute bottom-0 w-1 h-1 rounded-full ${isStart || isEnd ? 'bg-white' : 'bg-red-400'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {dateRange.dateRange.start && dateRange.dateRange.end && (
        <div className="mt-6 flex items-center justify-between text-xs text-gray-400 font-medium">
          <span>
            {dateRange.getDaysInRange()} days selected
          </span>
          <button
            onClick={() => dateRange.clearSelection()}
            className="px-3 py-1 font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 rounded transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
