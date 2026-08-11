import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const pass = request.headers.get('x-admin-pass');
  if (pass !== '01029633610') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const { ticketId, reply } = await request.json();

    await sql`
      UPDATE tickets 
      SET reply = ${reply}, status = 'replied', replied_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ${ticketId};
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Admin reply error:', err);
    return NextResponse.json({ error: 'خطأ خادم' }, { status: 500 });
  }
}