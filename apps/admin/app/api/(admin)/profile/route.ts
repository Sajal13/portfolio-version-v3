import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET() {
  try {
    return backendFetch('/profile', {
      method: 'GET'
    });
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/profile/create', 'POST');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/profile/update', 'PUT');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
      { status: 500 }
    );
  }
}
