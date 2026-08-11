import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
  }

  try {
    const result = await sql`
      SELECT ticket_id, name, message, reply, status, created_at FROM tickets WHERE ticket_id = ${id};
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'التذكرة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({ ticket: result.rows[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}