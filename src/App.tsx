import React, { useState, useEffect, useMemo } from 'react';
import { TravelMemory, User, NotificationItem } from './types/travel';
import {
  saveStoredUser,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredBookmarks,
  toggleStoredBookmark,
  getOfflineQueue,
  addToOfflineQueue,
  clearOfflineQueue,
  getStoredTheme,
  saveStoredTheme,
  playHapticSound,
} from './utils/storage';
import { DEMO_EXPLORERS } from './data/initialData';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchAndFilter } from './components/SearchAndFilter';
import { NewMemorySidebar } from './components/NewMemorySidebar';
import { MemoryCard } from './components/MemoryCard';
import { MemoryDetailModal } from './components/MemoryDetailModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationDropdown } from './components/NotificationDropdown';
import { OfflineBanner } from './components/OfflineBanner';
import { api, getToken, setToken, toUser } from './utils/api';
import { Sparkles, Compass, AlertCircle, CheckCircle, Users } from 'lucide-react';


export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [memories, setMemories] = useState<TravelMemory[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(getOfflineQueue());
  const [isSyncing, setIsSyncing] = useState(false);
  const [authLoading, setAuthLoading] = useState(!!getToken());

  // Active view & filters
  const [activeView, setActiveView] = useState<'feed' | 'itineraries' | 'saved'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All Styles');

  // Modals & Panels
  const [selectedMemory, setSelectedMemory] = useState<TravelMemory | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileNewMemoryOpen, setIsMobileNewMemoryOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'info' | 'success' | 'alert' } | null>(null);

  // Helper to normalize Mongo _id with frontend id
  const mapMongoMemory = (doc: any): TravelMemory => ({
    id: doc._id || doc.id,
    title: doc.title,
    description: doc.description || '',
    photoUrl: doc.photoData || doc.photoUrl || '',
    photoCaption: doc.photoCaption,
    location: doc.location || 'Unknown Road',
    country: doc.country || 'Global',
    travelStyle: doc.travelStyle || 'Slow Travel',
    tags: doc.tags || [],
    author: {
      id: doc.uploaderId || 'anon',
      name: doc.uploadedBy || 'Anonymous',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Just now',
    likes: doc.likedBy || [],
    sharedWith: doc.sharedWith || [],
    comments: (doc.comments || []).map((c: any) => ({
      id: c._id || c.id || `c_${Date.now()}`,
      author: c.author || { name: c.username || 'Explorer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
      text: c.text,
      createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now',
    })),
    itinerary: doc.itinerary,
  });

  // Fetch initial data from Express API
  const loadPhotos = () =>
  api<any[]>('/photos')
    .then((data) => setMemories(data.map(mapMongoMemory)))
    .catch((err) => console.error('Failed to load photos:', err));

  useEffect(() => {
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    setBookmarks(getStoredBookmarks());
    setNotifications(getStoredNotifications());
    setOfflineQueue(getOfflineQueue());

    // Restore session from saved token
    if (getToken()) {
      api('/auth/me')
        .then((u) => { setCurrentUser(toUser(u)); return loadPhotos(); })
        .catch(() => setToken(null))
        .finally(() => setAuthLoading(false));
    }

    const handleExpired = () => { setCurrentUser(null); setMemories([]); };
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Online connection restored', 'You can now synchronize any offline-saved drafts.', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('Remote offline mode active', 'All cached memories and itineraries are accessible offline.', 'alert');
    };

    window.addEventListener('auth-expired', handleExpired);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('auth-expired', handleExpired);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (title: string, desc: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.title === title ? null : prev));
    }, 4500);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveStoredTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle Offline Simulator
  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    if (next) {
      showToast('Switched to Remote Mode', 'Simulating offline experience in remote mountains or deserts.', 'alert');
    } else {
      showToast('Reconnected to Network', 'Back online. Ready to sync with fellow explorers.', 'success');
    }
  };

  // Handle Likes via API
  const handleLike = async (memoryId: string) => {
    try {
      const updatedDoc = await api(`/photos/${memoryId}/like`, { method: 'POST' });
      const formatted = mapMongoMemory(updatedDoc);

      setMemories((prev) => prev.map((m) => (m.id === memoryId ? formatted : m)));

      if (selectedMemory && selectedMemory.id === memoryId) {
        setSelectedMemory(formatted);
      }
    } catch (err: any) {
      console.error('Error liking photo:', err);
    }
  };

  // Handle Bookmarks (Offline saving)
  const handleToggleBookmark = (memoryId: string) => {
    const updated = toggleStoredBookmark(memoryId);
    setBookmarks(updated);
    const isNowBookmarked = updated.includes(memoryId);
    if (isNowBookmarked) {
      showToast('Saved for Offline Access', 'Itinerary and photos cached for remote travel without network.', 'success');
    } else {
      showToast('Removed from Saved', 'Memory removed from offline collection.');
    }
  };

  // Handle Post Memory via API
  const handlePostMemory = async (memoryData: Partial<TravelMemory>) => {
    if (!currentUser) return;

    const payload = {
      title: memoryData.title || 'Untitled Memory',
      description: memoryData.description || '',
      photoData: memoryData.photoUrl || '',
      uploadedBy: currentUser.name,
      tags: memoryData.tags || ['travel'],
      location: memoryData.location || 'Unknown Road',
      country: memoryData.country || 'Global',
      travelStyle: memoryData.travelStyle || 'Slow Travel',
    };

    if (isOffline) {
      addToOfflineQueue({
        id: `queue_${Date.now()}`,
        type: 'post_memory',
        payload,
        timestamp: Date.now(),
      });
      setOfflineQueue(getOfflineQueue());
      showToast('Saved in Offline Drafts', 'Memory saved to device. Will upload once connected.', 'alert');
      if (isMobileNewMemoryOpen) setIsMobileNewMemoryOpen(false);
      return;
    }

    try {
      const savedDoc = await api('/photos', { method: 'POST', body: JSON.stringify(payload) });
      const newMemory = mapMongoMemory(savedDoc);

      setMemories((prev) => [newMemory, ...prev]);
      showToast('Memory Pinned to Scrapbook', 'Fellow explorers can now discover your journey.', 'success');
    } catch (err: any) {
      console.error('Error posting memory:', err);
      showToast('Upload failed', err.message, 'alert');
    }

    if (isMobileNewMemoryOpen) {
      setIsMobileNewMemoryOpen(false);
    }
  };
  // Handle Add Comment via API
  const handleAddComment = async (memoryId: string, text: string) => {
    try {
      const updatedDoc = await api(`/photos/${memoryId}/comment`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      const formatted = mapMongoMemory(updatedDoc);

      setMemories((prev) => prev.map((m) => (m.id === memoryId ? formatted : m)));

      if (selectedMemory && selectedMemory.id === memoryId) {
        setSelectedMemory(formatted);
      }
    } catch (err: any) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLogin = (user: User) => {
  setCurrentUser(user);
  loadPhotos();
  showToast(`Welcome, ${user.name}!`, 'You are signed in.', 'success');
  };

  const handleShare = async (memoryId: string, userIds: string[]) => {
    const updated = await api(`/photos/${memoryId}/share`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
    const formatted = mapMongoMemory(updated);
    setMemories((prev) => prev.map((m) => (m.id === memoryId ? formatted : m)));
    setSelectedMemory(formatted);
    showToast('Photo shared', `Shared with ${userIds.length} friend(s).`, 'success');
  };

  // Sync Offline Queue
  const handleSyncNow = () => {
    setIsSyncing(true);
    playHapticSound('post');

    setTimeout(() => {
      const count = offlineQueue.length;
      clearOfflineQueue();
      setOfflineQueue([]);
      setIsSyncing(false);

      showToast('Offline Queue Synchronized', `Successfully synced ${count} item(s) to the community log.`, 'success');
    }, 1200);
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // Simulate real-time activity
  const handleSimulateActivity = () => {
    const randomExplorer = DEMO_EXPLORERS[Math.floor(Math.random() * (DEMO_EXPLORERS.length - 1)) + 1];
    const targetMemory = memories[0];
    if (!targetMemory) return;

    playHapticSound('notification');

    const newNotif: NotificationItem = {
      id: `sim_${Date.now()}`,
      type: 'like',
      actor: {
        name: randomExplorer.name,
        avatar: randomExplorer.avatar,
      },
      memoryId: targetMemory.id,
      memoryTitle: targetMemory.title,
      message: `hearted your travel story "${targetMemory.title}"`,
      createdAt: 'Just now',
      read: false,
    };

    const next = [newNotif, ...notifications];
    setNotifications(next);
    saveStoredNotifications(next);

    showToast(`New Interaction from ${randomExplorer.name}`, newNotif.message, 'info');
  };

  // Filter logic
  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      if (activeView === 'itineraries' && (!m.itinerary || m.itinerary.length === 0)) {
        return false;
      }
      if (activeView === 'saved' && !bookmarks.includes(m.id)) {
        return false;
      }
      if (selectedStyle !== 'All Styles' && m.travelStyle !== selectedStyle) {
        return false;
      }
      if (
        selectedDestination &&
        !m.location.toLowerCase().includes(selectedDestination.toLowerCase()) &&
        !m.country.toLowerCase().includes(selectedDestination.toLowerCase())
      ) {
        return false;
      }
      if (selectedTag && !m.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDesc = m.description.toLowerCase().includes(q);
        const matchesLoc = m.location.toLowerCase().includes(q);
        const matchesCountry = m.country.toLowerCase().includes(q);
        const matchesAuthor = m.author.name.toLowerCase().includes(q);
        const matchesTag = m.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesCountry && !matchesAuthor && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [memories, activeView, bookmarks, selectedStyle, selectedDestination, selectedTag, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery || selectedTag || selectedDestination || selectedStyle !== 'All Styles');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedDestination('');
    setSelectedStyle('All Styles');
  };

  const userMemories = currentUser ? memories.filter((m) => m.author.name === currentUser.name) : [];
  const savedMemories = memories.filter((m) => bookmarks.includes(m.id));

 if (authLoading) {
  return (
    <div className={`min-h-screen flex items-center justify-center text-sm ${theme === 'dark' ? 'bg-[#181B1E] text-stone-300' : 'bg-[#F9F7F2] text-stone-700'}`}>
      Waking up the server… the first visit can take up to a minute.
    </div>
  );
}

if (!currentUser) {
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#181B1E]' : 'bg-[#F9F7F2]'}`}>
      <AuthModal isOpen theme={theme} onLogin={handleLogin} />
    </div>
  );
}
  return (
    <div
      className={`min-h-screen font-sans selection:bg-[#FAB76D] selection:text-stone-900 transition-colors ${
        theme === 'dark' ? 'bg-[#181B1E] text-stone-100' : 'bg-[#F9F7F2] text-stone-900'
      }`}
    >
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenNewMemory={() => setIsMobileNewMemoryOpen(true)}
        onSelectView={setActiveView}
        activeView={activeView}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        pendingSyncCount={offlineQueue.length}
      />

      <OfflineBanner
        isOffline={isOffline}
        pendingSyncCount={offlineQueue.length}
        onSyncNow={handleSyncNow}
        isSyncing={isSyncing}
        onGoOnline={() => setIsOffline(false)}
        cachedCount={memories.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <HeroSection
          theme={theme}
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
          totalMemoriesCount={memories.length}
          isOffline={isOffline}
        />

        {activeView !== 'feed' && (
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#EF853F]">
              <Compass className="w-4 h-4" />
              <span>{activeView === 'itineraries' ? 'Filtered by Field Itineraries' : 'Offline Saved Travel Guides'}</span>
            </div>
            <button onClick={() => setActiveView('feed')} className="text-xs text-stone-400 hover:text-current underline">
              Show all memories
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {filteredMemories.length === 0 ? (
              <div
                className={`p-12 text-center rounded-3xl border ${
                  theme === 'dark' ? 'bg-[#212429] border-[#2E343B]' : 'bg-white border-[#E8E2D8]'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-[#FAB76D]/20 text-[#FAB76D] mb-3">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-1">No matching memories found</h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
                  Try adjusting your search filters or pin a new memory to the scrapbook.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#FAB76D] text-stone-950 hover:bg-[#EF853F] hover:text-white transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    theme={theme}
                    currentUser={currentUser}
                    onLike={handleLike}
                    onSelect={setSelectedMemory}
                    isBookmarked={bookmarks.includes(memory.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <SearchAndFilter
              theme={theme}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              selectedDestination={selectedDestination}
              onDestinationChange={setSelectedDestination}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <NewMemorySidebar
              theme={theme}
              currentUser={currentUser}
              onPostMemory={handlePostMemory}
              isOffline={isOffline}
              onRequireAuth={() => setIsAuthOpen(true)}
            />

            <div
              className={`p-4 rounded-2xl border text-xs ${
                theme === 'dark' ? 'bg-[#212429] border-[#2E343B]' : 'bg-white border-[#E8E2D8]'
              }`}
            >
              <div className="flex items-center justify-between mb-3 text-stone-400 font-mono uppercase tracking-wider text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#2C8287]" />
                  Fellow Explorers
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>

              <div className="space-y-2">
                {DEMO_EXPLORERS.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={exp.avatar}
                        alt={exp.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="font-semibold text-current truncate">{exp.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{exp.travelStyle}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0">{exp.totalTrips} trips</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MemoryDetailModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        theme={theme}
        currentUser={currentUser}
        onLike={handleLike}
        onAddComment={handleAddComment}
        isBookmarked={selectedMemory ? bookmarks.includes(selectedMemory.id) : false}
        onToggleBookmark={handleToggleBookmark}
        isOffline={isOffline}
        onRequireAuth={() => setIsAuthOpen(true)}
        onShare={handleShare}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          saveStoredUser(updated);
          showToast('Profile Updated', 'Your explorer profile has been refreshed.', 'success');
        }}
        onLogout={() => { setToken(null); setCurrentUser(null); setMemories([]); setIsProfileOpen(false); }}
        theme={theme}
        userMemories={userMemories}
        savedMemories={savedMemories}
        pendingSyncCount={offlineQueue.length}
        onSelectMemory={setSelectedMemory}
        
      />

      <NotificationDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={(memId) => {
          const m = memories.find((x) => x.id === memId);
          if (m) setSelectedMemory(m);
        }}
        theme={theme}
        onSimulateActivity={handleSimulateActivity}
      />

      {isMobileNewMemoryOpen && (
        <div className="fixed inset-0 z-50 p-4 bg-black/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-lg relative my-auto">
            <button
              onClick={() => setIsMobileNewMemoryOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-stone-800 text-white shadow-lg"
            >
              ✕
            </button>
            <NewMemorySidebar
              theme={theme}
              currentUser={currentUser}
              onPostMemory={handlePostMemory}
              isOffline={isOffline}
              onRequireAuth={() => {
                setIsMobileNewMemoryOpen(false);
                setIsAuthOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 bg-[#1C1F23]/95 text-stone-100 border-stone-700">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {toastMessage.type === 'alert' && <AlertCircle className="w-4 h-4 text-[#EF853F]" />}
              {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-[#FAB76D]" />}
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold text-white">{toastMessage.title}</p>
              <p className="mt-0.5 text-stone-300 leading-relaxed text-[11px]">{toastMessage.desc}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white text-xs">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}