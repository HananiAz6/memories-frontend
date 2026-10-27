import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, MapPin, Plus, Trash2, Calendar, Check, AlertCircle } from 'lucide-react';
import { User, TravelMemory, ItineraryDay } from '../types/travel';
import { TRAVEL_STYLES } from '../data/initialData';
import { playHapticSound } from '../utils/storage';

import goldenCoastImg from '../assets/images/golden_coast_sunset_1791174430675.jpg';
import winterSnowImg from '../assets/images/winter_snow_village_1791174444783.jpg';
import sundayMarketImg from '../assets/images/sunday_market_coffee_1791174456815.jpg';
import lateNightFriendsImg from '../assets/images/late_night_friends_1791174468983.jpg';
import kyotoBambooImg from '../assets/images/kyoto_bamboo_trail_1791174479424.jpg';

interface NewMemorySidebarProps {
  theme: 'dark' | 'light';
  currentUser: User | null;
  onPostMemory: (memory: Partial<TravelMemory>) => void;
  isOffline: boolean;
  onRequireAuth: () => void;
}

const PRESET_PHOTOS = [
  { name: 'Golden Coast', url: goldenCoastImg },
  { name: 'Winter Chalet', url: winterSnowImg },
  { name: 'Morning Market', url: sundayMarketImg },
  { name: 'Campfire', url: lateNightFriendsImg },
  { name: 'Bamboo Path', url: kyotoBambooImg },
];

