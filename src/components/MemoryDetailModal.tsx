import React, { useState } from 'react';
import { TravelMemory, User, Comment } from '../types/travel';
import { X, Heart, MessageSquare, MapPin, Calendar, Bookmark, Share2, Download, CloudOff, Check } from 'lucide-react';
import { playHapticSound } from '../utils/storage';

interface MemoryDetailModalProps {
  memory: TravelMemory | null;
  onClose: () => void;
  theme: 'dark' | 'light';
  currentUser: User | null;
  onLike: (memoryId: string) => void;
  onAddComment: (memoryId: string, text: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (memoryId: string) => void;
  isOffline: boolean;
  onRequireAuth: () => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  onClose,
  theme,
  currentUser,
  onLike,
  onAddComment,
  isBookmarked,
  onToggleBookmark,
  isOffline,
  onRequireAuth,
}) => {
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadedOffline, setDownloadedOffline] = useState(false);

  if (!memory) return null;

  const isLiked = currentUser ? memory.likes.includes(currentUser.id) : false;

  const handleLike = () => {
    playHapticSound('like');
    onLike(memory.id);
  };

  const handleBookmark = () => {
    playHapticSound('toggle');
    onToggleBookmark(memory.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    if (!commentText.trim()) return;

    playHapticSound('post');
    onAddComment(memory.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadItinerary = () => {
    // Generate an offline text/markdown summary of the itinerary
    const content = `TRIP MEMORY & ITINERARY: ${memory.title}
Location: ${memory.location}, ${memory.country}
Author: ${memory.author.name} (${memory.author.email})
Date: ${memory.createdAt}
Travel Style: ${memory.travelStyle}
Tags: ${memory.tags.map(t => '#' + t).join(' ')}

Story:
${memory.description}

${memory.itinerary ? memory.itinerary.map(day => `
Day ${day.dayNumber}: ${day.title}
Budget: ${day.budgetEstimate || 'N/A'}
Tips: ${day.tips || 'None'}
Activities:
${day.activities.map(a => ` - ${a}`).join('\n')}
`).join('\n') : 'No structured daily itinerary attached.'}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${memory.title.toLowerCase().replace(/\s+/g, '_')}_itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedOffline(true);
    setTimeout(() => setDownloadedOffline(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-5xl rounded-3xl overflow-hidden border shadow-2xl transition-all my-auto ${
          theme === 'dark'
            ? 'bg-[#1C1F23] border-[#2E343B] text-stone-100'
            : 'bg-white border-[#E5DFD5] text-stone-900'
        }`}
      >
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-xs cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Layout - Split photo on left/center, details and comments on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto lg:overflow-hidden">
          
          {/* Left Column: Photo & Itinerary Days */}
          <div className="lg:col-span-7 bg-stone-950 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div className="relative w-full aspect-4/3 lg:aspect-auto lg:h-[480px] bg-stone-900 overflow-hidden">
              <img
                src={memory.photoUrl}
                alt={memory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/80 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FAB76D]" />
                    <span>{memory.location}, {memory.country}</span>
                    <span>·</span>
                    <span className="text-[#89C9D2]">{memory.travelStyle}</span>
                  </div>
                  {memory.photoCaption && (
                    <p className="text-sm italic text-stone-200 font-serif">"{memory.photoCaption}"</p>
                  )}
                </div>
              </div>
            </div>

            {/* Structured Itinerary timeline (if attached) */}
            {memory.itinerary && memory.itinerary.length > 0 && (
              <div className="p-5 sm:p-6 bg-stone-900/90 text-stone-200 border-t border-stone-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-mono tracking-wider uppercase text-[#FAB76D] flex items-center gap-2 font-semibold">
                    <Calendar className="w-4 h-4 text-[#FAB76D]" />
                    Field Itinerary · {memory.itinerary.length} Days
                  </h4>
                  <button
                    onClick={handleDownloadItinerary}
                    className="flex items-center gap-1.5 text-xs text-[#89C9D2] hover:text-[#CCECEE] transition-colors"
                  >
                    {downloadedOffline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{downloadedOffline ? 'Saved to file' : 'Export offline guide'}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {memory.itinerary.map((day) => (
                    <div key={day.dayNumber} className="relative pl-6 pb-2 border-l border-[#2C8287]/40 last:border-l-0">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-[#FAB76D] ring-4 ring-stone-900" />
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-semibold text-white">Day {day.dayNumber}: {day.title}</span>
                        {day.budgetEstimate && (
                          <span className="text-[11px] font-mono text-[#FFB49C]">{day.budgetEstimate}</span>
                        )}
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-stone-300">
                        {day.activities.map((act, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#FAB76D] text-xs">›</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                      {day.tips && (
                        <p className="mt-2 text-[11px] text-stone-400 italic bg-black/30 p-2 rounded-lg">
                          Tip: {day.tips}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Story & Comments (Matches IMG_5491 Post Detail) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
            <div>
              {/* Date & Author Banner - Matches "Kept by Anonymous" / "Kept by Walter" */}
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                <span>{memory.createdAt}</span>
                <span className="text-[#EF853F] font-medium">Kept by {memory.author.name}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-current leading-tight">
                {memory.title}
              </h2>

              {/* Tags */}
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono text-[#2C8287] dark:text-[#89C9D2]">
                {memory.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>

              {/* Story Description */}
              <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-800">
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  {memory.description}
                </p>
              </div>

              {/* Action Bar (Like, Bookmark, Share) */}
              <div className="mt-6 flex items-center justify-between py-3 border-y border-stone-200/60 dark:border-stone-800">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 text-xs font-mono font-medium transition-colors ${
                    isLiked ? 'text-[#EF853F]' : 'text-stone-400 hover:text-[#EF853F]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{memory.likes.length} Likes</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      isBookmarked ? 'text-[#EF853F]' : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title={isBookmarked ? "Saved in local offline store" : "Save for offline"}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section - Matches "Comments" list in IMG_5491 */}
              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold mb-3 flex items-center justify-between">
                  <span>Comments ({memory.comments.length})</span>
                  {isOffline && (
                    <span className="text-[10px] text-[#EF853F] flex items-center gap-1 font-mono">
                      <CloudOff className="w-3 h-3" />
                      Offline Mode
                    </span>
                  )}
                </h4>

                {memory.comments.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-4 text-center">
                    No comments yet. Be the first to ask about this journey.
                  </p>
                ) : (
                  <div className="space-y-3.5 max-h-52 overflow-y-auto pr-1">
                    {memory.comments.map((comm) => (
                      <div key={comm.id} className="text-xs flex gap-2.5">
                        <img
                          src={comm.author.avatar}
                          alt={comm.author.name}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between">
                            <span className="font-semibold text-current">{comm.author.name}</span>
                            <span className="text-[10px] font-mono text-stone-400">{comm.createdAt}</span>
                          </div>
                          <p className={`mt-0.5 leading-relaxed ${
                            theme === 'dark' ? 'text-stone-300' : 'text-stone-700'
                          }`}>
                            {comm.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Add a Comment Form - Matches "Add a comment" in IMG_5491 */}
            <form onSubmit={handleCommentSubmit} className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                Add a comment
              </label>
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Say something nice or ask for a trail tip..."
                  className={`w-full px-3 py-2 text-xs rounded-xl border transition-all outline-hidden resize-none ${
                    theme === 'dark'
                      ? 'bg-[#181B1E] border-stone-700 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                      : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
                  }`}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    {isOffline ? 'Comment will queue for sync' : 'Real-time alert sent to explorer'}
                  </span>
                  <button
                    type="submit"
                    className="py-1.5 px-4 text-xs font-semibold rounded-lg bg-[#FAB76D] hover:bg-[#EF853F] hover:text-white text-stone-950 transition-colors shadow-xs"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};
