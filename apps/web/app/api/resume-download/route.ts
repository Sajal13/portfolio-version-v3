import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_URL;

export async function GET() {
  const backendRes = await fetch(`${BACKEND_URL}/upload/resume/download`, {
    method: 'GET',
    cache: 'no-store'
  });

  if (!backendRes.ok || !backendRes.body) {
    return NextResponse.json(
      { message: 'Resume not found' },
      { status: backendRes.status }
    );
  }

  return new NextResponse(backendRes.body, {
    status: 200,
    headers: {
      'Content-Type':
        backendRes.headers.get('Content-Type') ?? 'application/pdf',
      'Content-Disposition':
        backendRes.headers.get('Content-Disposition') ??
        'attachment; filename="resume.pdf"'
    }
  });
}
