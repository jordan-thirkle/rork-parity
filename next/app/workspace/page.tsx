'use client';

import WorkspaceChat from '@/components/workspace-chat';

export default function Workspace() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Workspace</h1>
            <p className="text-sm text-neutral-400">
              Chat to generate native apps. Upload files, describe your app, and export to iOS/Android.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="min-h-[520px] rounded-xl border border-neutral-800 bg-neutral-900/50">
            <WorkspaceChat />
          </div>

          <div className="min-h-[520px] rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex h-full items-center justify-center text-neutral-500">
              <div className="text-center">
                <p className="text-sm">Preview will appear here</p>
                <p className="mt-1 text-xs text-neutral-600">Expo Go QR / web preview / device frame</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
