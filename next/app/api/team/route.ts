import { eq } from 'drizzle-orm';
import { getTeamForUser, getUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { invitations, teamMembers, users } from '@/lib/db/schema';

export async function GET() {
  const team = await getTeamForUser();
  return Response.json(team);
}

export async function POST(req: Request) {
  const user = await getUser();
  const team = await getTeamForUser();
  if (!user || !team) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  let email = '';
  try {
    const body = await req.json();
    email = (body.email || '').toString().trim().toLowerCase();
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: 'invalid_email' }, { status: 400 });
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    const already = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.userId, existing.id),
    });
    if (already) {
      return Response.json({ error: 'already_member' }, { status: 409 });
    }
    await db.insert(teamMembers).values({
      userId: existing.id,
      teamId: team.id,
      role: 'member',
    });
    return Response.json({ ok: true, added: existing.email });
  }

  const pending = await db.query.invitations.findFirst({
    where: eq(invitations.email, email),
  });
  if (!pending) {
    await db.insert(invitations).values({
      teamId: team.id,
      email,
      role: 'member',
      invitedBy: user.id,
    });
  }
  return Response.json({ ok: true, invited: email });
}
