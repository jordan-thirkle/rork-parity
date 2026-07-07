'use client';

import Link from 'next/link';
import WorkspaceChat from '@/components/workspace-chat';

export default function Workspace() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1rem',
        minHeight: 0,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', minHeight: 0 }}>
          <div style={{ minHeight: 520 }}>
            <WorkspaceChat />
          </div>
          <div style={{
            padding: '1.25rem',
            borderRadius: 16,
            border: '1px solid #262626',
            background: '#141414',
            minHeight: 520,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Preview / Export</div>
            <div style={{ opacity: 0.7 }}>This panel will host the live preview and native export actions.</div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/docs/rebuild-brief-v2" style={{
                padding: '0.75rem 1.1rem',
                borderRadius: 10,
                border: '1px solid #262626',
                color: '#fff',
                fontWeight: 600,
              }}>
                Open Rebuild Brief
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
