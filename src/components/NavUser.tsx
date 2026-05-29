// src/components/NavUser.tsx
import { auth } from '@clerk/nextjs/server';
import { getAuthenticatedUser } from '@/actions/follows';
import Link from 'next/link';
import { UserButton, Show } from '@clerk/nextjs';
import { User } from 'lucide-react';

export default async function NavUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getAuthenticatedUser(clerkId);
  if (!user) return null;

  return (
    <Show when="signed-in">
      <div className="flex items-center gap-2">
        <Link
          href={`/profile/${user.username}`}
          className="flex items-center gap-1 text-text-secondary text-sm hover:text-text-primary transition-colors bg-background border border-border rounded-md p-2"
        >
          <User size={20} />
          Profile
        </Link>
        <UserButton />
      </div>
    </Show>
  );
}
