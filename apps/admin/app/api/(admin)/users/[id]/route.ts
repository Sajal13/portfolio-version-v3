import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@repo/api-client';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return await proxyToBackend(req, `/users/delete/${id}`, 'DELETE');
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: `Failed to delete user: ${error}` },
      { status: 500 }
    );
  }
}
