import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const pass = request.headers.get('x-admin-pass');
  if (pass !== '01029633610') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const result = await sql`SELECT * FROM tickets ORDER BY created_at DESC;`;
    return NextResponse.json({ tickets: result.rows }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ خادم' }, { status: 500 });
  }
}