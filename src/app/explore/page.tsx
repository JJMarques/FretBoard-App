import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, getFollowingIds } from '@/actions/follows';
import { getGlobalFeed } from '@/actions/sessions';
import SessionCard from '@/components/SessionCard';
import SearchBar from '@/components/SearchBar';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton';
import AddSessionButton from '@/components/AddSessionButton';

async function GlobalFeedSessions({ currentUserId }: { currentUserId: string }) {
  const sessions = await getGlobalFeed();

  if (sessions.length === 0) {
    return <p className="text-text-secondary text-sm">No sessions yet. Be the first to share!</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          currentUserId={currentUserId}
          path="/explore"
        />
      ))}
    </div>
  );
}

export default async function ExplorePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect('/sign-in');

  const user = await getAuthenticatedUser(clerkId);
  if (!user) redirect('/sign-in');

  const followingIds = await getFollowingIds(user.id);

  return (
    <main className="min-h-screen">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="flex justify-between mb-8 items-center">
          <h1 className="text-lg font-semibold text-text-primary">Explore</h1>
          <AddSessionButton />
        </div>
        <SearchBar currentUserId={user.id} followingIds={followingIds} />
        <Suspense fallback={<FeedSkeleton />}>
          <GlobalFeedSessions currentUserId={user.id} />
        </Suspense>
      </div>
    </main>
  );
}
