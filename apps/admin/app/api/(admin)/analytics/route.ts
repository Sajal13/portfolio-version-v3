import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function GET(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/analytics/summary', 'GET');
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: `Failed to get summary: ${error}` },
      { status: 500 }
    );
  }
}
