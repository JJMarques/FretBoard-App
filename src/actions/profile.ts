'use server';

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { revalidatePath } from 'next/cache';
import { users } from '@/db/schema';

export async function getUserProfile(username: string) {
  return await db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      instruments: true,
      sessions: {
        orderBy: (sessions, { desc }) => [desc(sessions.createdAt)],
        with: {
          user: true,
          likes: true,
          comments: true,
        },
      },
      followers: true,
      following: true,
    },
  });
}

export async function updateProfile(name: string, bio: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: 'Not authenticated' };

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user[0]) return { error: 'User not found' };

  await db.update(users).set({ name, bio }).where(eq(users.id, user[0].id));

  revalidatePath(`/profile/${user[0].username}`);
  return { success: true };
}
