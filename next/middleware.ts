import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const isAuthPage = url.pathname.startsWith('/login');

  const supabase = await updateSession();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const hasSession = !!session;

  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', url));
  }

  if (hasSession && url.pathname === '/login') {
    return NextResponse.redirect(new URL('/workspace', url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};
