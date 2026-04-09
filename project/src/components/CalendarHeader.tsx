import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  theme: { id: string; img: string; color: string; tooltip: string };
  onCycleTheme: () => void;
}

const monthNames = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

export function CalendarHeader({ month, year, onPrevMonth, onNextMonth, theme, onCycleTheme }: CalendarHeaderProps) {
  // Standard twin-loop (Wire-O) holes density
  const spirals = Array.from({ length: 18 });

  return (
    <div className="relative w-full bg-white z-20 transition-colors duration-500">
      {/* Authentic Wire Binding & Hanger */}
      <div className="absolute -top-[16px] left-0 right-0 w-full flex justify-between px-6 z-40">
        
        {/* Horizontal binder rod visible behind the loops */}
        <div className="absolute top-[8px] left-[15px] right-[15px] h-[4px] bg-[#111] rounded-full shadow-inner z-30 opacity-80" />

        {/* Center Hanger Loop with Metallic SVG Gradient */}
        <svg 
          className="absolute -top-[30px] left-1/2 -translate-x-1/2 w-16 h-[50px] z-20 drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]" 
          viewBox="0 0 60 50"
        >
          <defs>
            <linearGradient id="metalWire" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="20%" stopColor="#f3f4f6" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
          </defs>
          {/* Main wire triangle hanger */}
          <path 
            d="M 5 45 L 28 8 C 29 5 31 5 32 8 L 55 45" 
            fill="none" 
            stroke="url(#metalWire)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* The loop at the peak for the nail */}
          <circle cx="30" cy="8" r="4" fill="none" stroke="url(#metalWire)" strokeWidth="3.5" />
        </svg>

        {/* Twin-loop (Wire-O) Spiral Rings */}
        <div className="w-full flex justify-between relative z-40 px-2 mt-[2px]">
          {spirals.map((_, i) => (
            <div key={i} className="flex flex-col items-center relative">
              {/* Paper hole punch */}
              <div className="absolute bottom-[2px] w-[14px] h-[8px] bg-[#111] rounded-full z-10 shadow-[inset_0_3px_4px_rgba(0,0,0,1)]" />
              
              {/* Double wire loops acting as realistic twin-wire bind */}
              <div className="flex gap-[2px] relative z-40 mb-1">
                <div 
                  className="w-[4.5px] h-[26px] rounded-full" 
                  style={{
                    background: 'linear-gradient(90deg, #4b5563 0%, #f3f4f6 30%, #ffffff 50%, #9ca3af 80%, #030712 100%)',
                    boxShadow: 'inset 0 3px 2px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(0,0,0,0.8), 2px 4px 4px rgba(0,0,0,0.6)'
                  }} 
                />
                <div 
                  className="w-[4.5px] h-[26px] rounded-full" 
                  style={{
                    background: 'linear-gradient(90deg, #4b5563 0%, #f3f4f6 30%, #ffffff 50%, #9ca3af 80%, #030712 100%)',
                    boxShadow: 'inset 0 3px 2px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(0,0,0,0.8), 2px 4px 4px rgba(0,0,0,0.6)'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden h-[180px] sm:h-[240px]">
        <img
          src={theme.img}
          alt={`Calendar hero - ${theme.tooltip}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          key={theme.id} // forces re-render fade if desired, but object-cover is fine
        />

        {/* Navigation controls (discreet) + Theme Toggle */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 z-30 pointer-events-none">
          <div className="flex flex-col gap-2">
            <button
              onClick={onPrevMonth}
              className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white/90 p-1.5 rounded-full backdrop-blur-[2px] transition-all shadow-md border border-white/10"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={onCycleTheme}
              title={`Switch Theme (Current: ${theme.tooltip} | Shortkey 't')`}
              className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white/90 p-1.5 rounded-full backdrop-blur-[2px] transition-all shadow-md mt-4 border border-white/10"
              aria-label="Toggle Theme"
            >
              <Palette size={20} />
            </button>
          </div>
          
          <button
            onClick={onNextMonth}
            className="pointer-events-auto bg-black/20 hover:bg-black/40 text-white/90 p-1.5 rounded-full backdrop-blur-[2px] transition-all shadow-md self-start border border-white/10"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Polygons - Perfected V-Valley from reference */}
        <div 
          className="absolute bottom-0 left-0 right-0 w-full h-[100px] sm:h-[130px] transition-colors duration-500"
          style={{
            backgroundColor: theme.color,
            clipPath: 'polygon(0% 55%, 35% 100%, 100% 15%, 100% 100%, 0% 100%)'
          }}
        />

        {/* Text Positioning: Right-aligned inside the large right triangle */}
        <div className="absolute bottom-4 sm:bottom-6 right-5 sm:right-8 z-20 text-right drop-shadow-md">
          <div className="text-white flex flex-col items-end">
            <span className="text-xl sm:text-2xl md:text-[28px] font-normal tracking-wide leading-none opacity-90 mb-1 sm:mb-[6px]">
              {year}
            </span>
            <span className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-wider leading-none">
              {monthNames[month]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
