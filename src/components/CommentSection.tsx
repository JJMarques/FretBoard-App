'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createComment, deleteComment } from '@/actions/social';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
}

interface CommentSectionProps {
  sessionId: string;
  initialComments: Comment[];
  currentUserId: string;
  path?: string;
}

export default function CommentSection({
  sessionId,
  initialComments,
  currentUserId,
  path,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const result = await createComment(sessionId, content, path);

    if (result?.error) {
      setLoading(false);
      return;
    }

    if (result?.comment) {
      setComments((prev) => [...prev, result.comment]);
      setContent('');
    }

    setLoading(false);
  }

  async function handleDelete(commentId: string) {
    await deleteComment(commentId, path);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-background/60 backdrop-blur-sm border border-border/50 rounded-md outline-none focus:border-accent text-text-primary placeholder:text-text-secondary"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-accent text-background text-sm font-medium rounded-md disabled:opacity-40 cursor-pointer"
        >
          {loading ? <div className="loader" /> : 'Post'}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            {comment.user.avatarUrl && (
              <Link href={`/profile/${comment.user.username}`} onClick={(e) => e.stopPropagation()}>
                <Image
                  src={comment.user.avatarUrl}
                  alt={comment.user.name}
                  width={28}
                  height={28}
                  className="rounded-full flex-shrink-0"
                />
              </Link>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Link
                  href={`/profile/${comment.user.username}`}
                  className="text-text-primary text-xs font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {comment.user.name}
                </Link>
                {comment.user.id === currentUserId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-text-secondary text-xs hover:text-error transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-text-secondary text-sm mt-0.5">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
