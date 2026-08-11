'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function TicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/ticket?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          setError(data.error || 'تعذر العثور على التذكرة');
        }
      } catch (err) {
        setError('خطأ في الاتصال');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">جاري تحميل بيانات التذكرة...</div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400 text-center max-w-md w-full">
          ❌ {error || 'التذكرة غير موجودة'}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-white">تذكرة الدعم رقم: #{ticket.ticket_id}</h1>
            <p className="text-xs text-slate-400 mt-1">المرسل: {ticket.name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            ticket.reply ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
          }`}>
            {ticket.reply ? 'تم الرد' : 'قيد الانتظار'}
          </span>
        </div>

        {/* رسالة المستخدم */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">نص رسالتك:</label>
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-slate-200 text-sm leading-relaxed">
            {ticket.message}
          </div>
        </div>

        {/* رد الإدارة */}
        <div className="space-y-2 pt-2">
          <label className="text-xs text-slate-400 font-medium">رد الإدارة (الأدمن):</label>
          {ticket.reply ? (
            <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-xl text-blue-200 text-sm leading-relaxed">
              <span className="block font-bold text-blue-400 text-xs mb-1">👑 الأدمن:</span>
              {ticket.reply}
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl text-slate-500 text-sm text-center">
              لم يتم الرد على رسالتك بعد، يرجى الاحتفاظ بـ رابط هذه الصفحة والرجوع إليها لاحقاً.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}