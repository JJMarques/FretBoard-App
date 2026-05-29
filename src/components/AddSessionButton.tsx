import Link from 'next/link';
import { CirclePlus } from 'lucide-react';

export default function AddSessionButton() {
  return (
    <Link
      href="/sessions/new"
      className=" flex items-center bg-background/60 backdrop-blur-sm border border-border/50 p-2 rounded-md text-text-secondary text-sm hover:text-text-primary transition-colors"
    >
      <CirclePlus size={18} className="text-favorite mr-2" />
      New Session
    </Link>
  );
}
