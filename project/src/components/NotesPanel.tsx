import { useRef, useEffect } from 'react';

interface NotesPanelProps {
  notes: string;
  onChange: (notes: string) => void;
  isSaved: boolean;
}

export function NotesPanel({ notes, onChange, isSaved }: NotesPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineHeight = 36;
  const numLines = 6;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${numLines * lineHeight}px`;
    }
  }, [numLines, lineHeight]);

  return (
    <div className="flex-shrink-0 w-full sm:w-[35%]">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-gray-800 tracking-wide">Notes</label>
        <span
          className={`text-[10px] font-medium transition-opacity ${
            isSaved ? 'opacity-100 text-green-600' : 'opacity-0 text-gray-400'
          }`}
        >
          Saved
        </span>
      </div>

      <div className="relative pt-0 w-full">
        {/* Background lines */}
        <div className="absolute inset-0 pointer-events-none mt-1">
          {Array.from({ length: numLines }).map((_, i) => (
            <div 
              key={i} 
              className="border-b border-gray-300 w-full"
              style={{ height: `${lineHeight}px` }} 
            />
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder=""
          className="relative w-full px-0 py-0 text-sm text-gray-800 bg-transparent border-0 outline-none resize-none placeholder-gray-400 focus:ring-0 mt-1"
          style={{
            lineHeight: `${lineHeight}px`,
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
