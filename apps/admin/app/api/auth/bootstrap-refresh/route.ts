import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from 'api/server-fetch';

// Only reachable from the admin layout's redirect above — re-runs the
// refresh (cheap, single call) so this Route Handler can actually set
// the resulting Set-Cookie, then redirects into the admin section.
export async function GET(req: NextRequest) {
  const res = await proxyToBackend(req, '/auth/refresh', 'POST');
  const redirectRes = NextResponse.redirect(
    new URL('/admin/dashboard', req.url)
  );
  res.headers
    .getSetCookie()
    .forEach((c) => redirectRes.headers.append('Set-Cookie', c));
  return redirectRes;
}
