import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/seedData';
import { useCodext } from '../context/CodextContext';

export const CategoryChips: React.FC = () => {
  const { activeCategory, setActiveCategory, setSearchQuery } = useCodext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 py-3.5 flex items-center group">
      {/* Scroll Left Button */}
      <button
        onClick={() => handleScroll('left')}
        className="hidden md:flex absolute left-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md items-center justify-center text-slate-700 dark:text-slate-300 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Categories Bar */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 py-1"
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery('');
              }}
              className={`whitespace-nowrap shrink-0 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => handleScroll('right')}
        className="hidden md:flex absolute right-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md items-center justify-center text-slate-700 dark:text-slate-300 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
