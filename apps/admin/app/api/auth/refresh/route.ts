import { NextRequest } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/auth/refresh', 'POST');
}
