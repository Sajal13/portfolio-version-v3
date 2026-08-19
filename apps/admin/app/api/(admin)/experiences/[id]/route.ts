import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return backendFetch(`/experiences/${id}`, {
      method: 'GET'
    });
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `Failed to Get portfolio: ${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return await proxyToBackend(req, `/experiences/update/${id}`, 'PUT');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `Failed to put experiences: ${err}` },
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
    return await proxyToBackend(req, `/experiences/delete/${id}`, 'DELETE');
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: `Failed to delete experiences: ${error}` },
      { status: 500 }
    );
  }
}
