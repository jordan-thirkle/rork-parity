import Link from 'next/link';
import { Button } from '@/components/ui/button';

const founders = [
  { name: 'Kevin Systrom', app: 'Instagram' },
  { name: 'Zach Yadegari', app: 'Cal AI' },
  { name: 'Nikita Bier', app: 'Gas' },
  { name: 'George', app: 'Wrestle AI' },
  { name: 'Sam Altman', app: 'OpenAI' },
];

const templates = [
  { title: 'Create a Multiplayer Game', href: '/workspace?template=multiplayer-game&prompt=Create%20a%20multiplayer%20game' },
  { title: 'Create a 3D Game', href: '/workspace?template=3d-game&prompt=Create%20a%203D%20Game' },
  { title: 'Lovable to Mobile App', href: '/workspace?template=lovable-to-mobile&prompt=Lovable%20to%20Mobile%20App' },
  { title: 'GitHub to Mobile App', href: '/workspace?template=github-to-mobile&prompt=GitHub%20to%20Mobile%20App' },
];

const features = [
  {
    title: 'Templates',
    desc: 'Start from a library of prebuilt game and app templates — tweak and ship.',
  },
  {
    title: 'Chat-to-game',
    desc: 'Describe your idea in plain language and watch it build in real time.',
  },
  {
    title: 'Native export',
    desc: 'Ship to iOS and Android with real native performance — no wrappers.',
  },
  {
    title: 'Credits',
    desc: 'Transparent pay-as-you-go generation, no hidden seat licenses.',
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-[100dvh] bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-background to-background" />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Be the next app founder
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Create mobile apps by chatting with AI, ship to the App Store, and start
            making money.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Link href="/workspace">Start building</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/[0.08] bg-black/60 text-foreground hover:bg-white/[0.06]"
            >
              <Link href="/templates">Browse templates</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/[0.08] bg-black/40 p-6"
            >
              <div className="size-9 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center">
                <span className="size-2 rounded-full bg-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {founders.map((founder) => (
            <div key={founder.name} className="min-w-[220px]">
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-black/40">
                <div className="h-44 w-full bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center text-4xl">
                  {founder.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="rounded-full border border-white/[0.08] bg-black/70 backdrop-blur px-3 py-2 flex items-center gap-2">
                    <div className="size-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-foreground">
                      {founder.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground leading-none">{founder.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{founder.app}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 px-1">
                <div className="text-sm font-semibold text-foreground">Be the next</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="rounded-3xl border border-white/[0.08] bg-black/40 p-2 shadow-sm max-w-3xl">
          <div className="rounded-2xl border border-white/[0.08] bg-black/60 p-5">
            <div className="flex items-start justify-between gap-4">
              <p className="text-base text-muted-foreground">Describe the app you want to build...</p>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground">For iPhone</div>
                <div className="text-sm font-semibold text-foreground mt-0.5">Claude Fable 5</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {templates.map((template) => (
                <Link
                  key={template.title}
                  href={template.href}
                  className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-medium hover:bg-white/[0.06]"
                >
                  {template.title}
                </Link>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/70 p-4">
              <p className="text-xs text-muted-foreground">Drop files here to upload them to the conversation</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Max 10MB · Upgrade for up to 5GB uploads</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Button asChild className="rounded-full">
                <Link href="/workspace">Generate</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/[0.08] bg-black/60 text-foreground hover:bg-white/[0.06]"
              >
                <Link href="/gallery">Browse templates</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Build native games.</h2>
        <p className="mt-3 text-muted-foreground">
          3D worlds with real physics, multiplayer games — running natively at 60fps. Just
          describe your game.
        </p>
        <div className="mt-8 aspect-video w-full rounded-3xl border border-white/[0.08] bg-black/60 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-muted-foreground text-sm">
            Game preview
          </div>
        </div>
      </section>
    </div>
  );
}
