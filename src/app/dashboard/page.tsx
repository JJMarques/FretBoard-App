import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getDashboardStats } from '@/actions/dashboard';
import SessionCard from '@/components/SessionCard';
import { Clock, Music, Flame } from 'lucide-react';

async function DashboardContent() {
  const stats = await getDashboardStats();
  if (!stats) redirect('/sign-in');

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Total minutes</p>
          </div>
          <p className="text-text-primary text-2xl font-semibold">{stats.totalMinutes}</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Music size={14} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Total sessions</p>
          </div>
          <p className="text-text-primary text-2xl font-semibold">{stats.totalSessions}</p>
        </div>
        <div className="p-4 bg-surface rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-text-secondary" />
            <p className="text-text-secondary text-xs">Current streak</p>
          </div>
          <p className="text-text-primary text-2xl font-semibold">{stats.currentStreak} days</p>
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
    <main className="min-h-screen bg-background">
      <div className="max-w-content mx-auto px-4 py-12">
        <h1 className="font-semibold text-text-primary mb-8">Dashboard</h1>
        <Suspense fallback={<p className="text-text-secondary text-sm">Loading...</p>}>
          <DashboardContent />
        </Suspense>
      </div>
    </main>
  );
}
