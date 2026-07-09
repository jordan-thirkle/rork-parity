import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function updateSession() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => cookies().set(name, value));
        },
      },
    }
  );

  await supabase.auth.getSession();
  return supabase;
}
