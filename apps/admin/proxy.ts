import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from 'lib/session';

const PROTECTED_PREFIX = '/admin';
const LOGIN_PATH = '/login';
const DEFAULT_AUTHED_PATH = '/admin/dashboard';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isRoot = pathname === '/';
  const isProtected = pathname.startsWith(PROTECTED_PREFIX) || isRoot;
  const isLoginPage = pathname === LOGIN_PATH;

  if (!isProtected && !isLoginPage) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // Valid access token -> authenticated for either page type.
  if (accessToken) {
    try {
      await verifySession(accessToken);
      if (isLoginPage || isRoot) {
        return NextResponse.redirect(new URL(DEFAULT_AUTHED_PATH, req.url));
      }
      return NextResponse.next(); // already on a protected page, fine as-is
    } catch {
      // expired or invalid signature — fall through
    }
  }

  // No valid access token, but a refresh token exists — treat as "probably
  // still has a session", let the layout sort out the actual refresh.
  if (refreshToken) {
    if (isRoot || isLoginPage) {
      return NextResponse.redirect(new URL(DEFAULT_AUTHED_PATH, req.url));
    }
    return NextResponse.next();
  }

  // No tokens at all. If we're already on /login, this is exactly where
  // an unauthenticated visitor should land — let it through, don't
  // redirect to itself.
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Any other protected page with zero session -> send to login.
  const loginUrl = new URL(LOGIN_PATH, req.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/', '/admin/:path*', '/login']
};
