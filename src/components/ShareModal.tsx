import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { api } from '../utils/api';

interface Friend { id: string; name: string; email: string; avatar?: string }

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  alreadySharedWith: string[];
  onShare: (userIds: string[]) => Promise<void>;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, theme, alreadySharedWith, onShare }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setSelected([]);
    setError('');
    api<Friend[]>('/users').then(setFriends).catch((e) => setError(e.message));
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await onShare(selected);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70">
      <div
        className={`relative w-full max-w-sm p-5 rounded-2xl border shadow-2xl ${
          theme === 'dark' ? 'bg-[#1C1F23] border-[#2E343B] text-stone-100' : 'bg-white border-[#E6E0D5] text-stone-900'
        }`}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-stone-400 hover:text-current" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-serif text-lg font-medium mb-1">Share with friends</h3>
        <p className="text-xs text-stone-400 mb-3">They'll see this photo in their feed and can like and comment.</p>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {friends.length === 0 && !error && (
            <p className="text-xs text-stone-400 py-4 text-center">No other users yet. Ask your friends to sign up.</p>
          )}
          {friends.map((f) => {
            const done = alreadySharedWith.includes(f.id);
            return (
              <label
                key={f.id}
                className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                  done ? 'opacity-50' : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span className="font-medium">{f.name}</span>
                {done ? (
                  <span className="text-[10px] font-mono text-emerald-400">Shared</span>
                ) : (
                  <input type="checkbox" checked={selected.includes(f.id)} onChange={() => toggle(f.id)} />
                )}
              </label>
            );
          })}
        </div>

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        <button
          onClick={submit}
          disabled={loading || selected.length === 0}
          className="mt-4 w-full py-2 text-xs font-semibold rounded-xl bg-[#FAB76D] hover:bg-[#EF853F] hover:text-white text-stone-950 flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          {loading ? 'Sharing…' : `Share with ${selected.length || ''} friend${selected.length === 1 ? '' : 's'}`}
        </button>
      </div>
    </div>
  );
};