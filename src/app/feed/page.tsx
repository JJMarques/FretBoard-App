import { Suspense } from "react";
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from "next/link";
import { getFeed } from "@/actions/sessions";
import { getAuthenticatedUser } from '@/actions/follows';
import FeedSkeleton from "@/components/skeletons/FeedSkeleton";
import SessionCard from "@/components/SessionCard";

async function FeedSessions({ currentUserId }: { currentUserId: string }) {
    const sessions = await getFeed();

    if(sessions.length === 0) {
        return (
            <p className="text-text-secondary text-sm">
                No sessions yet. <Link href="/explore" className="font-semibold text-text-primary">Follow some musicians</Link> to see their sessions here.
            </p>
        );
    }

    return(
        <div className="flex flex-col gap-3">
            {sessions.map((session) => (
                <SessionCard key={session.id} session={session} currentUserId={currentUserId} path="/feed" />
            ))}
        </div>
    )

}

export default async function FeedPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect('/sign-in');

    const user = await getAuthenticatedUser(clerkId);
    if (!user) redirect('/sign-in');

    return(
        <main className="min-h-screen bg-background">
            <div className="max-w-content mx-auto px-4 py-12">
                <h1 className="text-2x1 font-semibold text-text-primary mb-8">
                    Your Feed
                </h1>
                <Suspense fallback={<FeedSkeleton />}>
                    <FeedSessions currentUserId={user.id} />
                </Suspense>
            </div>
        </main>
    )
}    
    
