import React from 'react';
import { TRAVEL_STYLES } from '../data/initialData';

interface HeroSectionProps {
  theme: 'dark' | 'light';
  selectedStyle: string;
  onSelectStyle: (style: string) => void;
  totalMemoriesCount: number;
  isOffline: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  selectedStyle,
  onSelectStyle,
  totalMemoriesCount,
  isOffline,
}) => {
  return (
    <div className="pt-8 pb-6 border-b transition-colors border-inherit">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Editorial Kicker from IMG_5491 */}
          <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#EF853F] font-semibold mb-2">
            A scrapbook, kept together.
          </p>

          {/* Headline matching screenshot */}
          <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-current leading-none">
            Your memories, kept.
          </h1>
          
          <p className={`mt-2.5 text-sm max-w-xl ${
            theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
          }`}>
            A shared diary of field notes, road trips, and quiet moments pinned across the world. Fully offline-accessible for remote trails.
          </p>
        </div>

        {/* Travel Style Filter Controls (Interactive Segmented Bar) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-stone-200/50 dark:border-stone-800/80">
          {TRAVEL_STYLES.map((style) => {
            const isActive = selectedStyle === style;
            return (
              <button
                key={style}
                onClick={() => onSelectStyle(style)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FAB76D] text-stone-950 font-semibold shadow-xs'
                    : theme === 'dark'
                    ? 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-black/5'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
