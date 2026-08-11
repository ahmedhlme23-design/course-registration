import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { name, phone, address, college, grade } = await request.json();

    if (!name || !phone || !address || !college || !grade) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    // 1. إنشاء الجدول إن لم يكن موجوداً
    await sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        college VARCHAR(255) NOT NULL,
        grade VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. إدراج البيانات مع إرجاع الرقم التسلسلي (id) الجديد
    const result = await sql`
      INSERT INTO registrations (name, phone, address, college, grade)
      VALUES (${name}, ${phone}, ${address}, ${college}, ${grade})
      RETURNING id;
    `;

    // استخراج رقم العملية التسلسلي
    const registrationId = result.rows[0].id;

    // 3. إرسال التنبيه لجروب التليجرام مضافاً إليه رقم العملية
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const message = 
`🎯 *تسجيل جديد في الدورة!*
🔢 *رقم العملية:* #${registrationId}

👤 *الاسم:* ${name}
📞 *الهاتف:* ${phone}
📍 *العنوان:* ${address}
🎓 *الكلية:* ${college}
📊 *التقدير العام:* ${grade}`;

      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      });
    }

    return NextResponse.json({ 
      message: 'تم التسجيل بنجاح', 
      registrationId: registrationId 
    }, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}