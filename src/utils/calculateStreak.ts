export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDays = [
    ...new Set(
      dates.map((d) => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  let streak = 0;
  let current = today.getTime();

  for (const day of uniqueDays) {
    if (day === current) {
      streak++;
      current -= 86400000;
    } else if (day === current - 86400000) {
      streak++;
      current = day - 86400000;
    } else {
      break;
    }
  }

  return streak;
}
