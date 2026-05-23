"use server";

import { db } from '@/db';
import { sessions, users, follows } from '@/db/schema';
import { eq, and, inArray, sum, count, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from "next/cache";
import { z } from 'zod';

import { INSTRUMENTS } from '@/constants/instruments';
import { type Instrument } from '@/constants/instruments';


const createSessionSchema = z.object({
    instrument: z.enum(INSTRUMENTS),
    title: 
        z.string()
        .min(1, 'O título é obrigatório')
        .max(100, 'O título não pode ter mais de 100 caracteres'),
    durationMinutes: 
        z.number()
        .min(1, 'A duração mínima é 1 minuto')
        .max(480, 'A duração máxima é 8 horas'),
    notes: z.string().optional().nullable(),
    mediaUrl: z.string().url().nullable().optional(),
    mediaType: z.string().nullable().optional(),
}).refine(data => {
  if (data.mediaUrl && !data.mediaType) return false;
  return true;
}, {
  message: 'mediaType é obrigatório quando há mediaUrl',
  path: ['mediaType'],
});

export async function createSession(
    instrument: string,
    title: string,
    durationMinutes: number,
    notes: string | null,
    mediaUrl: string | null,
    mediaType: string | null,
) {
    const { userId: clerkId } = await auth();

    if(!clerkId) {
        return { error: 'Not authenticated.' };
    };

    const user = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, clerkId))
            .limit(1);    

    if(!user[0]) return { error: 'User not Found.' };

    const result = createSessionSchema.safeParse({ 
        instrument, 
        title, 
        durationMinutes, 
        notes,
        mediaUrl,
        mediaType,
    });

    if (!result.success) {
        return {
            errors: {
                instrument: result.error.issues.find(i => i.path[0] === 'instrument')?.message,
                title: result.error.issues.find(i => i.path[0] === 'title')?.message,
                durationMinutes: result.error.issues.find(i => i.path[0] === 'durationMinutes')?.message,
                notes: result.error.issues.find(i => i.path[0] === 'notes')?.message,
                mediaUrl: result.error.issues.find(i => i.path[0] === 'mediaUrl')?.message,
                mediaType: result.error.issues.find(i => i.path[0] === 'mediaType')?.message,
            }
        };
    }

    await db.insert(sessions).values({
        userId: user[0].id,
        instrument: result.data.instrument as Instrument,
        title: result.data.title,
        durationMinutes: result.data.durationMinutes,
        notes: result.data.notes ?? null,
        mediaUrl: result.data.mediaUrl ?? null,
        mediaType: result.data.mediaType ?? null,
    });

    revalidatePath('/feed');
    return { success: true };
};

export async function getSessions() {
    const { userId: clerkId } = await auth();

    if (!clerkId) return [];

    const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

    if (!user[0]) return [];

    return await db.query.sessions.findMany({
        where: (sessions, { eq }) => eq(sessions.userId, user[0].id),
        orderBy: (sessions, { desc }) => [desc(sessions.createdAt)],
        with: {
            user: true,
        },
    });
};

export async function getSessionById(sessionId: string) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) return null;

        const user = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, clerkId))
            .limit(1);

        if (!user[0]) return null;

        return await db.query.sessions.findFirst({
            where: (sessions, { eq, and }) => and(
                eq(sessions.id, sessionId),
                eq(sessions.userId, user[0].id)
            ),
            with: {
                user: true,
            },
        });
    } catch {
        return null;
    }
};

export async function deleteSession(sessionId: string) {
    const { userId: clerkId } = await auth();

    if (!clerkId) return [];

    const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

    if (!user[0]) return [];

    await db.delete(sessions).where(
        and(
            eq(sessions.id, sessionId),
            eq(sessions.userId, user[0].id)
        )
    );

    revalidatePath('/feed');
    return { success: true };
};

export async function updateSession(
    sessionId: string,
    instrument: string,
    title: string,
    durationMinutes: number,
    notes: string | null,
    mediaUrl: string | null,
    mediaType: string | null,
) {
    const { userId: clerkId } = await auth();

    if (!clerkId) return [];

    const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

    if (!user[0]) return [];

    const result = createSessionSchema.safeParse({ 
        instrument, 
        title, 
        durationMinutes, 
        notes,
        mediaUrl,
        mediaType,
    });

    if (!result.success) {
        return {
            errors: {
                instrument: result.error.issues.find(i => i.path[0] === 'instrument')?.message,
                title: result.error.issues.find(i => i.path[0] === 'title')?.message,
                durationMinutes: result.error.issues.find(i => i.path[0] === 'durationMinutes')?.message,
                notes: result.error.issues.find(i => i.path[0] === 'notes')?.message,
                mediaUrl: result.error.issues.find(i => i.path[0] === 'mediaUrl')?.message,
                mediaType: result.error.issues.find(i => i.path[0] === 'mediaType')?.message,
            }
        };
    }

    await db.update(sessions).set({
        instrument: result.data.instrument as Instrument,
        title: result.data.title,
        durationMinutes: result.data.durationMinutes,
        notes: result.data.notes ?? null,
        mediaUrl: result.data.mediaUrl ?? null,
        mediaType: result.data.mediaType ?? null,
    }).where(
        and(
            eq(sessions.id, sessionId),
            eq(sessions.userId, user[0].id),
        )
    )

    revalidatePath('/feed');
    return { success: true };
};

export async function getGlobalFeed() {
    return await db.query.sessions.findMany({
        orderBy: (sessions, { desc }) => [desc(sessions.createdAt)],
        with: {
            user: true,
        },
    });
};

export async function getFeed() {
    const { userId: clerkId } = await auth();

    if (!clerkId) return [];

    const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

    if (!user[0]) return [];

    const following = await db
        .select()
        .from(follows)
        .where(eq(follows.followerId, user[0].id));

    const followingIds = following.map(f => f.followingId);
    if (followingIds.length === 0) return [];

    return await db.query.sessions.findMany({
        where: (sessions, { inArray }) => inArray(sessions.userId, followingIds),
        orderBy: (sessions, { desc }) => [desc(sessions.createdAt)],
        with: {
            user: true,
        },
    });
};
