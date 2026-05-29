'use client';

import { useState } from 'react';
import { followUser, unfollowUser } from '@/actions/follows';

interface FollowButtonProps {
  followingId: string;
  isFollowing: boolean;
  path: string;
}

export default function FollowButton({ followingId, isFollowing, path }: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    if (following) {
      setFollowing(false);
      const result = await unfollowUser(followingId, path);
      if (result?.error) setFollowing(true);
    } else {
      setFollowing(true);
      const result = await followUser(followingId, path);
      if (result?.error) setFollowing(false);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1.5 min-w-20 text-sm font-medium rounded-md border transition-colors disabled:opacity-50 cursor-pointer ${
        following
          ? 'bg-background text-text-primary border-border hover:bg-surface-hover'
          : 'bg-accent text-background border-accent'
      }`}
    >
      {loading ? <span className="loader" /> : following ? 'Following' : 'Follow'}
    </button>
  );
}
