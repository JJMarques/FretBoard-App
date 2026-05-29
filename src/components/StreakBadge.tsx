import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Flame size={20} className={currentStreak > 0 ? 'text-favorite' : 'text-text-secondary'} />
        <div>
          <p className="text-text-primary text-lg font-semibold">{currentStreak}</p>
          <p className="text-text-secondary text-xs">Current Streak</p>
        </div>
      </div>
      <div className="border-l border-border pl-4">
        <p className="text-text-primary text-lg font-semibold">{longestStreak}</p>
        <p className="text-text-secondary text-xs">Longest Streak</p>
      </div>
    </div>
  );
}
