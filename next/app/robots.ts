export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api/'],
    },
    sitemap: 'https://rork-parity.vercel.app/sitemap.xml',
  };
}
