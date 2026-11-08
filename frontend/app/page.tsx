'use client';

import React, { useState, useEffect, useRef } from 'react';
import AddressBar, { type User } from '@/components/AddressBar';
import ContentViewer from '@/components/ContentViewer';
import HistoryBar, { type HistoryEntry } from '@/components/HistoryBar';
import SiteForm from '@/components/SiteForm';
import SearchBar from '@/components/SearchBar';
import { apiFetch } from '@/lib/api';

type Site = {
  _id: string;
  title: string;
  address: string;
  bodyHtml: string;
  authorId: string;
};

type HistoryItem = {
  address: string;
  siteData: Site | null;
  scrollPosition: number;
  is404?: boolean;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Browser Navigation Stack & Active Domain State
  const [currentAddress, setCurrentAddress] = useState<string>('tidepool.zz');
  const [historyStack, setHistoryStack] = useState<HistoryItem[]>([]);
  const [stackIndex, setStackIndex] = useState<number>(0);

  // Active Site Data & Loading States
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [is404, setIs404] = useState<boolean>(false);

  // User History & Modal UI Toggles
  const [userHistory, setUserHistory] = useState<HistoryEntry[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const contentViewerRef = useRef<HTMLDivElement>(null);

  // Load Users on Initial Mount & Set Default Active User
  useEffect(() => {
    apiFetch<User[]>('/users')
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          const alice = data.find((u) => u.username === 'alice');
          setSelectedUserId(alice ? alice._id : data[0]._id);
        }
      })
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  // Load / Restore SessionStorage History for Active User
  useEffect(() => {
    if (!selectedUserId) return;

    const savedStack = sessionStorage.getItem(`stack_${selectedUserId}`);
    const savedIndex = sessionStorage.getItem(`index_${selectedUserId}`);

    if (savedStack && savedIndex) {
      try {
        const parsedStack: HistoryItem[] = JSON.parse(savedStack);
        const parsedIndex = Number(savedIndex);

        setHistoryStack(parsedStack);
        setStackIndex(parsedIndex);

        if (parsedStack[parsedIndex]) {
          const currentItem = parsedStack[parsedIndex];
          setCurrentAddress(currentItem.address);
          setCurrentSite(currentItem.siteData);
          setIs404(!!currentItem.is404);
          return;
        }
      } catch (err) {
        console.error('Failed to parse saved session stack:', err);
      }
    }

    // Default initial stack
    fetchAndPushInitialSite('tidepool.zz');
  }, [selectedUserId]);

  // Sync History Stack to SessionStorage on updates
  useEffect(() => {
    if (selectedUserId && historyStack.length > 0) {
      sessionStorage.setItem(`stack_${selectedUserId}`, JSON.stringify(historyStack));
      sessionStorage.setItem(`index_${selectedUserId}`, stackIndex.toString());
    }
  }, [historyStack, stackIndex, selectedUserId]);

  // Helper to fetch and push initial site to stack
  const fetchAndPushInitialSite = (address: string) => {
    setLoading(true);
    setIs404(false);

    apiFetch<Site>(`/sites/${address}`)
      .then((siteData) => {
        setCurrentSite(siteData);
        const initialItem: HistoryItem = { address, siteData, scrollPosition: 0, is404: false };
        setHistoryStack([initialItem]);
        setStackIndex(0);
        setCurrentAddress(address);
      })
      .catch(() => {
        setIs404(true);
        setCurrentSite(null);
        const initialItem: HistoryItem = { address, siteData: null, scrollPosition: 0, is404: true };
        setHistoryStack([initialItem]);
        setStackIndex(0);
        setCurrentAddress(address);
      })
      .finally(() => setLoading(false));
  };

  // Load User Browsing History
  const fetchHistory = (userId: string) => {
    if (!userId) return;
    apiFetch<HistoryEntry[]>(`/visits?userId=${userId}`)
      .then((historyData) => {
        setUserHistory(historyData);
      })
      .catch((err) => console.error('Error fetching user history:', err));
  };

  useEffect(() => {
    fetchHistory(selectedUserId);
  }, [selectedUserId]);

  // Record visit entry to backend
  const logVisit = (address: string, entryType: string) => {
    if (!selectedUserId) return;
    apiFetch('/visits', {
      method: 'POST',
      body: JSON.stringify({
        userId: selectedUserId,
        address,
        entryType,
      }),
    })
      .then(() => fetchHistory(selectedUserId))
      .catch((err) => console.error('Error logging visit:', err));
  };

  // Central Navigation Handler (Fetch live data for NEW navigation, then snapshot it)
  const handleNavigate = (newAddress: string, entryType: 'TYPED' | 'LINK' | 'JUMP' = 'TYPED') => {
    const cleanAddress = newAddress.toLowerCase().trim();
    if (!cleanAddress) return;

    // Save current scroll position to active stack item before navigating away
    if (historyStack[stackIndex] && contentViewerRef.current) {
      historyStack[stackIndex].scrollPosition = contentViewerRef.current.scrollTop;
    }

    setLoading(true);
    setIs404(false);

    apiFetch<Site>(`/sites/${cleanAddress}`)
      .then((siteData) => {
        setCurrentSite(siteData);
        pushToStack(cleanAddress, siteData, false);
      })
      .catch((err) => {
        console.error('Site fetch error:', err);
        setIs404(true);
        setCurrentSite(null);
        pushToStack(cleanAddress, null, true);
      })
      .finally(() => {
        setLoading(false);
        logVisit(cleanAddress, entryType);
      });
  };

  const pushToStack = (address: string, siteData: Site | null, is404Err: boolean) => {
    // Truncate forward history and append snapshot item
    const updatedStack = historyStack.slice(0, stackIndex + 1);
    const newItem: HistoryItem = {
      address,
      siteData,
      scrollPosition: 0,
      is404: is404Err,
    };

    updatedStack.push(newItem);
    setHistoryStack(updatedStack);
    setStackIndex(updatedStack.length - 1);
    setCurrentAddress(address);

    // Reset scroll container position for new page
    if (contentViewerRef.current) {
      contentViewerRef.current.scrollTop = 0;
    }
  };

  // Back Button Navigation Logic (Uses cached Snapshot & Restores Scroll)
  const handleBack = () => {
    if (stackIndex > 0) {
      if (contentViewerRef.current) {
        historyStack[stackIndex].scrollPosition = contentViewerRef.current.scrollTop;
      }

      const prevIndex = stackIndex - 1;
      const targetItem = historyStack[prevIndex];

      setStackIndex(prevIndex);
      setCurrentAddress(targetItem.address);
      setCurrentSite(targetItem.siteData);
      setIs404(!!targetItem.is404);

      requestAnimationFrame(() => {
        if (contentViewerRef.current) {
          contentViewerRef.current.scrollTop = targetItem.scrollPosition || 0;
        }
      });

      logVisit(targetItem.address, 'BACK_FORWARD');
    }
  };

  // Forward Button Navigation Logic (Uses cached Snapshot & Restores Scroll)
  const handleForward = () => {
    if (stackIndex < historyStack.length - 1) {
      if (contentViewerRef.current) {
        historyStack[stackIndex].scrollPosition = contentViewerRef.current.scrollTop;
      }

      const nextIndex = stackIndex + 1;
      const targetItem = historyStack[nextIndex];

      setStackIndex(nextIndex);
      setCurrentAddress(targetItem.address);
      setCurrentSite(targetItem.siteData);
      setIs404(!!targetItem.is404);

      requestAnimationFrame(() => {
        if (contentViewerRef.current) {
          contentViewerRef.current.scrollTop = targetItem.scrollPosition || 0;
        }
      });

      logVisit(targetItem.address, 'BACK_FORWARD');
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-zinc-100 font-sans overflow-hidden dark:bg-zinc-950">
      {/* Address Bar Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <AddressBar
          currentAddress={currentAddress}
          onNavigate={(url) => handleNavigate(url, 'TYPED')}
          canGoBack={stackIndex > 0}
          canGoForward={stackIndex < historyStack.length - 1}
          onBack={handleBack}
          onForward={handleForward}
          onRefresh={() => handleNavigate(currentAddress, 'TYPED')}
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={(id) => setSelectedUserId(id)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      </header>

      {/* Top Action Bar */}
      <div className="flex justify-end px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-100 dark:bg-zinc-700 dark:hover:bg-zinc-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          {showForm ? 'Close Create Form' : '+ Create New Site'}
        </button>
      </div>

      {/* Main Split View Layout */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        <div
          ref={contentViewerRef}
          className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm"
        >
          {showForm ? (
            <SiteForm
              selectedUserId={selectedUserId}
              onSiteCreated={(newSite) => {
                setShowForm(false);
                handleNavigate(newSite.address, 'JUMP');
              }}
            />
          ) : (
            <ContentViewer
              title={currentSite?.title}
              bodyHtml={currentSite?.bodyHtml}
              loading={loading}
              is404={is404}
              onLinkClick={(targetAddress) => handleNavigate(targetAddress, 'LINK')}
            />
          )}
        </div>

        <aside className="w-80 shrink-0 overflow-y-auto">
          <HistoryBar
            history={userHistory}
            onLinkClick={(addr) => handleNavigate(addr, 'JUMP')}
          />
        </aside>
      </main>

      {/* Global Search Modal */}
      <SearchBar
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSite={(addr) => {
          setIsSearchOpen(false);
          handleNavigate(addr, 'JUMP');
        }}
      />
    </div>
  );
}