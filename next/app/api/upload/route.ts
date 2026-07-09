import { NextResponse } from 'next/server';
import { updateSession } from '../lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await updateSession(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    const allowed = new Set([
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml',
      'application/json',
      'text/plain',
      'application/zip',
    ]);

    if (!allowed.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large', maxSize }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage.from('uploads').upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ path: filePath, name: file.name, size: file.size });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
