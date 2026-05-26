'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users, sessions, streaks } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { calculateStreak } from '@/utils/calculateStreak';
import { revalidatePath } from 'next/cache';

export async function updateStreak() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return;

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (!user[0]) return;

  const allSessions = await db
    .select({ createdAt: sessions.createdAt })
    .from(sessions)
    .where(eq(sessions.userId, user[0].id))
    .orderBy(desc(sessions.createdAt));

  const currentStreak = calculateStreak(allSessions.map((s) => s.createdAt));

  const existing = await db.select().from(streaks).where(eq(streaks.userId, user[0].id)).limit(1);

  if (existing[0]) {
    await db
      .update(streaks)
      .set({
        currentStreak,
        longestStreak: Math.max(currentStreak, existing[0].longestStreak),
        lastPractice: new Date(),
      })
      .where(eq(streaks.userId, user[0].id));
  } else {
    await db.insert(streaks).values({
      userId: user[0].id,
      currentStreak,
      longestStreak: currentStreak,
      lastPractice: new Date(),
    });
  }

  revalidatePath('/feed');
}

export async function getUserStreak(userId: string) {
  const streak = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);

  return streak[0] ?? null;
}
