'use client';

import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import Link from 'next/link';
import { useSWRConfig } from 'swr';
import { Button } from '@/components/ui/button';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export type WorkspaceChatHandle = {
  regenerate: () => void;
};

type WorkspaceChatProps = {
  userId?: number | null;
  credits?: number | null;
  onCreditsChange?: (credits: number) => void;
  onPreviewHtml?: (html: string | null) => void;
};

const WorkspaceChat = forwardRef<WorkspaceChatHandle, WorkspaceChatProps>(function WorkspaceChat(
  { userId, credits, onCreditsChange, onPreviewHtml },
  ref,
) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: userId
        ? 'Describe the game you want to build. You can also upload assets.'
        : 'Sign in to generate apps, chat, and upload assets.',
    },
  ]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<ReturnType<typeof import('@/lib/supabase/client').createClient> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const { createClient } = await import('@/lib/supabase/client');
      if (!cancelled) setSupabase(createClient());
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById('workspace-chat-end');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const appendAssistant = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text }]);
  }, []);

  const runGeneration = useCallback(
    async (prompt: string) => {
      if (!userId) {
        appendAssistant('Sign in to generate apps.');
        return;
      }
      if ((credits ?? 0) <= 0) {
        appendAssistant('You are out of credits. Top up to continue.');
        return;
      }
      const trimmed = prompt.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user' as const, text: trimmed }]);
      setInput('');
      setError(null);
      setGenerating(true);

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ prompt: trimmed }),
        });

        if (res.status === 401) {
          appendAssistant('Sign in to generate apps.');
          return;
        }
        if (res.status === 402) {
          appendAssistant('You are out of credits. Top up to continue.');
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Generation failed');
        }

        const data = await res.json();
        onPreviewHtml?.(data.html);
        appendAssistant('Generated your game — preview is live on the right.');
        mutate('/api/user');
        if (typeof data.creditsRemaining === 'number') {
          onCreditsChange?.(data.creditsRemaining);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Generation failed';
        setError(msg);
        appendAssistant(`Generation failed: ${msg}`);
      } finally {
        setGenerating(false);
      }
    },
    [userId, credits, appendAssistant, onPreviewHtml, onCreditsChange, mutate],
  );

  const onSubmit = useCallback(
    (formData: FormData) => {
      const text = String(formData.get('message') || '');
      runGeneration(text);
    },
    [runGeneration],
  );

  const regenerateLast = useCallback(() => {
    const userPrompts = messages.filter((m) => m.role === 'user');
    const last = userPrompts[userPrompts.length - 1]?.text;
    if (last) runGeneration(last);
  }, [messages, runGeneration]);

  useImperativeHandle(ref, () => ({ regenerate: regenerateLast }), [regenerateLast]);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!userId) {
      appendAssistant('Sign in to upload assets.');
      event.target.value = '';
      return;
    }
    if ((credits ?? 0) <= 0) {
      appendAssistant('You are out of credits. Top up to continue.');
      event.target.value = '';
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (!supabase) {
        appendAssistant('Upload not configured.');
        return;
      }
      const path = `uploads/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from('uploads').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      appendAssistant(`Uploaded: ${data.publicUrl}`);
    } catch {
      appendAssistant('Upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  const creditsRemaining = credits ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-3xl border border-white/[0.08] bg-black/40 shadow-sm">
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              message.role === 'user'
                ? 'ml-auto bg-[#f97316]/15 text-foreground border border-[#f97316]/30'
                : 'bg-white/5 text-foreground'
            }`}
          >
            <p className="text-[11px] font-medium mb-1 opacity-70">{message.role}</p>
            <p>{message.text}</p>
          </div>
        ))}
        {generating && (
          <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-white/5 text-foreground">
            <p className="text-[11px] font-medium mb-1 opacity-70">assistant</p>
            <p className="opacity-70">Generating your game…</p>
          </div>
        )}
        <div id="workspace-chat-end" />
      </div>

      {!userId ? (
        <div className="border-t border-white/[0.08] p-4 flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">You need an account to generate apps and upload files.</p>
          <div className="flex gap-2">
            <Button asChild className="rounded-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/[0.08] bg-black/60 text-foreground hover:bg-white/[0.06]">
              <Link href="/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
      ) : creditsRemaining <= 0 ? (
        <div className="border-t border-white/[0.08] p-4">
          <div className="rounded-xl border border-white/[0.08] bg-black/60 p-4">
            <p className="text-sm font-semibold text-foreground">Out of credits</p>
            <p className="mt-1 text-xs text-muted-foreground">Top up to continue generating apps and uploading assets.</p>
            <div className="mt-3">
              <Button asChild className="rounded-full">
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <form ref={formRef} action={onSubmit} className="border-t border-white/[0.08] p-3">
          <label className="flex items-center gap-2">
            <input
              type="file"
              className="text-sm"
              onChange={onFileChange}
              disabled={uploading || generating}
            />
            {uploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
          </label>
          <div className="mt-2 flex gap-2">
            <input
              name="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your game..."
              disabled={generating}
              className="flex-1 rounded-xl border border-white/[0.08] bg-black/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              disabled={generating}
              className="rounded-xl bg-[#f97316] text-black px-3 py-2 text-sm font-semibold hover:bg-[#fb8c3a] disabled:opacity-50"
            >
              {generating ? 'Generating…' : 'Send'}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">{creditsRemaining} credits left</p>
            <p className="text-[11px] text-muted-foreground">Press Send or hit Enter to build.</p>
          </div>
        </form>
      )}
    </div>
  );
});

export default WorkspaceChat;