export const NewMemorySidebar: React.FC<NewMemorySidebarProps> = ({
  theme,
  currentUser,
  onPostMemory,
  isOffline,
  onRequireAuth,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [travelStyle, setTravelStyle] = useState('Slow Travel');
  const [tagsInput, setTagsInput] = useState('');
  const [photoUrl, setPhotoUrl] = useState(goldenCoastImg);
  const [photoCaption, setPhotoCaption] = useState('');
  const [showItineraryBuilder, setShowItineraryBuilder] = useState(false);
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      title: 'Day 1: Arrival & Exploration',
      activities: ['Check in to local lodge', 'Sunset viewpoint walk'],
      budgetEstimate: '$50',
      tips: 'Best light before dusk'
    }
  ]);

  const handleAddDay = () => {
    setItineraryDays(prev => [
      ...prev,
      {
        dayNumber: prev.length + 1,
        title: `Day ${prev.length + 1}: Highlights & Hidden Spots`,
        activities: ['Local breakfast stall', 'Scenic trail hike'],
        budgetEstimate: '$40',
        tips: 'Pack reusable water bottle'
      }
    ]);
  };

  const handleRemoveDay = (index: number) => {
    setItineraryDays(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (!title.trim() || !description.trim()) {
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, '').toLowerCase())
      .filter(Boolean);

    playHapticSound('post');

    onPostMemory({
      title: title.trim(),
      description: description.trim(),
      location: location.trim() || 'Somewhere on the road',
      country: country.trim() || 'Global',
      travelStyle,
      tags: tags.length > 0 ? tags : ['travel', 'scrapbook'],
      photoUrl,
      photoCaption: photoCaption.trim() || title.trim(),
      itinerary: showItineraryBuilder && itineraryDays.length > 0 ? itineraryDays : undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setLocation('');
    setCountry('');
    setTagsInput('');
    setPhotoCaption('');
    setShowItineraryBuilder(false);
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      theme === 'dark' 
        ? 'bg-[#212429] border-[#2E343B] text-stone-200' 
        : 'bg-white border-[#E7E2D8] text-stone-800 shadow-xs'
    }`}>
      {/* Title - Matches the star + "New memory" header in IMG_5491 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif italic text-lg font-medium flex items-center gap-2 text-current">
          <Sparkles className="w-4 h-4 text-[#FAB76D] fill-[#FAB76D]" />
          New memory
        </h3>
        {isOffline && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EF853F]/15 text-[#EF853F] font-mono">
            Offline draft
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Title input */}
        <div>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={`w-full px-3 py-2 text-xs rounded-xl border transition-all outline-hidden ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
            }`}
          />
        </div>

        {/* What happened? textarea */}
        <div>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened?"
            className={`w-full px-3 py-2 text-xs rounded-xl border transition-all outline-hidden resize-none ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
            }`}
          />
        </div>

        {/* Location & Travel Style */}
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Destination (e.g. Kyoto)"
            className={`w-full px-2.5 py-1.5 text-xs rounded-xl border transition-all outline-hidden ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
            }`}
          />
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            className={`w-full px-2.5 py-1.5 text-xs rounded-xl border appearance-none transition-all outline-hidden cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-200'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-800'
            }`}
          >
            {TRAVEL_STYLES.filter(s => s !== 'All Styles').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Tags input - Matches "Tags, comma separated" in IMG_5491 */}
        <div>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Tags, comma separated"
            className={`w-full px-3 py-2 text-xs rounded-xl border transition-all outline-hidden ${
              theme === 'dark'
                ? 'bg-[#181B1E] border-stone-700/80 focus:border-[#FAB76D] text-stone-100 placeholder-stone-500'
                : 'bg-[#FBF9F5] border-stone-300 focus:border-[#2C8287] text-stone-900 placeholder-stone-400'
            }`}
          />
        </div>

        {/* Photo Selection and Preview */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono tracking-wider uppercase text-stone-400 flex items-center justify-between">
            <span>Trip Photo</span>
            <label className="cursor-pointer text-[#EF853F] hover:underline flex items-center gap-1 font-sans text-xs">
              <ImageIcon className="w-3 h-3" />
              Upload file
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </label>

          {/* Quick preset selector */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {PRESET_PHOTOS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() => setPhotoUrl(preset.url)}
                className={`relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  photoUrl === preset.url 
                    ? 'border-[#FAB76D] ring-2 ring-[#FAB76D]/40 scale-105' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                title={preset.name}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Preview card */}
          {photoUrl && (
            <div className="relative rounded-xl overflow-hidden aspect-video border border-stone-700/50 bg-stone-900/50">
              <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Optional photo caption..."
                  className="w-full text-[11px] bg-transparent text-white placeholder-stone-300 border-none outline-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Toggle Itinerary Breakdown */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowItineraryBuilder(!showItineraryBuilder)}
            className={`w-full py-1.5 px-3 text-xs font-medium rounded-xl border flex items-center justify-between transition-colors ${
              showItineraryBuilder 
                ? 'bg-[#2C8287]/15 border-[#2C8287]/40 text-[#2C8287]'
                : theme === 'dark' ? 'bg-[#181B1E] border-stone-700 text-stone-300' : 'bg-[#FBF9F5] border-stone-200 text-stone-600'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2C8287]" />
              {showItineraryBuilder ? 'Itinerary days attached' : '+ Attach day-by-day plan'}
            </span>
            <span className="text-[10px] font-mono opacity-80">
              {showItineraryBuilder ? `${itineraryDays.length} days` : 'Optional'}
            </span>
          </button>

          {showItineraryBuilder && (
            <div className="mt-2.5 space-y-2 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-stone-700/40 text-xs">
              {itineraryDays.map((day, idx) => (
                <div key={idx} className="space-y-1.5 pb-2 border-b border-stone-200/40 dark:border-stone-700/40 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[11px]">Day {day.dayNumber}</span>
                    {itineraryDays.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(idx)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItineraryDays(prev => prev.map((d, i) => i === idx ? { ...d, title: val } : d));
                    }}
                    placeholder="Day title e.g. Coastal cliff hike"
                    className="w-full px-2 py-1 text-xs rounded bg-white/10 border border-stone-600/30 outline-hidden"
                  />
                  <input
                    type="text"
                    value={day.activities.join('; ')}
                    onChange={(e) => {
                      const acts = e.target.value.split(';').map(a => a.trim()).filter(Boolean);
                      setItineraryDays(prev => prev.map((d, i) => i === idx ? { ...d, activities: acts } : d));
                    }}
                    placeholder="Activities (separate with semicolon ; )"
                    className="w-full px-2 py-1 text-xs rounded bg-white/10 border border-stone-600/30 outline-hidden"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDay}
                className="w-full py-1 text-[11px] rounded bg-[#2C8287]/20 text-[#2C8287] hover:bg-[#2C8287]/30 transition-colors font-medium"
              >
                + Add Another Day
              </button>
            </div>
          )}
        </div>

        {/* Offline Status Reminder */}
        {isOffline && (
          <div className="p-2.5 rounded-xl bg-[#EF853F]/10 border border-[#EF853F]/30 text-[11px] text-[#EF853F] flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Posting in offline mode. Your memory will be cached and synced automatically when online.</span>
          </div>
        )}

        {/* Submit Button - Golden Amber button matching IMG_5491 */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#FAB76D] hover:bg-[#EF853F] hover:text-white text-stone-950 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          Post memory
        </button>
      </form>
    </div>
  );
};
