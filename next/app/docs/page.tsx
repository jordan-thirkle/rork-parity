'use client';

import Link from 'next/link';

export default function Docs() {
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
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Docs
        </h1>
        <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>
          Rebuild brief, QA checklist, agent runbooks, and integration guides.
        </p>
        <ul style={{ marginTop: '1.25rem', display: 'grid', gap: '0.75rem' }}>
          <li><a href="/docs/rebuild-brief-v2" style={{ color: '#5d9eff' }}>Rebuild Brief v2</a></li>
          <li><a href="/docs/fullstack-qa-checklist" style={{ color: '#5d9eff' }}>Full-Stack QA Checklist</a></li>
        </ul>
      </section>
    </main>
  );
}
