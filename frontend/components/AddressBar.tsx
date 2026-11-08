'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, User as UserIcon } from 'lucide-react';

export type User = {
  _id: string;
  username: string;
  name?: string;
};

interface AddressBarProps {
  currentAddress: string;
  onNavigate: (address: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  users: User[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  onOpenSearch: () => void;
}

export default function AddressBar({
  currentAddress,
  onNavigate,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onRefresh,
  users,
  selectedUserId,
  onSelectUser,
  onOpenSearch,
}: AddressBarProps) {
  const [inputAddress, setInputAddress] = useState(currentAddress);

  useEffect(() => {
    setInputAddress(currentAddress);
  }, [currentAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAddress.trim()) {
      onNavigate(inputAddress.trim());
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          title="Back"
          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          title="Forward"
          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onRefresh}
          title="Refresh"
          className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder="Enter address (e.g., tidepool.zz)..."
            className="w-full px-4 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
          />
        </div>
      </form>

      {/* Global Search Button Trigger */}
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
      </button>

      {/* User Switcher Dropdown */}
      <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
        <UserIcon className="h-4 w-4 text-zinc-400" />
        <select
          value={selectedUserId}
          onChange={(e) => onSelectUser(e.target.value)}
          className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name || user.username}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}