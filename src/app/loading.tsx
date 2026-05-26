import FeedSkeleton from '@/components/skeletons/FeedSkeleton';

export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-content mx-auto px-4 py-12">
        <p className="text-white">Loading...</p>
      </div>
    </main>
  );
}
