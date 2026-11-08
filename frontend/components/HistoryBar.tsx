'use client';

import React from 'react';
import { History, ExternalLink } from 'lucide-react';

export type HistoryEntry = {
  _id: string;
  address: string;
  entryType: 'TYPED' | 'LINK' | 'JUMP' | 'BACK_FORWARD';
  createdAt: string;
};

interface HistoryBarProps {
  history: HistoryEntry[];
  onLinkClick: (address: string) => void;
}

export default function HistoryBar({ history, onLinkClick }: HistoryBarProps) {
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'TYPED':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'LINK':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'JUMP':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'BACK_FORWARD':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800">
        <History className="h-4 w-4 text-zinc-500" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Browsing History</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {history.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-6">No visit history recorded yet.</p>
        ) : (
          history.map((entry) => (
            <div
              key={entry._id}
              onClick={() => onLinkClick(entry.address)}
              className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-blue-500">
                  {entry.address}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {new Date(entry.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border rounded-md font-medium ${getBadgeColor(
                    entry.entryType
                  )}`}
                >
                  {entry.entryType}
                </span>
                <ExternalLink className="h-3 w-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}