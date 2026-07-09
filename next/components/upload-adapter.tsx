'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

export function UploadAdapter({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const onFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        alert('File exceeds 5GB limit');
        return;
      }
      setUploading(true);
      try {
        if (!supabase) {
          alert('Upload not configured');
          return;
        }
        const path = `uploads/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage.from('uploads').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw error;
        const { data } = supabase.storage.from('uploads').getPublicUrl(path);
        onUploaded(data.publicUrl);
      } catch (err) {
        alert('Upload failed');
      } finally {
        setUploading(false);
        event.target.value = '';
      }
    },
    [onUploaded, supabase]
  );

  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="file" onChange={onFileChange} disabled={uploading} />
      {uploading && <span>Uploading...</span>}
    </label>
  );
}
