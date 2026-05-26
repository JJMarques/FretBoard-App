'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users, sessions, streaks } from '@/db/schema';
import { eq, desc, sum, count } from 'drizzle-orm';

export async function getDashboardStats() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (!user[0]) return null;

  const stats = await db
    .select({
      totalMinutes: sum(sessions.durationMinutes),
      totalSessions: count(),
    })
    .from(sessions)
    .where(eq(sessions.userId, user[0].id));

  const streak = await db.select().from(streaks).where(eq(streaks.userId, user[0].id)).limit(1);

  const recentSessions = await db.query.sessions.findMany({
    where: eq(sessions.userId, user[0].id),
    orderBy: [desc(sessions.createdAt)],
    limit: 5,
    with: {
      user: true,
      likes: true,
      comments: true,
    },
  });

  return {
    totalMinutes: Number(stats[0].totalMinutes) || 0,
    totalSessions: Number(stats[0].totalSessions) || 0,
    currentStreak: streak[0]?.currentStreak ?? 0,
    recentSessions,
    userId: user[0].id,
  };
}
