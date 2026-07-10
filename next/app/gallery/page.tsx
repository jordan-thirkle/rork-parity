import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Gallery — Rork',
  description:
    'Explore games built with Rork. Open any project in the workspace to start from it.',
};

const projects = [
  { name: 'Neon Brawl', author: 'ByJTT', category: 'Brawler', gradient: 'from-orange-500/25 to-red-600/10', emoji: '🥊' },
  { name: 'Orbit Strike', author: 'mira', category: 'Shooter', gradient: 'from-yellow-500/25 to-orange-500/10', emoji: '🔫' },
  { name: 'Coin Factory', author: 'devon', category: 'Idle / Clicker', gradient: 'from-emerald-500/25 to-teal-500/10', emoji: '👆' },
  { name: 'Cube Realm', author: 'k0ji', category: '3D', gradient: 'from-blue-500/25 to-indigo-500/10', emoji: '🧊' },
  { name: 'Realm of Ash', author: 'lena', category: 'RPG', gradient: 'from-purple-500/25 to-fuchsia-500/10', emoji: '⚔️' },
  { name: 'Proto Play', author: 'sam', category: 'Generic', gradient: 'from-zinc-400/20 to-zinc-700/10', emoji: '🎮' },
  { name: 'Arena Kings', author: 'tariq', category: 'Brawler', gradient: 'from-orange-500/25 to-amber-600/10', emoji: '🥊' },
  { name: 'Wave Defense', author: 'nori', category: 'Shooter', gradient: 'from-yellow-500/25 to-rose-500/10', emoji: '🔫' },
  { name: 'Idle Empire', author: 'wes', category: 'Idle / Clicker', gradient: 'from-emerald-500/25 to-green-600/10', emoji: '👆' },
];

export default function GalleryPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight">Gallery</h1>
          <p className="mt-2 text-muted-foreground">
            Example games built with Rork. Open any project to remix it in the workspace.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.name}
              href="/workspace"
              className="group block rounded-2xl border border-white/[0.08] bg-black/40 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg"
            >
              <div
                className={`flex h-36 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${project.gradient} text-4xl`}
              >
                <span className="drop-shadow">{project.emoji}</span>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="text-base font-semibold text-foreground">{project.name}</div>
                <span className="rounded-full border border-white/[0.08] bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                  {project.category}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">by {project.author}</div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
