import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, proxyToBackend } from '@repo/api-client';

export async function GET() {
  try {
    return await backendFetch(`/blog-category`, {
      method: 'GET'
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: `Failed to fetch blog categories: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await proxyToBackend(req, '/blog-category/create', 'POST');
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: `Failed to create blog category: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    );
  }
}
