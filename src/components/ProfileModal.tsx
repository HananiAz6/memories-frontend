import React, { useState } from 'react';
import { User, TravelMemory } from '../types/travel';
import { X, Edit2, MapPin, Compass, Camera, Heart, Globe, Calendar, LogOut, Check, CloudOff } from 'lucide-react';
import { TRAVEL_STYLES } from '../data/initialData';
import { playHapticSound } from '../utils/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  theme: 'dark' | 'light';
  userMemories: TravelMemory[];
  savedMemories: TravelMemory[];
  pendingSyncCount: number;
  onSelectMemory: (memory: TravelMemory) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  theme,
  userMemories,
  savedMemories,
  pendingSyncCount,
  onSelectMemory,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'memories' | 'saved' | 'sync'>('memories');

  // Edit fields
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [homeBase, setHomeBase] = useState(currentUser?.homeBase || '');
  const [travelStyle, setTravelStyle] = useState(currentUser?.travelStyle || 'Slow Travel');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  if (!isOpen || !currentUser) return null;

  const totalLikesReceived = userMemories.reduce((acc, m) => acc + m.likes.length, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound('post');
    const updated: User = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      bio: bio.trim(),
      homeBase: homeBase.trim(),
      travelStyle,
      avatar: avatar.trim() || currentUser.avatar,
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          theme === 'dark'
            ? 'bg-[#1C1F23] border-[#2E343B] text-stone-100'
            : 'bg-white border-[#E6E0D5] text-stone-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-current transition-colors"
          aria-label="Close profile modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#FAB76D] ring-4 ring-[#FAB76D]/20 shadow-md">
                <img
                  src={isEditing ? avatar : currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#FAB76D] text-stone-950 cursor-pointer shadow hover:bg-[#EF853F] hover:text-white transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                  {currentUser.name}
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setName(currentUser.name);
                      setBio(currentUser.bio);
                      setHomeBase(currentUser.homeBase);
                      setTravelStyle(currentUser.travelStyle);
                      setAvatar(currentUser.avatar);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-600/50 hover:border-[#FAB76D] transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-[#FAB76D]" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-500 text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <>
                  <p className="mt-1 text-xs text-stone-400 flex items-center justify-center sm:justify-start gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-[#2C8287]" />
                    <span>{currentUser.homeBase || 'Global Nomad'}</span>
                    <span>·</span>
                    <span className="text-[#EF853F]">{currentUser.travelStyle}</span>
                  </p>
                  <p className="mt-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg">
                    {currentUser.bio || 'Explorer sharing quiet moments and road trip itineraries.'}
                  </p>
                </>
              ) : null}
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-stone-700 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 mb-1">Home Base</label>
                  <input
                    type="text"
                    value={homeBase}
                    onChange={(e) => setHomeBase(e.target.value)}
                    placeholder="e.g. Lisbon & Cape Town"
                    className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-stone-700 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">Travel Style</label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-stone-700 outline-hidden"
                >
                  {TRAVEL_STYLES.filter(s => s !== 'All Styles').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-400 mb-1">Bio / Explorer Statement</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-stone-700 outline-hidden resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#FAB76D] hover:bg-[#EF853F] hover:text-white text-stone-950 transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Quantitative Explorer Stats (Adhering to anti-slop rules: real contextual numbers) */}
          <div className="mt-6 grid grid-cols-4 gap-2 p-3 sm:p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-stone-200/50 dark:border-stone-800 text-center font-mono">
            <div>
              <div className="text-base sm:text-xl font-bold text-current">{userMemories.length}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Memories</div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-bold text-[#FAB76D]">{currentUser.countriesVisited}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Countries</div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-bold text-[#EF853F]">{totalLikesReceived}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Likes</div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-bold text-[#2C8287] dark:text-[#89C9D2]">{savedMemories.length}</div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Saved</div>
            </div>
          </div>

          {/* Explorer Content Tabs */}
          <div className="mt-6 border-b border-stone-200/60 dark:border-stone-800 flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveTab('memories')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'memories'
                  ? 'border-[#FAB76D] text-[#FAB76D] font-semibold'
                  : 'border-transparent text-stone-400 hover:text-current'
              }`}
            >
              My Memories ({userMemories.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2.5 transition-colors border-b-2 ${
                activeTab === 'saved'
                  ? 'border-[#FAB76D] text-[#FAB76D] font-semibold'
                  : 'border-transparent text-stone-400 hover:text-current'
              }`}
            >
              Saved Offline ({savedMemories.length})
            </button>
            {pendingSyncCount > 0 && (
              <button
                onClick={() => setActiveTab('sync')}
                className={`pb-2.5 transition-colors border-b-2 ${
                  activeTab === 'sync'
                    ? 'border-[#EF853F] text-[#EF853F] font-semibold'
                    : 'border-transparent text-stone-400 hover:text-current'
                }`}
              >
                Queued Syncs ({pendingSyncCount})
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="mt-4 max-h-60 overflow-y-auto pr-1">
            {activeTab === 'memories' && (
              userMemories.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">You haven't posted any memories yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {userMemories.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        onClose();
                        onSelectMemory(m);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer text-xs"
                    >
                      <img src={m.photoUrl} alt={m.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{m.title}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{m.location} · {m.createdAt}</div>
                      </div>
                      <div className="text-[11px] font-mono text-[#EF853F] flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-current" />
                        {m.likes.length}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'saved' && (
              savedMemories.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-6">No offline saved itineraries yet. Bookmark trips to store them for offline use.</p>
              ) : (
                <div className="space-y-2.5">
                  {savedMemories.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        onClose();
                        onSelectMemory(m);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer text-xs"
                    >
                      <img src={m.photoUrl} alt={m.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{m.title}</div>
                        <div className="text-[11px] text-stone-400 font-mono">By {m.author.name} · {m.location}</div>
                      </div>
                      {m.itinerary && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#2C8287]/20 text-[#2C8287] font-mono">
                          {m.itinerary.length} Days
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'sync' && (
              <div className="p-4 rounded-xl bg-[#EF853F]/10 border border-[#EF853F]/30 text-xs text-[#EF853F]">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <CloudOff className="w-4 h-4" />
                  {pendingSyncCount} Action(s) stored locally
                </div>
                <p className="text-[11px] text-stone-300">
                  You created memories or comments while in remote offline mode. They are safely cached on this device and will automatically upload once online.
                </p>
              </div>
            )}
          </div>

          {/* Footer & Logout */}
          <div className="mt-6 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-stone-400">
              Explorer ID: {currentUser.id}
            </span>
            <button
              onClick={() => {
                playHapticSound('toggle');
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
