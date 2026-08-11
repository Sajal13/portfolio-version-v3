import { NextRequest } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

// Routes that should NOT go through this generic proxy — auth has its
// own dedicated handlers (login/verify-otp/refresh/logout) because those
// need custom body validation before forwarding. Everything else falls
// through to here.
const RESERVED_PREFIXES = [
  'auth/login',
  'auth/verify-otp',
  'auth/refresh',
  'auth/logout'
];

function buildBackendPath(segments: string[], search: string) {
  return `/${segments.join('/')}${search}`;
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const joined = path.join('/');

  if (RESERVED_PREFIXES.some((p) => joined.startsWith(p))) {
    return Response.json({ message: 'Not found' }, { status: 404 });
  }

  const backendPath = buildBackendPath(path, req.nextUrl.search);
  return proxyToBackend(req, backendPath, req.method);
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE
};
