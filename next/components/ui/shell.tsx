'use client';

import Link from 'next/link';

export function Nav() {
  return (
    <nav style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '1rem 2rem',
      borderBottom: '1px solid #262626',
      background: 'rgba(15,15,15,0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <Link href="/" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
        RorkParity
      </Link>
      <Link href="/workspace" style={{ opacity: 0.8 }}>
        Workspace
      </Link>
      <Link href="/gallery" style={{ opacity: 0.8 }}>
        Gallery
      </Link>
      <Link href="/docs" style={{ opacity: 0.8 }}>
        Docs
      </Link>
    </nav>
  );
}
