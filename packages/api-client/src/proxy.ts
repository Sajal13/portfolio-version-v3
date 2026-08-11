import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from './core';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Response headers worth relaying beyond content-type — add more here
// (e.g. 'content-length') only if something downstream actually needs them.
const FORWARDED_RESPONSE_HEADERS = ['content-disposition'];

export async function proxyToBackend(req: NextRequest, path: string, method: string): Promise<NextResponse> {
  const cookieHeader = req.headers.get('cookie') ?? '';
  const contentType = req.headers.get('content-type');
  const hasBody = !['GET', 'HEAD'].includes(method);

  // Double-submit CSRF: read the non-HttpOnly csrfToken cookie server-side
  // and echo it as the header Nest's CsrfGuard expects.
  const csrfToken = req.cookies.get('csrfToken')?.value;

  const backendRes = await backendFetch(path, {
    method,
    contentType,
    headers: {
      cookie: cookieHeader,
      ...(MUTATING_METHODS.has(method) && csrfToken ? { 'x-csrf-token': csrfToken } : {})
    },
    body: hasBody ? req.body : undefined
    // no `cache` → no-store, correct: this is a live auth exchange, never cached
  });

  const setCookieHeaders = backendRes.headers.getSetCookie?.() ?? [];
  const resContentType = backendRes.headers.get('content-type') ?? '';

  const relayHeaders = (target: NextResponse) => {
    setCookieHeaders.forEach((c) => target.headers.append('Set-Cookie', c));
    FORWARDED_RESPONSE_HEADERS.forEach((h) => {
      const value = backendRes.headers.get(h);
      if (value) target.headers.set(h, value);
    });
  };

  if (resContentType.includes('application/json')) {
    const data = await backendRes.json().catch(() => null);
    const nextRes = NextResponse.json(data, { status: backendRes.status });
    relayHeaders(nextRes);
    return nextRes;
  }

  // Binary passthrough: PDFs, any Cloudinary-proxied bytes, etc.
  const buffer = await backendRes.arrayBuffer();
  const nextRes = new NextResponse(buffer, {
    status: backendRes.status,
    headers: resContentType ? { 'content-type': resContentType } : undefined
  });
  relayHeaders(nextRes);
  return nextRes;
}