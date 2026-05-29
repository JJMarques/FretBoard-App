'use client';
import Link from 'next/link';

export default function BackButton() {
  return (
    <Link
      href="/feed"
      className="text-text-secondary max-w-15 text-sm hover:text-text-primary transition-colors mb-6 block cursor-pointer"
    >
      ← Feed
    </Link>
  );
}
