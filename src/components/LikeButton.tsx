'use client';
import { useState } from 'react';
import { likeSession, unlikeSession } from '@/actions/social';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  sessionId: string;
  initialLikes: number;
  isLiked: boolean;
  path?: string;
}

export default function LikeButton({ sessionId, initialLikes, isLiked, path }: LikeButtonProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);

  async function handleClick() {
    if (liked) {
      setLiked(false);
      setLikes((prev) => prev - 1);
      const result = await unlikeSession(sessionId, path);
      if (result?.error) {
        setLiked(true);
        setLikes((prev) => prev + 1);
      }
    } else {
      setLiked(true);
      setLikes((prev) => prev + 1);
      const result = await likeSession(sessionId, path);
      if (result?.error) {
        setLiked(true);
        setLikes((prev) => prev - 1);
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
        liked ? 'text-favorite' : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      <Heart size={16} className={liked ? 'fill-favorite text-favorite' : 'text-text-secondary'} />
      <span>{likes}</span>
    </button>
  );
}
