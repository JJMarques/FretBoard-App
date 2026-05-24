'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-text-secondary text-sm hover:text-text-primary transition-colors mb-6 block cursor-pointer"
    >
      ← Back
    </button>
  );
}