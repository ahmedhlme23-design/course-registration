'use client';
import { useState } from 'react';

// قائمة محافظات ومدن مصر
const EGYPT_DATA = {
  "القاهرة": ["مدينة نصر", "مصر الجديدة", "المعادي", "الزمالك", "حلوان", "التجمع الخامس", "الشروق", "بدر", "شبرا"],
  "الجيزة": ["الدقي", "العجوزة", "المهندسين", "الهرم", "فيصل", "6 أكتوبر", "الشيخ زايد", "العياط", "البدرشين"],
  "الإسكندرية": ["سيدي بشر", "سموحة", "المنتزه", "محرم بك", "العجمي", "ميامي", "ستانلي", "العامرة"],
  "الدقهلية": ["المنصورة", "ميت غمر", "أجلو", "طلخا", "دكرنس", "سنبلاوين", "بلقاس", "شربين"],
  "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "أبو حماد", "فقوس", "هيها", "ديرب نجم", "أبو كبير"],
  "القليوبية": ["بنها", "شبرا الخيمة", "القناطر الخيرية", "الخانكة", "قليوب", "طوخ", "شبين القناطر"],
  "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوّه", "مطوبس", "بيلا", "قلين", "الحامول", "سيدي سالم"],
  "الغربية": ["طنطا", "المحلة الكبرى", "زفتى", "سمنود", "كفر الزيات", "بسيون", "قطور"],
  "المنوفية": ["شبين الكوم", "منوف", "أشمون", "السادات", "تلا", "قويسنا", "الشهداء"],
  "البحيرة": ["دمنهور", "كفر الدوار", "إيتاي البارود", "أبو حمص", "حوش عيسى", "رشيد", "كوم حمادة"],
  "دمياط": ["دمياط", "دمياط الجديدة", "رأس البر", "فارسكور", "الزرقا", "كفر سعد"],
  "بورسعيد": ["حي الشرق", "حي العرب", "حي المناخ", "حي الزهور", "بورفؤاد"],
  "الإسماعيلية": ["الإسماعيلية", "القنطرة شرق", "القنطرة غرب", "التل الكبير", "فايد"],
  "السويس": ["السويس", "الأربعين", "عتاقة", "فيصل"],
  "الفيوم": ["الفيوم", "سنورس", "إطسا", "طامية", "أبشواي"],
  "بني سويف": ["بني سويف", "الواسطى", "ناصر", "ببا", "الفشن", "إهناسيا"],
  "المنيا": ["المنيا", "ملوي", "بني مزار", "سمالوط", "مغاغة", "أبو قرقاص"],
  "أسيوط": ["أسيوط", "ديروط", "القوصية", "أبنوب", "منفلوط", "أبو تيج"],
  "سوهاج": ["سوهاج", "أخميم", "جرجا", "طهطا", "البلينا", "المراغة"],
  "قنا": ["قنا", "نجع حمادي", "قوص", "دشنا", "أبو تشت"],
  "الأقصر": ["الأقصر", "إسنا", "أرمنت", "القرنة"],
  "أسوان": ["أسوان", "كوم أمبو", "إدفو", "نصر النوبة"],
  "مطروح": ["مرسى مطروح", "العلمين", "الضبعة", "سيوة"],
  "البحر الأحمر": ["الغردقة", "سفاجا", "القصير", "مارسا علم", "رأس غارب"],
  "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة"],
  "شمال سيناء": ["العريش", "الشيخ زويد", "رفح"],
  "جنوب سيناء": ["شرم الشيخ", "دهب", "نويبع", "طور سيناء", "راس سدر"]
};

// قائمة الكليات الشهيرة بمصر
const COLLEGES_LIST = [
  "كلية الهندسة", "كلية الحاسبات والمعلومات / الذكاء الاصطناعي", "كلية الطب البشري", 
  "كلية طب الأسنان", "كلية الصيدلة", "كلية العلاج الطبيعي", "كلية التمريض", 
  "كلية العلوم", "كلية التجارة / إدارة الأعمال", "كلية الحقوق", "كلية الآداب", 
  "كلية التربية", "كلية التربية الرياضية", "كلية التربية النوعية", "كلية الألسن", 
  "كلية اللغات والترجمة", "كلية الإعلام", "كلية الاقتصاد والعلوم السياسية", 
  "كلية الفنون الجميلة", "كلية الفنون التطبيقية", "كلية الزراعة", "كلية الطب البيطري", 
  "كلية السياحة والفنادق", "كلية الأثريات", "كلية التكنولوجيا والتنمية", 
  "المعهد العالي للتكنولوجيا / الهندسة", "أخرى"
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    city: '',
    street: '',
    college: '',
    grade: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // معالجة تغيير رقم الهاتف (قبول الأرقام فقط والحد عند 11 رقم)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // حذف أي رمز غير رقمي
    if (value.length <= 11) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // إعادة تعيين المدينة عند تغيير المحافظة
    if (name === 'governorate') {
      setFormData({ ...formData, governorate: value, city: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    // التحقق من رقم الهاتف قبل الإرسال
    if (formData.phone.length < 11) {
      setStatus({ type: 'error', msg: 'يجب أن يتكون رقم الهاتف من 11 رقماً بالكامل.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: `تم التسجيل بنجاح! رقم العملية: #${data.registrationId}` });
        setFormData({ name: '', phone: '', governorate: '', city: '', street: '', college: '', grade: '' });
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
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 border border-slate-100 my-8">
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
          {/* الاسم */}
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

          {/* رقم الهاتف */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف (11 رقم)</label>
            <input
              type="text"
              inputMode="numeric"
              name="phone"
              required
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="01xxxxxxxxx"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            <span className="text-xs text-slate-400 mt-1 block">الأرقام المدخلة: {formData.phone.length} / 11</span>
          </div>

          {/* المحافظة */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">المحافظة</label>
            <select
              name="governorate"
              required
              value={formData.governorate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              <option value="">اختر المحافظة</option>
              {Object.keys(EGYPT_DATA).map((gov) => (
                <option key={gov} value={gov}>{gov}</option>
              ))}
            </select>
          </div>

          {/* المدينة */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">المدينة / المركز</label>
            <select
              name="city"
              required
              disabled={!formData.governorate}
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white disabled:bg-slate-100"
            >
              <option value="">اختر المدينة</option>
              {formData.governorate && EGYPT_DATA[formData.governorate].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* الشارع (اختياري) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم الشارع / تفاصيل العنوان <span className="text-slate-400 font-normal">(اختياري)</span></label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="أدخل الشارع أو المعلم القريب"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* الكلية */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الكلية / المعهد</label>
            <select
              name="college"
              required
              value={formData.college}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              <option value="">اختر الكلية</option>
              {COLLEGES_LIST.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {/* التقدير العام */}
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