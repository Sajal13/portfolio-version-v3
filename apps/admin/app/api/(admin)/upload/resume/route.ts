import { NextRequest } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function GET(request: NextRequest) {
  return proxyToBackend(request, '/upload/resume', 'GET');
}
