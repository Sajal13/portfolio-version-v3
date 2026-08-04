import { NextRequest } from 'next/server';
import { proxyToBackend } from 'api/server-fetch';

export async function POST(req: NextRequest) {
  const body = await req
    .clone()
    .json()
    .catch(() => null);
  if (!body) {
    return Response.json({ message: 'Body is required.' }, { status: 400 });
  }

  return proxyToBackend(req, '/auth/login', 'POST');
}
