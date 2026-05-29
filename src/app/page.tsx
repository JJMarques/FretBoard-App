import { SignUpButton, SignInButton, Show } from '@clerk/nextjs';

export default function Home() {
  return (
    <>
      <Show when="signed-in">
        <meta httpEquiv="refresh" content="0;url=/feed" />
      </Show>
      <Show when="signed-out">
        <main className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="max-w-content w-full text-center">
            <h1 className="text-4xl font-semibold text-text-primary mb-4">Fretboard</h1>
            <p className="text-text-secondary text-lg mb-10">
              Track your practice, share your progress, and connect <br />
              with musicians around the world.
            </p>
            <div className="flex gap-3 justify-center">
              <SignUpButton>
                <button className="px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-md cursor-pointer">
                  Get started
                </button>
              </SignUpButton>
              <SignInButton>
                <button className="px-6 py-2.5 bg-background/60 backdrop-blur-sm border border-border text-text-primary/80 text-sm font-medium rounded-md transition-colors hover:bg-surface hover:text-text-primary cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </main>
      </Show>
    </>
  );
}
