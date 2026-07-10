import { getUser } from '@/lib/db/queries';

export async function GET() {
  const user = await getUser();
  if (!user) {
    return Response.json({ user: null });
  }

  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits ?? 0,
    },
  });
}
