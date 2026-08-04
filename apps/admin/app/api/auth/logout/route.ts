import { NextRequest } from 'next/server';
import { proxyToBackend } from 'api/server-fetch';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/auth/logout', 'POST');
}
