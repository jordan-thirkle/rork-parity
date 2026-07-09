'use client';

import { useState, useRef, useEffect } from 'react';

export default function WorkspaceChat() {
  const [messages, setMessages] = useState<
    Array<{ id: string; role: 'user' | 'assistant'; text: string }>
  >([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Describe the game you want. You can also upload assets.',
    },
  ]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [supabase, setSupabase] = useState<ReturnType<typeof import('@/lib/supabase/client').createClient> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const { createClient } = await import('@/lib/supabase/client');
      if (!cancelled) setSupabase(createClient());
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;
    const el = document.getElementById('workspace-chat-end');
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  async function onSubmit(formData: FormData) {
    const text = String(formData.get('message') || '').trim();
    if (!text) return;
    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (!supabase) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', text: 'Upload not configured.' },
        ]);
        return;
      }
      const path = `uploads/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from('uploads').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: `Uploaded: ${data.publicUrl}` },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: 'Upload failed.' },
      ]);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <div className="flex flex-col h-[520px] rounded-lg border bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-md px-3 py-2 text-sm ${
              message.role === 'user'
                ? 'ml-auto bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-xs font-medium mb-1 opacity-70">{message.role}</p>
            <p>{message.text}</p>
          </div>
        ))}
        <div id="workspace-chat-end" />
      </div>

      <form ref={formRef} action={onSubmit} className="border-t p-3">
        <label className="flex items-center gap-2">
          <input
            type="file"
            className="text-sm"
            onChange={onFileChange}
            disabled={uploading}
          />
          {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
        </label>
        <div className="mt-2 flex gap-2">
          <input
            name="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your game..."
            className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
