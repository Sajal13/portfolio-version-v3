import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, `/blogs/${id}`, 'GET');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, `/blogs/update/${id}`, 'PUT');
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return await proxyToBackend(req, `/blogs/delete/${id}`, 'DELETE');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
      { status: 500 }
    );
  }
}
