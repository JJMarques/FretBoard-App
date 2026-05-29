import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getDashboardStats } from '@/actions/dashboard';
import SessionCard from '@/components/SessionCard';
import { Clock, Music, Flame } from 'lucide-react';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton';

async function DashboardContent() {
  const stats = await getDashboardStats();
  if (!stats) redirect('/sign-in');

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Total minutes</p>
          </div>
          <p className="text-text-primary text-lg font-semibold">{stats.totalMinutes}</p>
        </div>
        <div className="p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Music size={14} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Total sessions</p>
          </div>
          <p className="text-text-primary text-lg font-semibold">{stats.totalSessions}</p>
        </div>
        <div className="p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Current streak</p>
          </div>
          <p className="text-text-primary text-lg font-semibold">{stats.currentStreak} days</p>
        </div>
      </div>

      <div>
        <h2 className="text-text-primary text-base font-medium mb-4">Recent sessions</h2>
        {stats.recentSessions.length === 0 ? (
          <p className="text-text-secondary text-sm">No sessions yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.recentSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                currentUserId={stats.userId}
                path="/dashboard"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-content mx-auto px-4 py-12">
        <h1 className="text-lg font-semibold text-text-primary mb-8">Dashboard</h1>
        <Suspense fallback={<FeedSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}
