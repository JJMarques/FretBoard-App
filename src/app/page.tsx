import { SignUpButton, SignInButton, Show } from '@clerk/nextjs';

export default function Home() {
  return (
    <>
      <Show when="signed-in">
        <meta httpEquiv="refresh" content="0;url=/feed" />
      </Show>
      <Show when="signed-out">
        <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
          <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
            <h1 className="text-4xl font-semibold text-text-primary mb-4">
              Fretboard
            </h1>
            <p className="text-text-secondary text-lg mb-10">
              Track your practice, share your progress,
              and connect with musicians around the world.
            </p>
            <div className="flex gap-3 justify-center">
              <SignUpButton>
                <button className="px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-md cursor-pointer">
                  Get started
                </button>
              </SignUpButton>
              <SignInButton>
                <button className="px-6 py-2.5 border border-border text-text-primary text-sm font-medium rounded-md cursor-pointer">
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