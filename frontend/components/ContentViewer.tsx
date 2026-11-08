'use client';

import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { AlertCircle, Globe } from 'lucide-react';

interface ContentViewerProps {
  title?: string;
  bodyHtml?: string;
  loading?: boolean;
  is404?: boolean;
  onLinkClick?: (targetAddress: string) => void;
}

export default function ContentViewer({
  title,
  bodyHtml,
  loading = false,
  is404 = false,
  onLinkClick,
}: ContentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Strict DOMPurify Sanitization Config (Fixes CSS Leakage & XSS Exploits)
  const cleanHtml =
    typeof window !== 'undefined'
      ? DOMPurify.sanitize(bodyHtml || '', {
          FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'object', 'embed'],
          FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout'],
          ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|ftp):|[^a-z]|[a-z+.-]+(?:[^:]|$))/i,
        })
      : bodyHtml || '';

  // HTML content ke andar <a href="..."> clicks intercept karne ke liye logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onLinkClick) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target) {
        e.preventDefault();
        let href = target.getAttribute('href');
        if (href) {
          // Absolute url cleanup (e.g., /reef.zz -> reef.zz)
          href = href.replace(/^https?:\/\//, '').replace(/^\//, '');
          onLinkClick(href);
        }
      }
    };

    container.addEventListener('click', handleAnchorClick);
    return () => container.removeEventListener('click', handleAnchorClick);
  }, [cleanHtml, onLinkClick]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 text-zinc-400">
        <Globe className="h-6 w-6 animate-spin mr-2" />
        <span>Loading Content...</span>
      </div>
    );
  }

  // 2. 404 Not Found State
  if (is404) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center py-16">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-3" />
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">404 Site Not Found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          Requested domain address database mein exist nahi karta.
        </p>
      </div>
    );
  }

  // 3. Normal HTML Render State
  return (
    <article className="w-full flex-1">
      {title && (
        <h1 className="text-2xl font-bold mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
      )}
      
      <div
        ref={containerRef}
        className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </article>
  );
}