'use client';
import { searchUsers } from '@/actions/follows';
import { useState, useRef, useEffect } from 'react';
import FollowButton from './FollowButton';
import Image from 'next/image';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

interface SearchBarProps {
  currentUserId: string;
  followingIds: string[];
}

export default function SearchBar({ currentUserId, followingIds }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setResults([]);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const users = await searchUsers(value);
    setResults(users.filter((u) => u.id !== currentUserId));
    setLoading(false);
  }

  return (
    <div ref={containerRef} className="relative flex items-center mb-8">
      <Search size={25} className="text-text-primary mr-4" />
      <input
        type="text"
        placeholder="Search for Musicians...."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-4 py-2.5 text-sm bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg outline-none focus:border-accent text-text-primary placeholder:text-text-secondary"
      />
      {loading && <p className="text-text-secondary text-xs mt-2">Searching...</p>}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg overflow-hidden z-10">
          {results.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 hover:bg-surface transition-colors border-b border-border last:border-0"
            >
              <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
                {user.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="text-text-primary text-sm font-medium">{user.name}</p>
                  <p className="text-text-secondary text-xs">@{user.username}</p>
                </div>
              </Link>
              <FollowButton
                followingId={user.id}
                isFollowing={followingIds.includes(user.id)}
                path="/explore"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
