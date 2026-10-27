import React from 'react';
import { NotificationItem, TravelMemory } from '../types/travel';
import { X, Heart, MessageSquare, Compass, CheckCheck, Sparkles } from 'lucide-react';
import { playHapticSound } from '../utils/storage';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (memoryId: string) => void;
  theme: 'dark' | 'light';
  onSimulateActivity: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification,
  theme,
  onSimulateActivity,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:absolute sm:top-16 sm:right-6 sm:w-96 z-50 animate-in fade-in duration-150">
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 sm:hidden"
        onClick={onClose}
      />

      <div className={`relative m-4 sm:m-0 rounded-2xl border shadow-xl overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-[#1C1F23] border-[#2E343B] text-stone-100'
          : 'bg-white border-[#E6E0D5] text-stone-900'
      }`}>
        
        {/* Dropdown Header */}
        <div className="p-4 border-b border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-bold">Community Alerts</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF853F] text-white">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] text-[#2C8287] dark:text-[#89C9D2] hover:underline flex items-center gap-1 font-mono"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-stone-400 hover:text-current sm:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-200/40 dark:divide-stone-800/60">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-stone-400 text-xs">
              No notifications yet. When fellow explorers like or comment on your memories, they will appear here.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onSelectNotification(notif.memoryId);
                  onClose();
                }}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  !notif.read
                    ? theme === 'dark' ? 'bg-[#252930]' : 'bg-[#FDF9F3]'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={notif.actor.avatar}
                    alt={notif.actor.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-white dark:bg-stone-900 shadow">
                    {notif.type === 'like' && <Heart className="w-2.5 h-2.5 text-[#EF853F] fill-current" />}
                    {notif.type === 'comment' && <MessageSquare className="w-2.5 h-2.5 text-[#2C8287]" />}
                    {notif.type === 'new_trip' && <Compass className="w-2.5 h-2.5 text-[#FAB76D]" />}
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <p className="leading-snug">
                    <span className="font-semibold text-current">{notif.actor.name} </span>
                    <span className={theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}>
                      {notif.message}
                    </span>
                  </p>
                  <p className="mt-1 text-[10px] font-mono text-stone-400">
                    {notif.createdAt}
                  </p>
                </div>

                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#EF853F] shrink-0 mt-1" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Interactive Simulation Action */}
        <div className="p-3 bg-black/5 dark:bg-white/5 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-mono">Live Explorer Network</span>
          <button
            onClick={() => {
              playHapticSound('notification');
              onSimulateActivity();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#FAB76D] hover:bg-[#EF853F] hover:text-white text-stone-950 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Simulate Explorer Interaction
          </button>
        </div>

      </div>
    </div>
  );
};
