import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Gamepad2, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHomePage() {
  return (
    <main className="bg-background text-foreground">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Chat-first game builder
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Describe it.
                <span className="block text-primary">We'll build the game.</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:mt-5 sm:text-lg">
                RorkParity turns a sentence into a playable game in your browser.
                Refine it in conversation, then publish to games.byjtt.com.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:max-w-lg sm:mx-auto sm:justify-start lg:mx-0 lg:justify-start">
                <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/workspace">
                    Open workspace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/[0.08] bg-black/60 text-foreground hover:bg-white/[0.06]">
                  <Link href="/gallery">
                    Browse templates
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-5">
              <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  Quick start
                </div>
                <ul className="mt-4 space-y-3 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                    Prompt a game in plain language.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                    Watch it render live in the preview.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                    Iterate by chatting — no rebuilds.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 rounded-full bg-primary" />
                    Publish when it's good enough.
                  </li>
                </ul>
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/60 px-4 py-3 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Generation uses credits — top up in Pricing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
