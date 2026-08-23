import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from 'lib/session';

const PROTECTED_PREFIX = '/admin';
const LOGIN_PATH = '/login';
const DEFAULT_AUTHED_PATH = '/admin/dashboard';

const withNoStore = (res: NextResponse, isProtected: boolean) => {
  if (isProtected) {
    res.headers.set('Cache-Control', 'no-store, must-revalidate');
  }
  return res;
};

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

  if (accessToken) {
    try {
      await verifySession(accessToken);
      if (isLoginPage || isRoot) {
        return withNoStore(
          NextResponse.redirect(new URL(DEFAULT_AUTHED_PATH, req.url)),
          isProtected
        );
      }
      return withNoStore(NextResponse.next(), isProtected);
    } catch {
      // expired or invalid signature — fall through
    }
  }

  // No valid access token, but a refresh token exists — treat as "probably
  // still has a session", let the layout sort out the actual refresh.
  if (refreshToken) {
    if (isRoot || isLoginPage) {
      return withNoStore(
        NextResponse.redirect(new URL(DEFAULT_AUTHED_PATH, req.url)),
        isProtected
      );
    }
    return withNoStore(NextResponse.next(), isProtected);
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
