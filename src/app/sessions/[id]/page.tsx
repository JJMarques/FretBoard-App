import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getAuthenticatedUser } from '@/actions/follows';
import { getSessionById } from '@/actions/sessions';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import DeleteButton from '@/components/DeleteButton';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import MediaPlayer from '@/components/MediaPlayer';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: Props) {
  const { id } = await params;

  const { userId: clerkId } = await auth();
  if (!clerkId) redirect('/sign-in');

  const user = await getAuthenticatedUser(clerkId);
  if (!user) redirect('/sign-in');

  const session = await getSessionById(id);
  if (!session) notFound();

  const isLiked = session.likes.some((l) => l.userId === user.id);
  const isOwner = session.userId === user.id;

  return (
    <main className="min-h-screen">
      <div className="max-w-content mx-auto px-4 py-12">
        <BackButton />
        <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-text-primary text-xl font-semibold mb-1">{session.title}</h1>
              <p className="text-text-secondary text-sm capitalize">
                {session.instrument.replace(/_/g, ' ')} · {session.durationMinutes} min
              </p>
            </div>
            {isOwner && <DeleteButton sessionId={session.id} />}
          </div>

          {session.notes && <p className="text-text-secondary text-sm mb-4">{session.notes}</p>}

          {session.mediaUrl && session.mediaType && (
            <div className="mb-4">
              <MediaPlayer mediaUrl={session.mediaUrl} mediaType={session.mediaType} />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              {session.user.avatarUrl && (
                <Image
                  src={session.user.avatarUrl}
                  alt={session.user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-text-primary text-sm font-medium">{session.user.name}</p>
                <p className="text-text-secondary text-xs">
                  {new Date(session.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
            <LikeButton
              sessionId={session.id}
              initialLikes={session.likes.length}
              isLiked={isLiked}
              path={`/sessions/${session.id}`}
            />
          </div>
        </div>

        <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg p-6">
          <h2 className="text-text-primary text-base font-medium mb-4">
            Comments ({session.comments.length})
          </h2>
          <CommentSection
            sessionId={session.id}
            initialComments={session.comments}
            currentUserId={user.id}
            path={`/sessions/${session.id}`}
          />
        </div>
      </div>
    </main>
  );
}
