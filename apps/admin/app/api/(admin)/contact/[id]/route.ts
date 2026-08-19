import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return await proxyToBackend(req, `/contact/${id}`, 'GET');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `Failed to get ${err}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return await proxyToBackend(req, `/contact/${id}`, 'DELETE');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `Failed to delete ${err}` },
      { status: 500 }
    );
  }
}
