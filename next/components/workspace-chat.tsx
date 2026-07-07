'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  files?: Array<{ name: string; size: number; type: string }>;
  createdAt: Date;
};

export default function WorkspaceChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Describe the app you want to build, or upload assets to get started.',
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmed,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate build pipeline response
    await new Promise(r => setTimeout(r, 600));
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: `Received: "${trimmed}". Local generator scaffold is active in this build. Next: attach file uploads and native export.`,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fileArray = Array.from(files).slice(0, 5);
    const fileMeta = fileArray.map(f => ({ name: f.name, size: f.size, type: f.type }));

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: `Uploaded ${fileArray.length} file(s)`,
      files: fileMeta,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    await new Promise(r => setTimeout(r, 500));
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: `Assets queued: ${fileMeta.map(f => f.name).join(', ')}. In a full build these would be injected into the generated native project.`,
      createdAt: new Date(),
    }]);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      border: '1px solid #262626',
      borderRadius: 16,
      background: '#141414',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #262626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Builder Chat</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Local mode</div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '0.8rem 1rem',
            borderRadius: 14,
            background: msg.role === 'user' ? '#5d9eff' : '#1f1f1f',
            color: '#fff',
            lineHeight: 1.45,
          }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
              {msg.role === 'user' ? 'You' : 'RorkParity'} · {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>{msg.text}</div>
            {msg.files && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {msg.files.map((f, i) => (
                  <span key={i} style={{
                    fontSize: 12,
                    padding: '4px 8px',
                    borderRadius: 8,
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}>
                    {f.name} · {(f.size / 1024).toFixed(1)} KB
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} style={{
        padding: '0.75rem',
        borderTop: '1px solid #262626',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={e => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '0.7rem 0.9rem',
            borderRadius: 10,
            border: '1px solid #262626',
            background: '#1f1f1f',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe your app..."
          style={{
            flex: 1,
            padding: '0.8rem 1rem',
            borderRadius: 10,
            border: '1px solid #2a2a2a',
            background: '#0f0f0f',
            color: '#fff',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          style={{
            padding: '0.8rem 1.1rem',
            borderRadius: 10,
            background: input.trim() ? '#5d9eff' : '#2a2a2a',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
