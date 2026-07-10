import { NextRequest, NextResponse } from 'next/server';
import { getUser, decrementCredits } from '@/lib/db/queries';
import { generateGame } from '@/generators/game-generator';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Read session cookie directly (cred-based auth) — no Supabase client needed.
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt || '').trim();
  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  const current = user.credits ?? 0;
  if (current <= 0) {
    return NextResponse.json({ error: 'out_of_credits' }, { status: 402 });
  }

  let remaining: number;
  try {
    remaining = await decrementCredits(user.id, 1);
  } catch (err) {
    return NextResponse.json({ error: 'out_of_credits' }, { status: 402 });
  }

  try {
    const html = generateGame(prompt);
    return NextResponse.json({ html, creditsRemaining: remaining });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
