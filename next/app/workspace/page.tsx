'use client';

import Link from 'next/link';

export default function Workspace() {
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
        padding: '2rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Workspace
          </h1>
          <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>
            Chat prompt, upload assets, generate native apps, preview, export.
          </p>
        </div>
        <div style={{
          gridColumn: '1 / -1',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid #262626',
          background: '#141414',
        }}>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}>
            <input
              placeholder="Describe your app..."
              style={{
                flex: 1,
                padding: '0.9rem 1rem',
                borderRadius: '10px',
                border: '1px solid #2a2a2a',
                background: '#0f0f0f',
                color: '#fff',
              }}
            />
            <button style={{
              padding: '0.9rem 1.2rem',
              borderRadius: '10px',
              background: '#5d9eff',
              color: '#fff',
              fontWeight: 600,
            }}>
              Generate
            </button>
          </div>
          <div style={{ opacity: 0.6 }}>
            Wire FORGEMASTER/SMITH pipeline here.
          </div>
        </div>
      </section>
    </main>
  );
}
