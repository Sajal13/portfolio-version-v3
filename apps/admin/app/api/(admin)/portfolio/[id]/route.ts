import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return backendFetch(`/portfolio/${id}`, {
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
    return await proxyToBackend(req, `/portfolio/update/${id}`, 'PUT');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `Failed to put portfolio: ${err}` },
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
    return await proxyToBackend(req, `/portfolio/delete/${id}`, 'DELETE');
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: `Failed to delete portfolio: ${error}` },
      { status: 500 }
    );
  }
}
