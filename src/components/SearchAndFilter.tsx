import React, { useState } from 'react';
import { Search, Tag, MapPin, X, RotateCcw } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/initialData';

interface SearchAndFilterProps {
  theme: 'dark' | 'light';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string;
  onTagChange: (t: string) => void;
  selectedDestination: string;
  onDestinationChange: (d: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  theme,
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  selectedDestination,
  onDestinationChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      onTagChange(tagInput.trim().replace(/^#/, ''));
      setTagInput('');
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
      theme === 'dark' 
        ? 'bg-[#212429] border-[#2E343B] text-stone-200' 
        : 'bg-white border-[#E7E2D8] text-stone-800 shadow-xs'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono tracking-widest uppercase text-[#EF853F] font-semibold flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
          Filter Explorer Log
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-[#EF853F] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Search input - Matches "Search memories..." in IMG_5491 */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search memories, trails, notes..."
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border transition-all outline-hidden ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
            }`}
          />
        </div>

        {/* Tag input - Matches "Add a tag, press Enter" in IMG_5491 */}
        <div className="relative">
          <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={selectedTag ? `Filtered by #${selectedTag} (Type & enter)` : "Add a tag, press Enter"}
            className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl border transition-all outline-hidden ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
            }`}
          />
          {selectedTag && (
            <button
              onClick={() => onTagChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              title="Clear tag"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Destination select */}
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <select
            value={selectedDestination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl border appearance-none transition-all outline-hidden cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-200'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-800'
            }`}
          >
            {POPULAR_DESTINATIONS.map((dest) => (
              <option key={dest} value={dest === 'All Destinations' ? '' : dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>

        {/* Active Tag pill if selected */}
        {selectedTag && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400 text-[11px]">Active tag:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EF853F]/15 text-[#EF853F] font-mono text-[11px]">
              #{selectedTag}
              <button onClick={() => onTagChange('')} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
