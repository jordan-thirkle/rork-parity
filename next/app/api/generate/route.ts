import { NextRequest, NextResponse } from 'next/server';
import { deductCredits, getCreditBalance } from '@/lib/credits';
import { createExpoProject } from '@/generators/expo-generator';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt || '').trim();
  const userId = String(body.userId || '').trim();
  if (!prompt || !userId) {
    return NextResponse.json({ error: 'Missing prompt or userId' }, { status: 400 });
  }

  const balance = await getCreditBalance(userId);
  if (!balance) {
    return NextResponse.json({ error: 'Credit balance unavailable' }, { status: 403 });
  }
  const cost = 1;
  if (balance.credits < cost) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
  }

  const ok = await deductCredits(userId, cost, `generate: ${prompt.slice(0, 40)}`);
  if (!ok) {
    return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 });
  }

  try {
    const projectPath = await createExpoProject({ prompt });
    return NextResponse.json({ projectPath, creditsRemaining: balance.credits - cost });
  } catch (err) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
