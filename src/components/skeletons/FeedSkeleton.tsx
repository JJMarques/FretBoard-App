export default function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-4 bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg border border-border"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 bg-background rounded animate-pulse border border-border" />
            <div className="h-3 w-12 bg-background rounded animate-pulse border border-border" />
          </div>
          <div className="h-4 w-3/4 bg-background rounded animate-pulse border border-border mb-2" />
          <div className="h-3 w-1/2 bg-background rounded animate-pulse border border-border mb-4" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-background animate-pulse border border-border" />
            <div className="h-3 w-20 bg-background rounded animate-pulse border border-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
