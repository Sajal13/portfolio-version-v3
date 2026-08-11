import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET() {
  return await backendFetch('/blogs', {
    method: 'GET'
  });
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, '/blogs/create', 'POST');
}
