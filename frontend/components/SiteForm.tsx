'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface SiteFormProps {
  selectedUserId: string;
  onSiteCreated: (newSite: any) => void;
}

export default function SiteForm({ selectedUserId, onSiteCreated }: SiteFormProps) {
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !title.trim() || !bodyHtml.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await apiFetch<any>('/sites', {
        method: 'POST',
        body: JSON.stringify({
          address: address.trim().toLowerCase(),
          title: title.trim(),
          bodyHtml: bodyHtml.trim(),
          authorId: selectedUserId,
        }),
      });
      onSiteCreated(result);
    } catch (err: any) {
      console.error('Failed to publish site:', err);
      setError(err.message || 'Failed to save site');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
        Publish New Site / Edit Existing Site
      </h2>

      {error && (
        <div className="mb-4 p-3 text-xs bg-rose-50 text-rose-600 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Domain Address (e.g. mal-site.zz)
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="domain.zz"
            className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Site Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Site Title"
            className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Body Content (HTML Markup)
          </label>
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            placeholder="<p>Welcome to my page! <a href='tidepool.zz'>Link</a></p>"
            rows={8}
            className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {submitting ? 'Publishing...' : 'Publish / Upsert Site'}
        </button>
      </form>
    </div>
  );
}