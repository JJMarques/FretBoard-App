'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSession } from '@/actions/sessions';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  sessionId: string;
}

export default function DeleteButton({ sessionId }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this session?')) return;

    setLoading(true);
    await deleteSession(sessionId);
    router.push('/feed');
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-2 py-2 text-sm text-error border border-error rounded-md hover:bg-error-light disabled:opacity-50 transition-colors cursor-pointer"
    >
      {loading ? 'Deleting...' : <Trash2 size={16} strokeWidth={2} />}
    </button>
  );
}
