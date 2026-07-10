import { NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { generateExpoProject } from '@/generators/expo-generator';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt : '';

    if (!prompt.trim()) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const files = generateExpoProject(prompt);

    return NextResponse.json({ files });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Export failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
