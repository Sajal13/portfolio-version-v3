import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET() {
  return backendFetch('/skills', {
    method: 'GET'
  });
}

export async function POST(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/skills/create', 'POST');
  } catch (err) {
    return NextResponse.json(
      { stats: 500, message: `Failed to post skills: ${err}` },
      { status: 500 }
    );
  }
}
