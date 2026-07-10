'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

type TeamMember = {
  id: number;
  userId: number;
  teamId: number;
  role?: string | null;
  user: {
    id: number;
    name?: string | null;
    email: string;
  };
};

type Team = {
  id: number;
  name?: string | null;
  teamMembers: TeamMember[];
};

type FetchError = Error & { status?: number };

function fetcher(url: string): Promise<Team> {
  return fetch(url, { cache: 'no-store' }).then(async (res) => {
    if (res.status === 401 || res.status === 403) {
      const err = new Error('unauthorized') as FetchError;
      err.status = res.status;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`Request failed (${res.status})`) as FetchError;
      err.status = res.status;
      throw err;
    }
    const data = (await res.json()) as Team | null;
    // Backend returns null (200) when unauthenticated.
    if (data === null) {
      const err = new Error('unauthorized') as FetchError;
      err.status = 401;
      throw err;
    }
    return data;
  });
}

function initials(m: TeamMember): string {
  const name = m.user.name?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }
  const local = m.user.email.split('@')[0];
  return local.slice(0, 2).toUpperCase();
}

export default function TeamPage() {
  const { data, error, isLoading, mutate } = useSWR<Team>('/api/team', fetcher);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (res.status === 401 || res.status === 403) {
        setMsg({ type: 'err', text: 'You need to sign in to invite members.' });
      } else if (res.ok) {
        setEmail('');
        setMsg({ type: 'ok', text: 'Invite sent.' });
        mutate();
      } else {
        const body = await res.text().catch(() => '');
        setMsg({ type: 'err', text: body || `Invite failed (${res.status}).` });
      }
    } catch {
      setMsg({ type: 'err', text: 'Network error. Try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">Team</h1>
        <p className="mt-2 text-muted-foreground">
          Collaborate on RorkParity builds with your team.
        </p>

        {/* Unauthorized */}
        {(error as FetchError | undefined)?.status === 401 && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-black/40 p-8 text-center">
            <p className="text-foreground">Sign in to view your team.</p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && !data && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-white/[0.08] bg-black/40"
              />
            ))}
          </div>
        )}

        {/* Error (non-auth) */}
        {error && (error as FetchError).status !== 401 && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-black/40 p-8 text-center">
            <p className="text-foreground">Couldn’t load the team.</p>
            <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => mutate()}>
              Retry
            </Button>
          </div>
        )}

        {/* Member list */}
        {data && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.teamMembers.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">
                  No members yet. Invite someone below.
                </p>
              )}
              {data.teamMembers.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-white/[0.08] bg-black/40 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-foreground">
                      {initials(m)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-foreground">
                        {m.user.name || m.user.email}
                      </div>
                      <div className="truncate text-sm text-muted-foreground">
                        {m.user.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Invite form */}
            <div className="mt-10 rounded-2xl border border-white/[0.08] bg-black/40 p-6">
              <h2 className="text-lg font-semibold text-foreground">Invite a member</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Send an invite by email to grow your team.
              </p>
              <form onSubmit={invite} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  required
                  placeholder="teammate@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full"
                  aria-label="Invite email"
                />
                <Button type="submit" disabled={submitting} className="rounded-full">
                  {submitting ? 'Sending…' : 'Send invite'}
                </Button>
              </form>
              {msg && (
                <p
                  className={`mt-3 text-sm ${
                    msg.type === 'ok' ? 'text-foreground' : 'text-destructive'
                  }`}
                >
                  {msg.text}
                </p>
              )}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
