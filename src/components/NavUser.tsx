// src/components/NavUser.tsx
import { auth } from '@clerk/nextjs/server';
import { getAuthenticatedUser } from '@/actions/follows';
import Link from 'next/link';
import { UserButton, Show } from '@clerk/nextjs';
import ThemeToggle from './ThemeToggle';

export default async function NavUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getAuthenticatedUser(clerkId);
  if (!user) return null;

  return (
    <Show when="signed-in">
      <Link
        href={`/profile/${user.username}`}
        className="text-text-secondary text-sm hover:text-text-primary transition-colors"
      >
        Profile
      </Link>
      <UserButton />
      <ThemeToggle />
    </Show>
  );
}
