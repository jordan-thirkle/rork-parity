import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);

  const isAuthPage = url.pathname.startsWith('/login') || url.pathname.startsWith('/signup');
  const isApiAuth = url.pathname.startsWith('/api/auth');
  const isProtected = ['/workspace', '/gallery', '/team'].some(path => url.pathname.startsWith(path));

  if (isAuthPage || isApiAuth) {
    return NextResponse.next();
  }

  if (isProtected) {
    const sessionCookie = request.cookies.get('rorkparity_session')?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/upload|api/checkout|api/generate).*)'],
};
