import { NextRequest, NextResponse } from 'next/server';
import { api } from 'api/base';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json({
        status: 400,
        message: 'Body is required.'
      });

      const res = await api.post('/auth/login', {
        body: JSON.stringify(body)
      });
    }
  } catch {}
}
