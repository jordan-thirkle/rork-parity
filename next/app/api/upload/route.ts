import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ files: [], error: 'Supabase not configured' });
  }
  const { data: files, error } = await supabase.storage.from('uploads').list('uploads', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const items =
    files?.map((file) => {
      const { data } = supabase.storage.from('uploads').getPublicUrl(`uploads/${file.name}`);
      return {
        name: file.name,
        size: file.metadata?.size ?? null,
        url: data.publicUrl,
        createdAt: file.created_at,
      };
    }) ?? [];

  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
