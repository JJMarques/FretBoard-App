import Link from 'next/link';
import Image from 'next/image';
import LikeButton from './LikeButton';
import MediaPlayer from './MediaPlayer';
import { MessageCircle } from 'lucide-react';

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    instrument: string;
    durationMinutes: number;
    notes: string | null;
    mediaUrl: string | null;
    mediaType: string | null;
    createdAt: Date;
    user: {
      name: string;
      username: string;
      avatarUrl: string | null;
    };
    likes: { userId: string }[];
    comments: { id: string }[];
  };
  currentUserId: string;
  path?: string;
}

export default function SessionCard({ session, currentUserId, path }: SessionCardProps) {
  const isLiked = session.likes.some((l) => l.userId === currentUserId);

  return (
    <Link href={`/sessions/${session.id}`}>
      <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-primary text-sm font-medium">{session.title}</span>
          <span className="text-text-secondary text-xs">{session.durationMinutes} min</span>
        </div>
        <span className="text-text-secondary text-xs capitalize mb-2 block">
          {session.instrument.replace(/_/g, ' ')}
        </span>
        {session.notes && (
          <p className="text-text-secondary text-xs line-clamp-2 mb-3">{session.notes}</p>
        )}
        {session.mediaUrl && session.mediaType && (
          <MediaPlayer mediaUrl={session.mediaUrl} mediaType={session.mediaType} />
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {session.user.avatarUrl && (
              <Image
                src={session.user.avatarUrl}
                alt={session.user.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <p className="text-text-secondary text-xs">{session.user.name}</p>
            <p className="text-text-secondary text-xs">
              · {new Date(session.createdAt).toLocaleDateString('en-GB')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LikeButton
              sessionId={session.id}
              initialLikes={session.likes.length}
              isLiked={isLiked}
              path={path}
            />
            <span className="text-text-secondary text-xs flex gap-1.5">
              <MessageCircle size={16} /> {session.comments.length}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
