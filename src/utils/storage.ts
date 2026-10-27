import { TravelMemory, User, NotificationItem, Comment } from '../types/travel';
import { INITIAL_MEMORIES, CURRENT_USER, INITIAL_NOTIFICATIONS } from '../data/initialData';

const MEMORIES_KEY = 'memories_scrapbook_data_v1';
const USER_KEY = 'memories_current_user_v1';
const NOTIFICATIONS_KEY = 'memories_notifications_v1';
const OFFLINE_QUEUE_KEY = 'memories_offline_queue_v1';
const THEME_KEY = 'memories_theme_v1';
const BOOKMARKS_KEY = 'memories_saved_itineraries_v1';

// Play tactile sound effects with Web Audio API (zero external assets needed)
export function playHapticSound(type: 'like' | 'post' | 'notification' | 'toggle') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'like') {
      // Soft gentle high pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'post') {
      // Camera shutter click feel
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'notification') {
      // Gentle chime bell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'toggle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Ignore audio permission or context restrictions
  }
}

// Memories management
export function getStoredMemories(): TravelMemory[] {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (!raw) {
      localStorage.setItem(MEMORIES_KEY, JSON.stringify(INITIAL_MEMORIES));
      return INITIAL_MEMORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEMORIES;
  }
}

export function saveStoredMemories(memories: TravelMemory[]): void {
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to localStorage:', err);
  }
}

// User management
export function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      localStorage.setItem(USER_KEY, JSON.stringify(CURRENT_USER));
      return CURRENT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return CURRENT_USER;
  }
}

export function saveStoredUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save user:', err);
  }
}

// Notifications management
export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: NotificationItem[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
}

// Bookmarks management
export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : ['mem_1', 'mem_4'];
  } catch {
    return ['mem_1', 'mem_4'];
  }
}

export function toggleStoredBookmark(memoryId: string): string[] {
  const current = getStoredBookmarks();
  const exists = current.includes(memoryId);
  const updated = exists ? current.filter(id => id !== memoryId) : [...current, memoryId];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  return updated;
}

// Offline queue management
export interface OfflineQueueItem {
  id: string;
  type: 'post_memory' | 'post_comment' | 'toggle_like';
  payload: any;
  timestamp: number;
}

export function getOfflineQueue(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(item: OfflineQueueItem): void {
  try {
    const queue = getOfflineQueue();
    queue.push(item);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Error adding to offline queue:', err);
  }
}

export function clearOfflineQueue(): void {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch (err) {
    console.error(err);
  }
}

// Theme storage
export function getStoredTheme(): 'dark' | 'light' {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function saveStoredTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error(err);
  }
}
