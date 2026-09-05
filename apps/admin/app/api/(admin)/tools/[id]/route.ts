import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return proxyToBackend(req, `/tools/${id}`, 'GET');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
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
    return proxyToBackend(req, `/tools/update/${id}`, 'PUT');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
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
    return proxyToBackend(req, `/tools/delete/${id}`, 'DELETE');
  } catch (err) {
    return NextResponse.json(
      { status: 500, message: `${err}` },
      { status: 500 }
    );
  }
}
