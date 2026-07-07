'use client';

import Link from 'next/link';

export default function Home() {
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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '6rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
          }}>
            Create native mobile apps by chatting with AI.
          </h1>
          <p style={{
            marginTop: '1.25rem',
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            opacity: 0.8,
            maxWidth: '720px',
          }}>
            RorkParity generates real apps with React Native/Expo or SwiftUI. Preview on device, publish to stores.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/workspace" style={{
              padding: '0.85rem 1.6rem',
              borderRadius: '10px',
              background: '#5d9eff',
              color: '#fff',
              fontWeight: 600,
            }}>
              Open Workspace
            </a>
            <a href="/docs" style={{
              padding: '0.85rem 1.6rem',
              borderRadius: '10px',
              border: '1px solid #262626',
              color: '#fff',
              fontWeight: 600,
            }}>
              Read Docs
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
