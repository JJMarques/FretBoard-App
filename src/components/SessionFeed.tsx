'use client';

import { useState } from 'react';
import SessionCard from './SessionCard';
import { getFeed, getGlobalFeed } from '@/actions/sessions';

type Session = Awaited<ReturnType<typeof getGlobalFeed>>[number];

interface SessionFeedProps {
  initialSessions: Session[];
  currentUserId: string;
  path: string;
  type: 'feed' | 'global';
}

export default function SessionFeed({
  initialSessions,
  currentUserId,
  path,
  type,
}: SessionFeedProps) {
  const [sessions, setSessions] = useState(initialSessions);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialSessions.length === 10);

  async function loadMore() {
    setLoading(true);
    const more =
      type === 'feed'
        ? await getFeed(10, sessions.length)
        : await getGlobalFeed(10, sessions.length);

    if (more.length < 10) setHasMore(false);
    setSessions((prev) => [...prev, ...more]);
    setLoading(false);
  }

  if (sessions.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        {type === 'feed'
          ? 'No sessions yet. Follow some musicians!'
          : 'No sessions yet. Be the first to share!'}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} currentUserId={currentUserId} path={path} />
      ))}
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full py-3 text-sm bg-surface text-text-secondary hover:text-text-primary border border-border rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? <div className="loader" /> : 'Load more'}
        </button>
      )}
    </div>
  );
}
