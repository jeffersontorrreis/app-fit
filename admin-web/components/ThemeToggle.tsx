'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

function resolveInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';

  const saved = window.localStorage.getItem('vivafit-admin-theme');
  if (saved === 'dark' || saved === 'light') return saved;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute('data-theme', mode);
  window.localStorage.setItem('vivafit-admin-theme', mode);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const initial = resolveInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]"
    >
      {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
    </button>
  );
}
