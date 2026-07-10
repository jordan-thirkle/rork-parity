'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/team', label: 'Team' },
];

export function SiteFooter() {
  const pathname = usePathname();
  return (
    <footer className="border-t border-white/[0.08] bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>Rork — ByJTT Game Builder</span>
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? 'text-primary' : 'hover:text-foreground'}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
