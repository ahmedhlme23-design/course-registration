'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    college: '',
    grade: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.value ? e.target.name : e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: 'تم التسجيل بنجاح! شكرًا لك.' });
        setFormData({ name: '', phone: '', address: '', college: '', grade: '' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'حدث خطأ ما، يرجى المحاولة لاحقاً.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'تعذر الاتصال بالخادم.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">استمارة التسجيل في الدورة</h1>
        <p className="text-slate-500 text-center text-sm mb-6">قم بتعبئة البيانات التالية لإتمام عملية التسجيل</p>

        {status.msg && (
          <div className={`p-3 rounded-lg mb-4 text-sm text-center ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الاسم بالكامل</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل اسمك الثلاثي"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="01xxxxxxxx"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">العنوان</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="المدينة / المحافظة"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الكلية</label>
            <input
              type="text"
              name="college"
              required
              value={formData.college}
              onChange={handleChange}
              placeholder="اسم الكلية والتخصص"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">التقدير العام</label>
            <select
              name="grade"
              required
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              <option value="">اختر التقدير</option>
              <option value="امتياز">امتياز</option>
              <option value="جيد جداً">جيد جداً</option>
              <option value="جيد">جيد</option>
              <option value="مقبول">مقبول</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'جاري إرسال البيانات...' : 'تأكيد التسجيل'}
          </button>
        </form>
      </div>
    </main>
  );
}