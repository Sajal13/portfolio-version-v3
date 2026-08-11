import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET() {
  try {
    return await backendFetch('/tools');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/tools/create', 'POST');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
      { status: 500 }
    );
  }
}
