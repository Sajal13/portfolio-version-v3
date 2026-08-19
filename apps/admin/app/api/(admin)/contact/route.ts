import { NextRequest } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/contact', 'GET');
}
