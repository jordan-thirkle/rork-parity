import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function middleware(request: Request) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthPage = request.url.includes('/login');
  const isApiAuth = request.url.includes('/api/auth');

  if (isAuthPage || isApiAuth) {
    if (session) {
      return NextResponse.redirect(new URL('/workspace', request.url));
    }
    return NextResponse.next();
  }

  const protectedPaths = ['/workspace', '/gallery', '/team'];
  const isProtected = protectedPaths.some(path => request.url.includes(path));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
