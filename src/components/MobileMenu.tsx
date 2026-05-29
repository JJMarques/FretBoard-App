'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Show } from '@clerk/nextjs';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg overflow-hidden z-50 shadow-lg">
          <Show when="signed-in">
            <Link
              href="/feed"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-text-primary hover:bg-surface transition-colors border-b border-border"
            >
              Feed
            </Link>
            <Link
              href="/explore"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-text-primary hover:bg-surface transition-colors border-b border-border"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-text-primary hover:bg-surface transition-colors border-b border-border"
            >
              Dashboard
            </Link>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-text-primary hover:bg-surface transition-colors border-b border-border"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-text-primary hover:bg-surface transition-colors"
            >
              Get started
            </Link>
          </Show>
        </div>
      )}
    </div>
  );
}
