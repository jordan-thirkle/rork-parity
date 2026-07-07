import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RorkParity — AI Game Builder',
  description: 'Build native mobile games from text descriptions. Chat, generate, preview, and ship to the App Store.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
