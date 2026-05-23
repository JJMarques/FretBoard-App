import { getGlobalFeed } from "@/actions/sessions"
import SessionCard from "@/components/SessionCard";
import FeedSkeleton from "@/components/skeletons/FeedSkeleton";
import { Suspense } from "react";

async function GlobalFeedSessions() {
    const sessions = await getGlobalFeed();
    
    if(sessions.length === 0) {
        return(
            <p  className="text-text-secondary text-sm">
                No sessions yet. Be the first to share!
            </p>
        );
    }

    return(
        <div className="flex flex-col gap-3">
            {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}
        </div>
    );
};

export default function ExplorePage() {
    return(
        <main className="min-h-screen bg-background">
            <div className="max-w-content mx-auto px-4 py-12">
                <h1 className="text-2x1 font-semibold text-text-primary mb-8">
                    Explore
                </h1>
                <Suspense fallback={<FeedSkeleton />}>
                    <GlobalFeedSessions />
                </Suspense>
            </div>
        </main>
    )
}