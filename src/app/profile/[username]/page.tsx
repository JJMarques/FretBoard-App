import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getAuthenticatedUser } from '@/actions/follows';
import { getUserProfile } from '@/actions/profile';
import { getUserStreak } from '@/actions/streaks';
import StreakBadge from '@/components/StreakBadge';
import SessionCard from '@/components/SessionCard';
import FollowButton from '@/components/FollowButton';
import EditableProfile from '@/components/EditableProfile';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect('/sign-in');

  const currentUser = await getAuthenticatedUser(clerkId);
  if (!currentUser) redirect('/sign-in');

  const profileUser = await getUserProfile(username);
  if (!profileUser) notFound();

  const isOwnProfile = currentUser.id === profileUser.id;
  const isFollowing = profileUser.followers.some((f) => f.followerId === currentUser.id);

  const streak = await getUserStreak(profileUser.id);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {profileUser.avatarUrl && (
                <Image
                  src={profileUser.avatarUrl}
                  alt={profileUser.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                {isOwnProfile ? (
                  <EditableProfile
                    name={profileUser.name}
                    bio={profileUser.bio}
                    username={profileUser.username}
                  />
                ) : (
                  <div>
                    <h1 className="text-text-primary text-xl font-semibold">{profileUser.name}</h1>
                    {profileUser.bio && (
                      <p className="text-text-secondary text-sm mt-1">{profileUser.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {streak && (
              <div>
                <StreakBadge
                  currentStreak={streak.currentStreak}
                  longestStreak={streak.longestStreak}
                />
              </div>
            )}
            {!isOwnProfile && (
              <FollowButton
                followingId={profileUser.id}
                isFollowing={isFollowing}
                path={`/profile/${username}`}
              />
            )}
          </div>

          <div className="flex gap-6 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-text-primary text-sm font-semibold">
                {profileUser.sessions.length}
              </p>
              <p className="text-text-secondary text-xs">Sessions</p>
            </div>
            <div>
              <p className="text-text-primary text-sm font-semibold">
                {profileUser.followers.length}
              </p>
              <p className="text-text-secondary text-xs">Followers</p>
            </div>
            <div>
              <p className="text-text-primary text-sm font-semibold">
                {profileUser.following.length}
              </p>
              <p className="text-text-secondary text-xs">Following</p>
            </div>
          </div>

          {profileUser.instruments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profileUser.instruments.map((i) => (
                <span
                  key={i.id}
                  className={`px-3 py-1 text-xs rounded-md border ${
                    i.isFavorite
                      ? 'border-favorite text-favorite'
                      : 'border-border text-text-secondary'
                  }`}
                >
                  {i.isFavorite ? '★ ' : ''}
                  {i.instrument.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="text-text-primary text-base font-medium mb-4">Sessions</h2>

        {profileUser.sessions.length === 0 ? (
          <p className="text-text-secondary text-sm">No sessions yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {profileUser.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                currentUserId={currentUser.id}
                path={`/profile/${username}`}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
