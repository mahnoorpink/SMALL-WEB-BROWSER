'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Globe } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type SearchResult = {
  _id: string;
  address: string;
  title: string;
  bodyHtml: string;
};

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSite: (address: string) => void;
}

export default function SearchBar({ isOpen, onClose, onSelectSite }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      apiFetch<SearchResult[]>(`/sites/search?q=${encodeURIComponent(query)}`)
        .then((data) => setResults(data))
        .catch((err) => console.error('Search error:', err))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all sites by title or content..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading && (
            <div className="p-4 text-center text-xs text-zinc-400">Searching...</div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-6 text-center text-xs text-zinc-500">
              No matching sites found for &quot;{query}&quot;.
            </div>
          )}

          {results.map((site) => (
            <button
              key={site._id}
              onClick={() => onSelectSite(site.address)}
              className="w-full text-left p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors flex flex-col gap-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-500">
                  {site.title}
                </span>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {site.address}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {site.bodyHtml.replace(/<[^>]*>/g, '')}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}