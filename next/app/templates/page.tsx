import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Templates — Rork',
  description:
    'Start building your game from a proven template. Pick a category and generate a starting point in the workspace.',
};

const templates = [
  {
    title: 'Brawler',
    description: 'Arena combat with melee, dodges, and combos.',
    prompt: 'an arena brawler game with melee combat, dodging, and combos',
    gradient: 'from-orange-500/25 to-red-600/10',
    emoji: '🥊',
  },
  {
    title: 'Shooter',
    description: 'Top-down action with weapons and waves of enemies.',
    prompt: 'a top-down shooter game with weapons, enemies, and waves',
    gradient: 'from-yellow-500/25 to-orange-500/10',
    emoji: '🔫',
  },
  {
    title: 'Idle / Clicker',
    description: 'Tap, earn, and automate your way to big numbers.',
    prompt: 'an idle clicker game with tapping, upgrades, and automation',
    gradient: 'from-emerald-500/25 to-teal-500/10',
    emoji: '👆',
  },
  {
    title: '3D',
    description: 'Worlds, physics, and camera control in 3D.',
    prompt: 'a 3D game with three.js worlds, physics, and camera control',
    gradient: 'from-blue-500/25 to-indigo-500/10',
    emoji: '🧊',
  },
  {
    title: 'RPG',
    description: 'Quests, loot, and a character that grows with you.',
    prompt: 'a role-playing game with quests, loot, and character progression',
    gradient: 'from-purple-500/25 to-fuchsia-500/10',
    emoji: '⚔️',
  },
  {
    title: 'Generic',
    description: 'A flexible prototype to bend to any idea.',
    prompt: 'a casual game prototype I can customize',
    gradient: 'from-zinc-400/20 to-zinc-700/10',
    emoji: '🎮',
  },
];

export default function TemplatesPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight">Templates</h1>
          <p className="mt-2 text-muted-foreground">
            Pick a category to seed the workspace. We&apos;ll generate a starting point you can refine.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const href = '/workspace?prompt=' + encodeURIComponent(template.prompt);
            return (
              <Link
                key={template.title}
                href={href}
                className="group block rounded-2xl border border-white/[0.08] bg-black/40 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg"
              >
                <div
                  className={`flex h-36 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${template.gradient} text-4xl`}
                >
                  <span className="drop-shadow">{template.emoji}</span>
                </div>
                <div className="mt-4 text-base font-semibold text-foreground">{template.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{template.description}</div>
                <div className="mt-4 text-sm font-medium text-primary opacity-80 transition-opacity group-hover:opacity-100">
                  Use template →
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
