import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    return await backendFetch(`/blog-category/${id}`, {
      method: 'GET'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: `Failed to fetch blog category with id ${await params}: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
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
    return await proxyToBackend(req, `/blog-category/update/${id}`, 'PUT');
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: `Failed to update blog category: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
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
    return await proxyToBackend(req, `/blog-category/delete/${id}`, 'DELETE');
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: `Failed to delete blog category: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    );
  }
}
