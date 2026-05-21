import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FretBoard',
  description: 'Track your practice, Share your progress, Connect with musicians.',
  openGraph: {
    title: 'FretBoard',
    description: 'Track your practice, Share your progress, Connect with musicians.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={plusJakartaSans.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
