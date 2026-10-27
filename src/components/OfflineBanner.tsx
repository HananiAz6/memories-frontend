import React from 'react';
import { WifiOff, RefreshCw, CheckCircle, Cloud, AlertCircle } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  pendingSyncCount: number;
  onSyncNow: () => void;
  isSyncing: boolean;
  onGoOnline: () => void;
  cachedCount: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  pendingSyncCount,
  onSyncNow,
  isSyncing,
  onGoOnline,
  cachedCount,
}) => {
  if (!isOffline && pendingSyncCount === 0) return null;

  return (
    <aside aria-label="Connection Status" className="w-full bg-[#181B1E] border-b border-[#EF853F]/40 text-stone-200 text-xs px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          {isOffline ? (
            <div className="w-6 h-6 rounded-full bg-[#EF853F]/20 text-[#EF853F] flex items-center justify-center shrink-0">
              <WifiOff className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#2C8287]/20 text-[#89C9D2] flex items-center justify-center shrink-0">
              <Cloud className="w-3.5 h-3.5" />
            </div>
          )}

          <div>
            {isOffline ? (
              <span>
                <strong className="text-[#FAB76D]">Remote Explorer Mode Active</strong> — 
                Viewing {cachedCount} offline-cached trip memories & itineraries.
              </span>
            ) : (
              <span>
                <strong className="text-[#89C9D2]">Online Reconnected</strong> — 
                You have {pendingSyncCount} offline changes ready to upload.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {pendingSyncCount > 0 && !isOffline && (
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAB76D] text-stone-950 font-semibold text-xs hover:bg-[#EF853F] hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : `Sync ${pendingSyncCount} Changes`}</span>
            </button>
          )}

          {isOffline && (
            <button
              onClick={onGoOnline}
              className="text-xs text-[#FAB76D] hover:underline font-mono"
            >
              Switch back to Online →
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
