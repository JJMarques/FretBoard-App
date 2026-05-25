'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { sessionComments, sessionLikes, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function likeSession(sessionId: string, path: string = '/feed') {
  const { userId: clerkId } = await auth();

  if (!clerkId) return { error: 'Not authenticated.' };

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (!user[0]) return { error: 'User not Found.' };

  await db.insert(sessionLikes).values({
    userId: user[0].id,
    sessionId,
  });

  revalidatePath(path);
  return { success: true };
}

export async function unlikeSession(sessionId: string, path: string = '/feed') {
  const { userId: clerkId } = await auth();

  if (!clerkId) return { error: 'Not authenticated.' };

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (!user[0]) return { error: 'User not Found.' };

  await db
    .delete(sessionLikes)
    .where(and(eq(sessionLikes.userId, user[0].id), eq(sessionLikes.sessionId, sessionId)));

  revalidatePath(path);
  return { success: true };
}

export async function createComment(sessionId: string, content: string, path: string = '/feed') {
  const { userId: clerkId } = await auth();

  if (!clerkId) return { error: 'Not authenticated.' };

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (!user[0]) return { error: 'User not Found.' };
  if (!content.trim()) return { error: 'Comments cannot be empty' };

  const newComment = await db
    .insert(sessionComments)
    .values({
      userId: user[0].id,
      sessionId,
      content: content.trim(),
    })
    .returning();

  revalidatePath(path);
  return {
    success: true,
    comment: {
      ...newComment[0],
      user: user[0],
    },
  };
}

export async function deleteComment(commentId: string, path: string = 'feed') {
  const { userId: clerkId } = await auth();

  if (!clerkId) return { error: 'Not authenticated.' };

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (!user[0]) return { error: 'User not Found.' };

  await db
    .delete(sessionComments)
    .where(and(eq(sessionComments.id, commentId), eq(sessionComments.userId, user[0].id)));

  revalidatePath(path);
  return { success: true };
}
