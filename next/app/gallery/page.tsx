import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const templates = [
  {
    id: 'zone-brawler',
    title: 'Zone Brawler',
    description: 'Top-down arena brawler with combo chains and local multiplayer.',
    image: '/templates/zone-brawler.png',
    href: '/workspace?template=zone-brawler',
  },
  {
    id: 'world3d',
    title: 'World3D',
    description: 'Three.js explorable world with basic physics interactions.',
    image: '/templates/world3d.png',
    href: '/workspace?template=world3d',
  },
  {
    id: 'shooter',
    title: 'Shooter',
    description: '2D side-scrolling shooter with projectile patterns.',
    image: '/templates/shooter.png',
    href: '/workspace?template=shooter',
  },
  {
    id: 'idle-rpg',
    title: 'Idle RPG',
    description: 'Progression loop with upgrades, waves, and simple inventory.',
    image: '/templates/idle-rpg.png',
    href: '/workspace?template=idle-rpg',
  },
  {
    id: 'native-expo',
    title: 'Native Mobile',
    description: 'Expo starter with device preview, QR export, and native controls.',
    image: '/templates/native-expo.png',
    href: '/workspace?template=native-expo',
  },
];

export default function GalleryPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Template Gallery</h1>
          <p className="text-gray-600 mt-2">
            Start from a working scaffold, then refine with chat.
          </p>
        </div>
        <Link
          href="/workspace"
          className="hidden md:inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Open workspace
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border bg-white shadow-sm overflow-hidden"
          >
            <div className="aspect-video bg-gray-100 relative">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex rounded-md border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Use template
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
