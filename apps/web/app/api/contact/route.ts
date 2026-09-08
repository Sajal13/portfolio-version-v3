import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@repo/api-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return await backendFetch('/contact', {
      method: 'POST',
      contentType: 'application/json',
      body: JSON.stringify(body)
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: `Failed to post message: ${error}` },
      { status: 500 }
    );
  }
}
