'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import WorkspaceChat, { type WorkspaceChatHandle } from '@/components/workspace-chat';
import { SiteHeader } from '@/components/site-header';

type User = {
  id: number;
  email: string;
  name?: string | null;
  credits?: number | null;
} | null;

type AppUser = {
  id: number;
  email: string;
  name?: string | null;
  credits?: number | null;
};

export default function WorkspacePage() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
      <SiteHeader />
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading workspace...</div>
        </div>
      ) : user ? (
        <AuthenticatedWorkspace user={user} />
      ) : (
        <UnauthenticatedWorkspace />
      )}
    </div>
  );
}

function UnauthenticatedWorkspace() {
  return (
    <div className="flex-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/[0.08] bg-black/40 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Workspace</h1>
          <p className="mt-2 text-muted-foreground">Sign in to generate apps, chat, and access your projects.</p>
          <div className="mt-6 flex items-center gap-3">
            <Button asChild className="rounded-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/[0.08] bg-black/60 text-foreground hover:bg-white/[0.06]">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedWorkspace({ user }: { user: AppUser }) {
  const credits = user.credits ?? 0;
  const [liveCredits, setLiveCredits] = useState<number>(credits);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [exportPrompt, setExportPrompt] = useState('a game');
  const [exporting, setExporting] = useState(false);
  const [exportedApp, setExportedApp] = useState<string | null>(null);
  const chatRef = useRef<WorkspaceChatHandle>(null);

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(320px,380px)_1fr] gap-0 lg:gap-4 p-3 lg:p-4">
        {/* LEFT — chat / prompt thread */}
        <aside className="flex flex-col min-h-0 lg:h-[calc(100vh-4.5rem)]">
          <div className="flex items-center justify-between px-1 pb-3">
            <div className="text-sm font-semibold text-foreground">RorkParity</div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground">
                Credits: <span className="font-semibold text-foreground">{liveCredits}</span>
              </div>
              <AvatarMenu email={user.email} name={user.name} />
            </div>
          </div>
          <div className="flex-1 min-h-0 lg:min-h-0">
            <WorkspaceChat
              ref={chatRef}
              userId={user.id}
              credits={liveCredits}
              onCreditsChange={setLiveCredits}
              onPreviewHtml={setPreviewHtml}
            />
          </div>
        </aside>

        {/* RIGHT — persistent simulation panel */}
        <section className="flex flex-col min-h-0 lg:h-[calc(100vh-4.5rem)] mt-4 lg:mt-0">
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/[0.08] bg-black/40 px-4 py-3 shadow-sm">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Live preview</div>
              <div className="truncate text-sm font-semibold text-foreground">
                {previewHtml ? 'RorkParity project' : 'No project yet'}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden sm:inline text-xs text-muted-foreground">
                {liveCredits} credits left
              </span>
              <Button
                variant="outline"
                className="rounded-full border-white/[0.08] bg-black/60 text-foreground hover:bg-white/[0.06] text-xs disabled:opacity-50"
                disabled={!previewHtml || liveCredits <= 0}
                onClick={() => chatRef.current?.regenerate()}
              >
                Regenerate
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-white/[0.08] bg-black/60 text-foreground hover:bg-white/[0.06] text-xs"
                disabled={exporting}
                onClick={async () => {
                  setExporting(true);
                  setExportedApp(null);
                  try {
                    const res = await fetch('/api/export', {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({ prompt: exportPrompt }),
                    });
                    if (res.status === 401) {
                      setExportedApp('// Sign in to export an Expo project.');
                      return;
                    }
                    if (!res.ok) {
                      const data = await res.json().catch(() => ({}));
                      setExportedApp('// Export failed: ' + (data.error || res.status));
                      return;
                    }
                    const data = await res.json();
                    setExportedApp(data.files?.['App.tsx'] || '// No App.tsx returned.');
                  } catch (err) {
                    setExportedApp('// Export failed: ' + (err instanceof Error ? err.message : 'unknown error'));
                  } finally {
                    setExporting(false);
                  }
                }}
              >
                {exporting ? 'Exporting…' : 'Export Expo project'}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex-1 min-h-0 rounded-3xl border border-white/[0.08] bg-black/40 p-1 shadow-sm">
            {previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                title="Game preview"
                sandbox="allow-scripts allow-same-origin"
                className="h-full w-full rounded-2xl bg-black/40 border border-white/[0.08]"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-center px-6 text-sm text-muted-foreground">
                Describe a game on the left to see a live preview here.
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/40 px-3 py-2">
            <input
              value={exportPrompt}
              onChange={(e) => setExportPrompt(e.target.value)}
              placeholder="prompt for Expo export"
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
            />
            {exportedApp && (
              <a
                href={URL.createObjectURL(new Blob([exportedApp], { type: 'text/plain' }))}
                download="App.tsx"
                className="text-xs font-semibold text-[#f97316] hover:underline"
              >
                Download App.tsx
              </a>
            )}
          </div>

          {exportedApp && (
            <div className="mt-3 rounded-xl border border-white/[0.08] bg-black/60 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">App.tsx</span>
              </div>
              <pre className="max-h-48 overflow-auto text-[11px] text-muted-foreground whitespace-pre-wrap">
                {exportedApp}
              </pre>
            </div>
          )}
        </section>
      </div>

      {liveCredits <= 0 && (
        <div className="px-3 lg:px-4 pb-4">
          <div className="rounded-2xl border border-white/[0.08] bg-black/60 p-4">
            <p className="text-sm font-semibold text-foreground">Out of credits</p>
            <p className="mt-1 text-xs text-muted-foreground">Top up to continue generating apps and uploading assets.</p>
            <div className="mt-3">
              <Button asChild className="rounded-full">
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { signOut } from '@/app/(login)/actions';

function AvatarMenu({ email, name }: { email: string; name?: string | null }) {
  const [open, setOpen] = useState(false);
  const initials = (name || email || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/10 text-xs font-semibold text-foreground hover:bg-white/20"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/[0.08] bg-black/80 backdrop-blur-xl shadow-sm">
          <div className="px-3 py-2 border-b border-white/[0.08]">
            <div className="text-sm font-semibold text-foreground">{name || 'Account'}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
          <div className="py-1 text-sm">
            <button className="w-full text-left px-3 py-2 text-foreground hover:bg-white/[0.04]">Profile</button>
            <button className="w-full text-left px-3 py-2 text-foreground hover:bg-white/[0.04]">Billing</button>
            <button className="w-full text-left px-3 py-2 text-foreground hover:bg-white/[0.04]">Settings</button>
            <form action={signOut}>
              <button type="submit" className="w-full text-left px-3 py-2 text-foreground hover:bg-white/[0.04]">Sign out</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
