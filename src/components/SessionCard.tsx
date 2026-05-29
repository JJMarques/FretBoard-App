import Link from 'next/link';
import Image from 'next/image';
import LikeButton from './LikeButton';
import MediaPlayer from './MediaPlayer';
import { MessageCircle, Music } from 'lucide-react';

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
    <div className="p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
      <Link
        href={`/profile/${session.user.username}`}
        className="flex items-center gap-4 mb-4 pb-4 border-b-1 border-border"
      >
        <div>
          {session.user.avatarUrl && (
            <Image
              src={session.user.avatarUrl}
              alt={session.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </div>
        <div>
          <p className="text-text-primary text-md truncate">{session.user.name}</p>
          <p className="text-text-secondary text-xs">
            {new Date(session.createdAt).getHours()}:{new Date(session.createdAt).getMinutes()}
            &nbsp; • &nbsp;
            {new Date(session.createdAt).toLocaleDateString('en-GB')}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between mb-2">
        <Link
          href={`/sessions/${session.id}`}
          className="flex gap-3 items-center text-text-primary text-lg font-medium hover:gap-4 transition-all line-break flex-1"
        >
          <Music size={18} className="text-text-secondary" />
          {session.title}
        </Link>
        <span className="text-text-secondary capitalize text-sm">
          {session.durationMinutes} min &nbsp; • &nbsp; {session.instrument.replace(/_/g, ' ')}
        </span>
      </div>
      {session.notes && (
        <p className="text-text-secondary text-xs line-clamp-2 mb-3">{session.notes}</p>
      )}

      {session.mediaUrl && session.mediaType && (
        <MediaPlayer mediaUrl={session.mediaUrl} mediaType={session.mediaType} />
      )}
      <div className="flex items-center pt-4 border-t-1 border-border">
        <div className="flex items-center gap-3">
          <LikeButton
            sessionId={session.id}
            initialLikes={session.likes.length}
            isLiked={isLiked}
            path={path}
          />
          <span className="flex items-center justify-center px-2 h-10 min-w-15 text-text-secondary bg-background border border-border rounded-md flex gap-1.5">
            <MessageCircle size={16} /> {session.comments.length}
          </span>
        </div>
      </div>
    </div>
  );
}
