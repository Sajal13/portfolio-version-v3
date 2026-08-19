import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET() {
  try {
    return backendFetch('/testimonials', {
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
    return await proxyToBackend(req, '/testimonials/create', 'POST');
  } catch (err) {
    return NextResponse.json(
      { stats: 500, message: `Failed to post testimonials: ${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/testimonials/update-position', 'PUT');
  } catch (err) {
    return NextResponse.json(
      { stats: 500, message: `Failed to update testimonials: ${err}` },
      { status: 500 }
    );
  }
}
