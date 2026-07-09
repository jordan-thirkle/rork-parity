'use client';

import { useState } from 'react';
import WorkspaceChat from '@/components/workspace-chat';
import { UploadAdapter } from '@/components/upload-adapter';

export default function WorkspacePage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Workspace</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="flex flex-col gap-4">
          <WorkspaceChat />
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Assets</h2>
              <UploadAdapter
                onUploaded={(url) => {
                  setPreviewUrl(url);
                }}
              />
            </div>
            {previewUrl && (
              <div className="mt-3 text-sm text-gray-700 break-all">
                <span className="font-medium">Uploaded:</span> {previewUrl}
              </div>
            )}
          </div>
        </section>
        <section className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="border-b px-4 py-2 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700">Preview</h2>
            <span className="text-xs text-gray-500">rork-parity</span>
          </div>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="w-full h-[520px] object-contain bg-black"
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center text-gray-500 text-sm">
              Upload an asset to preview
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
