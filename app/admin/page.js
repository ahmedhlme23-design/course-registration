'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState({});

  // تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '01029633610') {
      setIsAuthenticated(true);
      fetchTickets();
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  // جلب التذاكر
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tickets', {
        headers: { 'x-admin-pass': '01029633610' }
      });
      const data = await res.json();
      if (res.ok) setTickets(data.tickets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // إرسال الرد
  const handleSendReply = async (ticketId) => {
    const reply = replyText[ticketId];
    if (!reply) return;

    try {
      const res = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pass': '01029633610'
        },
        body: JSON.stringify({ ticketId, reply })
      });

      if (res.ok) {
        alert('تم إرسال الرد بنجاح!');
        fetchTickets();
      }
    } catch (err) {
      alert('حدث خطأ أثناء الرد');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans" dir="rtl">
        <form onSubmit={handleLogin} className="max-w-sm w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-center text-white">تسجيل دخول الإدارة</h2>
          
          {loginError && <div className="text-xs text-red-400 text-center bg-red-500/10 p-2 rounded">{loginError}</div>}

          <div>
            <label className="text-xs text-slate-400 block mb-1">اسم المستخدم</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm"
              required 
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">كلمة المرور</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm"
              required 
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl text-sm font-semibold">
            دخول البريد الإداري
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-white">لوحة رسائل وتذاكر البريد</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg">
            تسجيل الخروج
          </button>
        </div>

        {loading ? (
          <div>جاري جلب الرسائل...</div>
        ) : (
          <div className="space-y-4">
            {tickets.map((t) => (
              <div key={t.ticket_id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white">{t.name}</span>
                    <span className="text-xs text-slate-500 block">معرف التذكرة: #{t.ticket_id}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${t.reply ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {t.reply ? 'تم الرد' : 'معلقة'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl text-sm text-slate-300">
                  {t.message}
                </div>

                {t.reply ? (
                  <div className="bg-blue-600/10 border border-blue-500/20 p-3 rounded-xl text-sm text-blue-300">
                    <strong className="block text-xs text-blue-400">ردك (الأدمن):</strong>
                    {t.reply}
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    <textarea 
                      placeholder="اكتب رد الأدمن هنا..."
                      value={replyText[t.ticket_id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [t.ticket_id]: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={() => handleSendReply(t.ticket_id)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-medium"
                    >
                      إرسال الرد
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}