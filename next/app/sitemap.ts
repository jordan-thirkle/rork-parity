import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://rorkparity.byjtt.com';
  const routes = [
    '',
    '/pricing',
    '/templates',
    '/gallery',
    '/team',
    '/roadmap',
    '/docs',
    '/workspace',
    '/sign-in',
    '/sign-up',
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
