import { Suspense } from 'react';
import Link from 'next/link';
import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';
import NavUser from '@/components/NavUser';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-md">
      <div className="max-w-content mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/feed" className="text-text-primary text-sm font-semibold">
              Fretboard
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="text-text-secondary text-sm hover:text-text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/explore"
                  className="text-text-secondary text-sm hover:text-text-primary transition-colors"
                >
                  Explore
                </Link>
                <ThemeToggle />
              </Show>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Show when="signed-in">
              <div className="hidden md:block">
                <Suspense fallback={null}>
                  <NavUser />
                </Suspense>
              </div>
            </Show>
            <Show when="signed-out">
              <div className="hidden md:flex gap-3">
                <SignInButton>
                  <button className="text-text-secondary text-sm hover:text-text-primary transition-colors cursor-pointer">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-3 py-1.5 bg-accent text-background text-sm rounded-md cursor pointer">
                    Get started
                  </button>
                </SignUpButton>
                <ThemeToggle />
              </div>
            </Show>
            <div className="md:hidden flex items-center gap-3">
              <Show when="signed-in">
                <Suspense fallback={null}>
                  <NavUser />
                </Suspense>
              </Show>
              <ThemeToggle />
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
