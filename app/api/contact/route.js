import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { name, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json({ error: 'الاسم ونص الرسالة مطلوبان' }, { status: 400 });
    }

    // 1. إنشاء جدول التذاكر إن لم يكن موجوداً
    await sql`
      CREATE TABLE IF NOT EXISTS tickets (
        ticket_id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        reply TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        replied_at TIMESTAMP WITH TIME ZONE
      );
    `;

    // توليد معرف فريد عشوائي للتذكرة (UUID)
    const ticketId = uuidv4().substring(0, 8); // استخدام 8 خانات فريدة للسهولة
    const ticketUrl = `${request.headers.get('origin') || 'https://' + request.headers.get('host')}/ticket/${ticketId}`;

    // 2. حفظ التذكرة
    await sql`
      INSERT INTO tickets (ticket_id, name, message)
      VALUES (${ticketId}, ${name}, ${message});
    `;

    // 3. التوقيت والتاريخ
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('ar-EG', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);

    const formattedTime = new Intl.DateTimeFormat('ar-EG', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now);

    // 4. إرسال إلى بوت التليجرام (يمكنك استخدام نفس البوت أو بوت جديد عبر البيئة)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const telegramMsg = 
`📩 *رسالة تواصل جديدة!*
🎫 *رقم التذكرة:* \`${ticketId}\`

👤 *المرسل:* ${name}
💬 *الرسالة:* 
${message}

🔗 *رابط متابعة التذكرة:*
${ticketUrl}

📅 *التاريخ:* ${formattedDate}
⏰ *الوقت:* ${formattedTime}`;

      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: telegramMsg,
        parse_mode: 'Markdown',
      });
    }

    return NextResponse.json({ 
      success: true, 
      ticketId, 
      ticketUrl 
    }, { status: 200 });

  } catch (error) {
    console.error('Contact Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}