import './globals.css';
import type { Metadata, Viewport } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: {
    default: 'RorkParity — chat-to-game builder for web & mobile',
    template: '%s — RorkParity',
  },
  description: 'RorkParity is an AI chat-to-game builder by ByJTT. Describe a game in plain language and ship a playable web or mobile build — no code required.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt2game.byjtt.com'),
  openGraph: {
    type: 'website',
    siteName: 'RorkParity',
    title: 'RorkParity — chat-to-game builder for web & mobile',
    description: 'RorkParity is an AI chat-to-game builder by ByJTT. Describe a game in plain language and ship a playable web or mobile build — no code required.',
    url: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt2game.byjtt.com'),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RorkParity — chat-to-game builder for web & mobile',
    description: 'RorkParity is an AI chat-to-game builder by ByJTT. Describe a game in plain language and ship a playable web or mobile build — no code required.',
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-background text-foreground"
    >
      <body className="min-h-[100dvh] bg-background text-foreground antialiased dark">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
