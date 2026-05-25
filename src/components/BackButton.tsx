'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-surface text-text-secondary px-4 py-2 border border-border rounded-md  text-sm hover:text-text-primary transition-colors mb-6 block cursor-pointer"
    >
      ← Back
    </button>
  );
}
