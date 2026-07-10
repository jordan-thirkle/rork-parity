'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

type User = {
  id: number;
  email: string;
  name?: string | null;
  credits?: number | null;
} | null;

const navLinks = [
  { href: '/gallery', label: 'Templates' },
  { href: '/workspace', label: 'Workspace' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
];

export function SiteHeader() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/user', { cache: 'no-store' });
        if (!cancelled) {
          if (res.ok) {
            const data = await res.json();
            setUser(data?.user || null);
          } else {
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-foreground">
          Rork
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden inline-flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-black/60 text-foreground"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
            </span>
          </button>

          {!loading && user ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                Credits:{' '}
                <span className="ml-1 font-semibold text-foreground">{user.credits ?? 0}</span>
              </div>
              <Button
                asChild
                className="rounded-full border border-white/[0.08] bg-white/10 text-foreground hover:bg-white/20"
              >
                <Link href="/workspace">Open workspace</Link>
              </Button>
            </div>
          ) : (
            <Button
              asChild
              className="hidden sm:inline-flex rounded-full border border-white/[0.08] bg-white/10 text-foreground hover:bg-white/20"
            >
              <Link href="/workspace">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-black/40 backdrop-blur">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1 text-sm">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-2 transition-colors ${
                    active
                      ? 'bg-white/[0.04] text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {!(!loading && user) && (
              <Link
                href="/workspace"
                className="mt-1 rounded-xl border border-white/[0.08] bg-white/10 px-3 py-2 text-center font-medium text-foreground"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
