'use client';

import { useMemo } from 'react';

const milestones = [
  {
    id: 'm1',
    title: 'Chat-first builder',
    status: 'in-progress',
    description: 'Natural-language game generation with live preview. Chat wired; real LLM generation pending.',
    tags: ['core'],
  },
  {
    id: 'm2',
    title: 'Template gallery',
    status: 'shipped',
    description: 'Starter scaffolds surfaced in the gallery as workspace entry points.',
    tags: ['core'],
  },
  {
    id: 'm3',
    title: 'Credits & billing',
    status: 'in-progress',
    description: 'Credits schema + deduction live. Real Stripe checkout and starting grant pending.',
    tags: ['billing'],
  },
  {
    id: 'm4',
    title: 'Auth & teams',
    status: 'in-progress',
    description: 'Credential auth + Supabase client wired. Full Supabase auth migration pending.',
    tags: ['auth'],
  },
  {
    id: 'm5',
    title: 'Native export',
    status: 'planned',
    description: 'Expo/EAS pipeline for iOS TestFlight and Android APK/AAB builds.',
    tags: ['mobile', 'export'],
  },
  {
    id: 'm6',
    title: 'Physics & multiplayer',
    status: 'planned',
    description: 'Built-in physics templates and realtime multiplayer rooms.',
    tags: ['gameplay', 'multiplayer'],
  },
  {
    id: 'm7',
    title: 'App Store publishing',
    status: 'planned',
    description: 'Automated store metadata, screenshots, and submission flow.',
    tags: ['mobile', 'publishing'],
  },
];

const statusStyles: Record<string, string> = {
  shipped: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  'in-progress': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  planned: 'border-white/[0.08] bg-black/40 text-muted-foreground',
};

const statusLabel: Record<string, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export default function RoadmapPage() {
  const grouped = useMemo(() => {
    const groups = new Map<string, typeof milestones>();
    for (const item of milestones) {
      const key = item.status;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return groups;
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 bg-background text-foreground">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Roadmap</h1>
        <p className="text-muted-foreground mt-3">
          Current priorities and near-term direction for RorkParity.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {Array.from(grouped.entries()).map(([status, items]) => (
          <div
            key={status}
            className={`rounded-2xl border p-6 transition-all duration-200 ${statusStyles[status]}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold capitalize text-foreground">
                {status.replace('-', ' ')}
              </h2>
              <span className="text-xs font-medium rounded-full border border-white/10 px-2 py-0.5 text-foreground/80">
                {statusLabel[status]}
              </span>
            </div>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-black/40 p-4 border border-white/[0.08] transition-all duration-200 hover:border-white/20 hover:shadow-lg"
                >
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs rounded-full border border-white/10 px-2 py-0.5 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-6">
          <h2 className="text-lg font-semibold text-foreground">Delivery rhythm</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            We track this roadmap against shipped behavior, not announcements. If a
            milestone moves, it shows here as status changed — not removed.
          </p>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-white/10" />
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-muted-foreground md:grid-cols-4">
              <div>Research</div>
              <div>Build</div>
              <div>Validate</div>
              <div>Ship</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
