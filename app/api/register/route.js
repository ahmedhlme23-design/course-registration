import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const { name, phone, governorate, city, street, college, grade } = await request.json();

    // التحقق الفعلي في الخلفية
    if (!name || !phone || !governorate || !city || !college || !grade) {
      return NextResponse.json({ error: 'جميع الحقول الأساسية مطلوبة' }, { status: 400 });
    }

    if (phone.length !== 11 || !/^\d+$/.test(phone)) {
      return NextResponse.json({ error: 'رقم الهاتف يجب أن يتكون من 11 رقماً بالضبط' }, { status: 400 });
    }

    // تجميع حقل العنوان
    const fullAddress = street 
      ? `محافظة ${governorate} - مدينة ${city} - شارع ${street}`
      : `محافظة ${governorate} - مدينة ${city}`;

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

    // 2. إدراج البيانات
    const result = await sql`
      INSERT INTO registrations (name, phone, address, college, grade)
      VALUES (${name}, ${phone}, ${fullAddress}, ${college}, ${grade})
      RETURNING id;
    `;

    const registrationId = result.rows[0].id;

    // 3. إرسال إشعار التليجرام
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const message = 
`🎯 *تسجيل جديد في الدورة!*
🔢 *رقم العملية:* #${registrationId}

👤 *الاسم:* ${name}
📞 *الهاتف:* ${phone}
📍 *العنوان:* ${fullAddress}
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