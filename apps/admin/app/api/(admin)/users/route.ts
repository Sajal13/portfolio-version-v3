import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function GET(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/users', 'GET');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `Failed to get Users ${err}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/auth/change-password', 'PATCH');
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: `Failed to update password ${error}` },
      { status: 500 }
    );
  }
}
