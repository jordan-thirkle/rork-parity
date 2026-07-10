'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2 } from 'lucide-react';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/user', { cache: 'no-store' });
        if (!cancelled && res.ok) {
          const data = await res.json();
          setCredits(data?.user?.credits ?? 0);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setCreditsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const showCreditsBanner = !creditsLoading && credits !== null && credits <= 0;

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-foreground">
          {mode === 'signin'
            ? 'Sign in to your account'
            : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === 'signin'
            ? 'Welcome back to Rork.'
            : 'Start building apps with AI.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {showCreditsBanner && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-semibold text-red-400">Out of credits</p>
            <p className="mt-1 text-xs text-red-300/80">Top up to continue generating apps and uploading assets.</p>
            <div className="mt-3">
              <Button asChild className="rounded-full">
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>
          </div>
        )}
        <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-8 shadow-sm">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-muted-foreground"
              >
                Email
              </Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  required
                  maxLength={50}
                  className="rounded-xl border-white/[0.08] bg-black/60 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/40"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-muted-foreground"
              >
                Password
              </Label>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === 'signin' ? 'current-password' : 'new-password'
                  }
                  defaultValue={state.password}
                  required
                  minLength={8}
                  maxLength={100}
                  className="rounded-xl border-white/[0.08] bg-black/60 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/40"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-400 text-sm">{state.error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Loading...
                  </>
                ) : mode === 'signin' ? (
                  'Sign in'
                ) : (
                  'Sign up'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/40 text-muted-foreground">
                  {mode === 'signin'
                    ? 'New to our platform?'
                    : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                  redirect ? `?redirect=${redirect}` : ''
                }${priceId ? `&priceId=${priceId}` : ''}`}
                className="w-full flex justify-center py-2 px-4 border border-white/[0.08] rounded-full shadow-sm text-sm font-medium text-foreground bg-black/60 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {mode === 'signin'
                  ? 'Create an account'
                  : 'Sign in to existing account'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
