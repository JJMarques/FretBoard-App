'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');

    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      setDark(false);
    } else {
      // garante que dark está activo (já vem do HTML mas por segurança)
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  function toggle() {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDark(true);
    }
  }

  return (
    <button
      onClick={toggle}
      className="text-text-secondary bg-surface border rounded-md border-border p-2 hover:text-text-primary transition-colors cursor-pointer"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
