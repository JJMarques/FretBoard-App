import { getFeed } from "@/actions/sessions";
import FeedSkeleton from "@/components/skeletons/FeedSkeleton";
import SessionCard from "@/components/SessionCard";
import { Suspense } from "react";

async function FeedSessions() {
    const sessions = await getFeed();

    if(sessions.length === 0) {
        return (
            <p className="text-text-secondary text-sm">
                No sessions yet. Follow some musicians to see their sessions here.
            </p>
        );
    }

    return(
        <div className="flex flex-col gap-3">
            {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}
        </div>
    )

}

export default function FeedPage() {

    return(
        <main className="min-h-screen bg-background">
            <div className="max-w-content mx-auto px-4 py-12">
                <h1 className="text-2x1 font-semibold text-text-primary mb-8">
                    Your Feed
                </h1>
                <Suspense fallback={<FeedSkeleton />}>
                    <FeedSessions />
                </Suspense>
            </div>
        </main>
    )
}    
    
