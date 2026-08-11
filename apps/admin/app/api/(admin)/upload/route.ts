import { NextRequest } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/upload', 'POST');
}
