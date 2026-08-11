import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

async function ensureTicketsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS tickets (
      ticket_id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      reply TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      replied_at TIMESTAMP WITH TIME ZONE,
      telegram_username VARCHAR(255),
      telegram_chat_id VARCHAR(100),
      source VARCHAR(50) DEFAULT 'web'
    );
  `;

  await sql`
    ALTER TABLE tickets
    ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(255),
    ADD COLUMN IF NOT EXISTS telegram_chat_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'web';
  `;
}

async function sendTelegramMessage(chatId, text) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) return;

  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  });
}

export async function POST(request) {
  try {
    const update = await request.json();
    const message = update.message;
    const chatId = message?.chat?.id;
    const text = message?.text || '';
    const fromName = message?.from?.first_name || message?.from?.username || 'مستخدم';
    const senderUsername = message?.from?.username || null;

    if (!message || !chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    const normalizedText = text.trim();

    if (normalizedText.startsWith('@')) {
      const parts = normalizedText.split(/\s+/);
      const ticketId = parts[0].replace('@', '').trim();
      const replyText = parts.slice(1).join(' ').trim();

      if (!ticketId || !replyText) {
        await sendTelegramMessage(chatId, '⚠️ استخدم الشكل: @رقم_التذكرة رسالتك');
        return NextResponse.json({ ok: true });
      }

      await ensureTicketsTable();

      const result = await sql`
        SELECT * FROM tickets WHERE ticket_id = ${ticketId} LIMIT 1;
      `;

      if (result.rows.length === 0) {
        await sendTelegramMessage(chatId, '❌ لم يتم العثور على هذه التذكرة.');
        return NextResponse.json({ ok: true });
      }

      const ticket = result.rows[0];

      await sql`
        UPDATE tickets
        SET reply = ${replyText}, status = 'replied', replied_at = CURRENT_TIMESTAMP
        WHERE ticket_id = ${ticketId};
      `;

      await sendTelegramMessage(chatId, `✅ تم حفظ الرد في التذكرة #${ticketId} وسيظهر للمستخدم في صفحة التذكرة.`);

      return NextResponse.json({ ok: true });
    }

    if (normalizedText.startsWith('/start')) {
      await sendTelegramMessage(chatId, `مرحبا ${fromName}!\nأرسل رسالتك وسأحولها إلى الإدارة.\nلإرسال رد على تذكرة استخدم: @رقم_التذكرة رسالتك`);
      return NextResponse.json({ ok: true });
    }

    await ensureTicketsTable();

    const ticketId = uuidv4().substring(0, 8);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${request.headers.get('host')}`;
    const ticketUrl = `${baseUrl}/ticket/${ticketId}`;

    await sql`
      INSERT INTO tickets (ticket_id, name, message, telegram_username, telegram_chat_id, source)
      VALUES (${ticketId}, ${fromName}, ${normalizedText}, ${senderUsername || null}, ${String(chatId)}, 'telegram');
    `;

    const telegramMessage = `📩 *رسالة جديدة من التيليجرام!*\n🎫 *رقم التذكرة:* \`${ticketId}\`\n👤 *المرسل:* ${fromName}\n💬 *الرسالة:*\n${normalizedText}\n\n🔗 *رابط متابعة التذكرة:*\n${ticketUrl}\n\n📌 *للرد على هذه التذكرة عبر التيليجرام:*\nاكتب \`@${ticketId} رسالتك\``;

    await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, telegramMessage);
    await sendTelegramMessage(chatId, `تم استلام رسالتك بنجاح. رقم التذكرة: #${ticketId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Telegram webhook active' });
}
