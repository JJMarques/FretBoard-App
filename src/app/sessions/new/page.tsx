import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getAuthenticatedUser } from '@/actions/follows';
import SessionForm from '@/components/SessionForm';

export default async function NewSessionPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect('/sign-in');

  const user = await getAuthenticatedUser(clerkId);
  if (!user) redirect('/sign-in');

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-content mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-text-primary mb-8">
          New session
        </h1>
        <SessionForm />
      </div>
    </main>
  );
}