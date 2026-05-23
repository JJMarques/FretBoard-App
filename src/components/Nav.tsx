import Link from 'next/link';
import { UserButton, Show, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Nav() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-content mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/feed" className="text-text-primary text-sm font-semibold">
              Fretboard
            </Link>
            <Show when="signed-in">
              <Link href="/sessions/new" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
                New session
              </Link>
              <Link href="/explore" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
                Explore
              </Link>
            </Show>
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-in">
                <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton>
                <button className="text-text-secondary text-sm hover:text-text-primary transition-colors cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-3 py-1.5 bg-accent text-background text-sm rounded-md cursor-pointer">
                  Get started
                </button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}