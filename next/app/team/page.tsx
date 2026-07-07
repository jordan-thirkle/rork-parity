'use client';

import Link from 'next/link';

export default function Team() {
  return (
    <main style={{ minHeight: '100vh' }}>
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
        <Link href="/" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>RorkParity</Link>
        <Link href="/workspace" style={{ opacity: 0.8 }}>Workspace</Link>
        <Link href="/gallery" style={{ opacity: 0.8 }}>Gallery</Link>
        <Link href="/docs" style={{ opacity: 0.8 }}>Docs</Link>
      </nav>
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Team</h1>
        <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>Agent roles and collaboration model.</p>
      </section>
    </main>
  );
}
