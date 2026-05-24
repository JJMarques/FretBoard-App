"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, follows } from "@/db/schema";
import { eq, and, or, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function followUser(followingId:string, path: string="/explore") {
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
        if (user[0].id === followingId) return { error: 'Cannot follow yourself' };

        await db.insert(follows).values({
            followerId: user[0].id,
            followingId,
        });

        revalidatePath(path);
        return { success: true };
};

export async function unfollowUser(followingId: string, path: string="/explore") {
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

        await db.delete(follows).where(
            and(
                eq(follows.followerId, user[0].id),
                eq(follows.followingId, followingId)
            )
        );

        revalidatePath(path);
        return { success: true };
};

export async function searchUsers(query: string) {
    if(!query || query.length < 2) return [];

    return await db
        .select()
        .from(users)
        .where(
            or(
                //ilike search without differentiate upper case and lower case
                ilike(users.username, `%${query}%`),
                ilike(users.name, `%${query}%`),
            )
        )
        .limit(10)
};

export async function getAuthenticatedUser(clerkId: string) {
    const user = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);

    return user[0] ?? null;
}

export async function getFollowingIds(userId: string) {
    const following = await db
        .select()
        .from(follows)
        .where(eq(follows.followerId, userId));

    return following.map(f => f.followingId);
}