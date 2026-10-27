import React, { useState } from 'react';
import { User, NotificationItem } from '../types/travel';
import { Sun, Moon, Bell, Wifi, WifiOff, Compass, Bookmark, PlusCircle } from 'lucide-react';
import { playHapticSound } from '../utils/storage';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenNewMemory: () => void;
  onSelectView: (view: 'feed' | 'itineraries' | 'saved') => void;
  activeView: 'feed' | 'itineraries' | 'saved';
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  isOffline,
  onToggleOffline,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenNewMemory,
  onSelectView,
  activeView,
  notifications,
  onOpenNotifications,
  pendingSyncCount,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`sticky top-0 z-40 transition-colors border-b ${
      theme === 'dark' 
        ? 'bg-[#181B1E]/95 border-[#2A2F35] text-stone-100' 
        : 'bg-[#F9F7F2]/95 border-[#E6E0D5] text-stone-900'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single element brand mark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectView('feed')} 
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAB76D] text-[#181B1E] shadow-sm">
              <Compass className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-current">
              Memories
            </span>
          </button>

          {isOffline && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#EF853F]/15 text-[#EF853F] border border-[#EF853F]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF853F] animate-pulse"></span>
              Remote Offline
            </span>
          )}

          {pendingSyncCount > 0 && !isOffline && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#2C8287]/15 text-[#2C8287] border border-[#2C8287]/30">
              {pendingSyncCount} to sync
            </span>
          )}
        </div>

        {/* Zone 2: Navigation Links (Text with hover states) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectView('feed')}
            className={`transition-colors hover:text-[#EF853F] ${
              activeView === 'feed'
                ? 'text-[#EF853F] font-semibold border-b-2 border-[#EF853F] pb-1'
                : theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Recent Memories
          </button>

          <button
            onClick={() => onSelectView('itineraries')}
            className={`transition-colors hover:text-[#EF853F] ${
              activeView === 'itineraries'
                ? 'text-[#EF853F] font-semibold border-b-2 border-[#EF853F] pb-1'
                : theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            Trip Itineraries
          </button>

          <button
            onClick={() => onSelectView('saved')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#EF853F] ${
              activeView === 'saved'
                ? 'text-[#EF853F] font-semibold border-b-2 border-[#EF853F] pb-1'
                : theme === 'dark' ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Offline</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Quick Post Button for mobile/compact view */}
          <button
            onClick={() => {
              playHapticSound('toggle');
              onOpenNewMemory();
            }}
            className="md:hidden flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAB76D] text-stone-950 hover:bg-[#EF853F] hover:text-white transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>

          {/* Offline / Online Remote Mode Simulator */}
          <button
            onClick={() => {
              playHapticSound('toggle');
              onToggleOffline();
            }}
            title={isOffline ? "You are in remote offline mode (Click to go online)" : "Simulate remote location (Click to test offline access)"}
            className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isOffline
                ? 'bg-[#EF853F]/20 text-[#EF853F] border border-[#EF853F]/40'
                : theme === 'dark'
                ? 'bg-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-700'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-[#2C8287]" />}
            <span className="hidden lg:inline text-[11px] font-sans">
              {isOffline ? 'Offline Mode' : 'Online'}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              playHapticSound('toggle');
              onToggleTheme();
            }}
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-700' 
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FAB76D]" />
            ) : (
              <Moon className="w-4 h-4 text-[#2C8287]" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => {
              playHapticSound('notification');
              onOpenNotifications();
            }}
            className={`relative p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-700' 
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF853F] text-white text-[10px] font-bold flex items-center justify-center shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Account / Profile Badge (Matches Walter Motsi pill in IMG_5491) */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border transition-all ${
                  theme === 'dark'
                    ? 'border-stone-700 hover:border-[#FAB76D] bg-stone-800/80 text-stone-200'
                    : 'border-stone-300 hover:border-[#2C8287] bg-white text-stone-800'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-[#FAB76D] text-stone-900 font-bold text-xs flex items-center justify-center uppercase overflow-hidden ring-1 ring-white/30">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <span className="text-xs font-medium max-w-[90px] sm:max-w-[120px] truncate">
                  {currentUser.name}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#FAB76D] text-stone-950 hover:bg-[#EF853F] hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
