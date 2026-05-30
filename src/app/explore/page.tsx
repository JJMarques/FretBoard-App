import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAuthenticatedUser, getFollowingIds } from '@/actions/follows';
import { getGlobalFeed } from '@/actions/sessions';
import SearchBar from '@/components/SearchBar';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton';
import AddSessionButton from '@/components/AddSessionButton';
import SessionFeed from '@/components/SessionFeed';

async function GlobalFeedSessions({ currentUserId }: { currentUserId: string }) {
  const sessions = await getGlobalFeed(10, 0);

  return (
    <SessionFeed
      initialSessions={sessions}
      currentUserId={currentUserId}
      path="/explore"
      type="global"
    />
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
