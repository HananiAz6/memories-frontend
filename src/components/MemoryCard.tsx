import React from 'react';
import { TravelMemory, User } from '../types/travel';
import { Heart, MessageSquare, MapPin, Bookmark, CloudOff, Calendar } from 'lucide-react';
import { playHapticSound } from '../utils/storage';

interface MemoryCardProps {
  memory: TravelMemory;
  theme: 'dark' | 'light';
  currentUser: User | null;
  onLike: (memoryId: string) => void;
  onSelect: (memory: TravelMemory) => void;
  isBookmarked: boolean;
  onToggleBookmark: (memoryId: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  theme,
  currentUser,
  onLike,
  onSelect,
  isBookmarked,
  onToggleBookmark,
}) => {
  const isLiked = currentUser ? memory.likes.includes(currentUser.id) : false;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHapticSound('like');
    onLike(memory.id);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHapticSound('toggle');
    onToggleBookmark(memory.id);
  };

  return (
    <article
      onClick={() => onSelect(memory)}
      className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#212429] hover:bg-[#25292F] border-[#2E343B] text-stone-100 shadow-md hover:border-[#FAB76D]/40'
          : 'bg-white hover:bg-stone-50/80 border-[#E8E2D8] text-stone-900 shadow-xs hover:border-[#2C8287]/40'
      }`}
    >
      {/* Scrapbook Tape Accent from Screenshot */}
      <div className="scrapbook-tape-left" />

      {/* Photo Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
        <img
          src={memory.photoUrl}
          alt={memory.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Location & Style Stamp */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/95">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs">
            <MapPin className="w-3 h-3 text-[#FAB76D]" />
            <span className="truncate max-w-[120px]">{memory.location}</span>
          </span>

          {memory.itinerary && memory.itinerary.length > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2C8287]/90 backdrop-blur-xs font-medium">
              <Calendar className="w-3 h-3" />
              <span>{memory.itinerary.length} Days</span>
            </span>
          )}
        </div>

        {/* Pending Sync badge if offline */}
        {memory.isPendingSync && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EF853F] text-white text-[10px] font-mono shadow-sm">
            <CloudOff className="w-3 h-3" />
            <span>Pending sync</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5">
        {/* Date and Author Stamp - Clean unboxed text matching screenshot & anti-slop rules */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-wider uppercase text-stone-400 mb-2">
          <div className="flex items-center gap-1.5 truncate">
            <span>{memory.createdAt}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{memory.author.name}</span>
          </div>
          <button
            onClick={handleBookmarkClick}
            className={`p-1 rounded-md transition-colors ${
              isBookmarked 
                ? 'text-[#EF853F]' 
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title={isBookmarked ? "Saved for offline" : "Save for offline"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title in Newsreader / Serif font */}
        <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-current group-hover:text-[#EF853F] transition-colors leading-snug">
          {memory.title}
        </h3>

        {/* Description caption */}
        <p className={`mt-2 text-xs sm:text-sm line-clamp-3 leading-relaxed ${
          theme === 'dark' ? 'text-stone-400' : 'text-stone-600'
        }`}>
          {memory.description}
        </p>

        {/* Tags row - Clean hashtag text matching IMG_5491 */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono text-[#2C8287] dark:text-[#89C9D2]">
          {memory.tags.map((tag) => (
            <span key={tag} className="hover:underline">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer interactions bar */}
        <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
          {/* Like button - Matches heart count in IMG_5491 */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 transition-colors font-mono ${
              isLiked
                ? 'text-[#EF853F] font-semibold'
                : 'text-stone-400 hover:text-[#EF853F]'
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-current text-[#EF853F]' : ''}`} />
            <span>{memory.likes.length}</span>
          </button>

          {/* Comments count */}
          <div className="flex items-center gap-1.5 text-stone-400 font-mono">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{memory.comments.length}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
