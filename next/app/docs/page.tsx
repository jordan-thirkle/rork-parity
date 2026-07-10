import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DocsPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">Docs</h1>
        <p className="mt-3 text-muted-foreground">Reference, setup, and guides for building with Rork.</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Getting started', 'Workspace', 'Templates', 'Billing', 'Native export', 'API'].map((item) => (
            <Link key={item} href="#" className="block rounded-2xl border border-white/[0.08] bg-black/40 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg">
              <div className="text-sm font-semibold text-foreground">{item}</div>
              <div className="mt-1 text-sm text-muted-foreground">Learn how to use {item.toLowerCase()}.</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
