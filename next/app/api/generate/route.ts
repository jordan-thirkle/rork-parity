import { NextRequest, NextResponse } from 'next/server';
import { deductCredits, getCreditBalance } from '@/lib/credits';
import { createExpoProject } from '@/generators/expo-generator';
import { updateSession } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const session = await updateSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  try {
    const balance = await getCreditBalance(userId);
    if (balance < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    const newBalance = await deductCredits(userId, 1);
    const result = await createExpoProject(prompt, '/tmp/rork-parity');

    return NextResponse.json({
      ok: true,
      projectDir: result.projectDir,
      valid: result.valid,
      remainingCredits: newBalance,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
