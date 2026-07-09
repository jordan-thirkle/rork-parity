import { NextResponse } from 'next/server';
import { updateSession } from '../lib/supabase/server';
import { generateExpoProject, validateExpoProject } from '../generators/expo-generator';
import { deductCredits } from '../lib/credits';

export const dynamic = 'force-dynamic';

const GENERATION_COST = 1;

export async function POST(request: Request) {
  try {
    const supabase = await updateSession(request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const projectId = typeof body.projectId === 'string' ? body.projectId : null;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const deducted = await deductCredits(supabase, session.user.id, GENERATION_COST, 'generation', projectId ?? undefined);
    if (!deducted) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    const result = generateExpoProject(prompt);

    const validation = validateExpoProject(result.outputPath);
    if (!validation.valid) {
      return NextResponse.json({ error: 'Generated project failed validation', details: validation.errors }, { status: 500 });
    }

    const artifactName = `${projectId ?? 'project'}-${Date.now()}.zip`;

    return NextResponse.json({
      outputPath: result.outputPath,
      artifactName,
      files: result.files,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
