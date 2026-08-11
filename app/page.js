'use client';
import { useState } from 'react';

// قائمة محافظات ومدن مصر
const EGYPT_DATA = {
  "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "أبو حماد", "فقوس", "هيها", "ديرب نجم", "أبو كبير", "مشتول السوق", "الإبراهيمية", "أولاد صقر", "صان الحجر", "منشأة أبو عمر"],
  "القاهرة": ["مدينة نصر", "مصر الجديدة", "المعادي", "الزمالك", "حلوان", "التجمع الخامس", "الشروق", "بدر", "شبرا"],
  "الجيزة": ["الدقي", "العجوزة", "المهندسين", "الهرم", "فيصل", "6 أكتوبر", "الشيخ زايد"],
  "الدقهلية": ["المنصورة", "ميت غمر", "طلخا", "دكرنس", "سنبلاوين", "بلقاس", "شربين"],
  "القليوبية": ["بنها", "شبرا الخيمة", "القناطر الخيرية", "الخانكة", "قليوب", "طوخ"],
  "الغربية": ["طنطا", "المحلة الكبرى", "زفتى", "سمنود", "كفر الزيات"],
  "المنوفية": ["شبين الكوم", "منوف", "أشمون", "السادات", "قويسنا"],
  "البحيرة": ["دمنهور", "كفر الدوار", "إيتاي البارود", "أبو حمص"],
  "دمياط": ["دمياط", "دمياط الجديدة", "رأس البر", "فارسكور"],
  "بورسعيد": ["حي الشرق", "حي العرب", "حي المناخ", "بورفؤاد"],
  "الإسماعيلية": ["الإسماعيلية", "القنطرة شرق", "فايد"],
  "السويس": ["السويس", "الأربعين", "عتاقة"],
  "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوّه", "مطوبس"],
  "الفيوم": ["الفيوم", "سنورس", "طامية"],
  "بني سويف": ["بني سويف", "الواسطى", "ناصر"],
  "المنيا": ["المنيا", "ملوي", "سمالوط"],
  "أسيوط": ["أسيوط", "ديروط", "القوصية"],
  "سوهاج": ["سوهاج", "أخميم", "طهطا"],
  "قنا": ["قنا", "نجع حمادي", "قوص"],
  "الأقصر": ["الأقصر", "إسنا", "أرمنت"],
  "أسوان": ["أسوان", "كوم أمبو", "إدفو"],
  "مطروح": ["مرسى مطروح", "العلمين"],
  "البحر الأحمر": ["الغردقة", "سفاجا", "القصير"],
  "الوادي الجديد": ["الخارجة", "الداخلة"],
  "شمال سيناء": ["العريش"],
  "جنوب سيناء": ["شرم الشيخ", "دهب", "طور سيناء"]
};

// كليات جامعة الزقازيق والكليات العامة
const COLLEGES_LIST = [
  "جامعة الزقازيق - كلية التربية",
  "جامعة الزقازيق - كلية الآداب",
  "جامعة الزقازيق - كلية العلوم",
  "جامعة الزقازيق - كلية التجارة",
  "جامعة الزقازيق - كلية الحقوق",
  "جامعة الزقازيق - كلية الهندسة",
  "جامعة الزقازيق - كلية الحاسبات والمعلومات",
  "جامعة الزقازيق - كلية التربية النوعية",
  "جامعة الزقازيق - كلية التربية الرياضية",
  "جامعة الزقازيق - كلية الزراعة",
  "جامعة الزقازيق - كلية التمريض",
  "جامعة الزقازيق - كلية الصيدلة",
  "جامعة الزقازيق - كلية الطب البشري",
  "جامعة الزقازيق - كلية طب الأسنان",
  "جامعة الزقازيق - كلية التكنولوجيا والتنمية",
  "جامعة أخرى - أدبي",
  "جامعة أخرى - علمي"
];

export default function Home() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'register' | 'steps'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: 'الشرقية',
    city: '',
    street: '',
    college: '',
    grade: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState({ type: '', msg: '' });

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    if (formData.phone.length < 11) {
      setStatus({ type: 'error', msg: 'يجب أن يتكون رقم الهاتف من 11 رقماً.' });
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
        setFormData({ name: '', phone: '', governorate: 'الشرقية', city: '', street: '', college: '', grade: '' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'حدث خطأ ما، يرجى المحاولة لاحقاً.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'تعذر الاتصال بالخادم.' });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus({ type: '', msg: '' });

    if (!contactForm.name.trim() || !contactForm.message.trim()) {
      setContactStatus({ type: 'error', msg: 'يجب إدخال الاسم ونص الرسالة.' });
      setContactLoading(false);
      return;
    }

    const normalizedName = contactForm.name.trim().toLowerCase();
    if (normalizedName === 'admin') {
      const enteredPassword = window.prompt('أدخل كلمة المرور الخاصة بالادمن');
      if (enteredPassword !== '01029633610') {
        setContactStatus({ type: 'error', msg: 'كلمة المرور غير صحيحة.' });
        setContactLoading(false);
        return;
      }

      window.location.href = '/admin?adminAccess=true';
      setContactLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();

      if (res.ok) {
        setContactStatus({ type: 'success', msg: 'تم إرسال رسالتك بنجاح، وسيتم مراجعتها قريباً.' });
        setContactForm({ name: '', message: '' });
        setShowContactForm(false);
      } else {
        setContactStatus({ type: 'error', msg: data.error || 'حدث خطأ أثناء إرسال الرسالة.' });
      }
    } catch (err) {
      setContactStatus({ type: 'error', msg: 'تعذر الاتصال بالخادم.' });
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans" dir="rtl">
      
      {/* عناصر خلفية جمالية ممتدة متدرجة الألوان */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* الهيدر العلوي */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 font-bold text-xl text-white">
            ز
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">منصة التربوي</h1>
            <p className="text-xs text-slate-400">جامعة الزقازيق</p>
          </div>
        </div>

        <nav className="flex gap-2">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`px-3 py-1.5 text-sm rounded-lg transition ${currentView === 'home' ? 'bg-slate-800 text-blue-400 font-medium' : 'text-slate-400 hover:text-white'}`}
          >
            الرئيسية
          </button>
          <button 
            onClick={() => setCurrentView('register')} 
            className={`px-3 py-1.5 text-sm rounded-lg transition ${currentView === 'register' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300 hover:text-white'}`}
          >
            التسجيل
          </button>
        </nav>
      </header>

      {/* المحتوى المبدل حسب View */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 z-10">

        {/* 1. الشاشة الرئيسية */}
        {currentView === 'home' && (
          <div className="max-w-3xl w-full text-center space-y-8 py-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <span>🎓</span> بوابة التقديم والدورات المعتمدة
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              دليلك الكامل لـ <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">الدبلوم التربوي</span> بجميع المراحل
            </h1>

            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
              موقع مخصص لمساعدة طلاب جامعة الزقازيق وتوفير كافة الإرشادات الخاصة بالتسجيل في الدبلوم التربوي ودورة التحول الرقمي بسهولة وسرعة.
            </p>

            {/* الأزرار الرئيسية */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentView('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>التسجيل في دورة التحول الرقمي</span>
                <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>

              <button
                onClick={() => setCurrentView('steps')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-lg shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>📜 خطوات التسجيل في التربوي</span>
              </button>
            </div>

            <div className="max-w-xl mx-auto pt-2">
              <button
                onClick={() => setShowContactForm((prev) => !prev)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 font-semibold hover:bg-blue-500/20 transition-all"
              >
                📩 اترك رسالة للإدارة
              </button>

              {showContactForm && (
                <form onSubmit={handleContactSubmit} className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-right space-y-3 shadow-lg">
                  {contactStatus.msg && (
                    <div className={`rounded-xl p-3 text-sm ${contactStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {contactStatus.msg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">الاسم</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="أدخل اسمك"
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">نص الرسالة</label>
                    <textarea
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">اسم المستخدم في التيليجرام <span className="text-slate-500">(اختياري)</span></label>
                    <input
                      type="text"
                      value={contactForm.telegramUsername || ''}
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        const clean = raw.startsWith('@') ? raw.slice(1) : raw;
                        setContactForm({ ...contactForm, telegramUsername: clean });
                      }}
                      placeholder="مثال: @yourname"
                      className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-600 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50"
                  >
                    {contactLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </button>
                </form>
              )}
            </div>

            {/* مميزات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 text-right">
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold text-white mb-1">تسجيل أونلاين سريع</h3>
                <p className="text-xs text-slate-400">إدخال البيانات وإرسال الإشعار فوراً لإتمام الحجز.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-2xl mb-2">🏛️</div>
                <h3 className="font-bold text-white mb-1">خاص بجامعة الزقازيق</h3>
                <p className="text-xs text-slate-400">إرشادات مخصصة لطلاب وخريجي جامعة الزقازيق.</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-2xl mb-2">📱</div>
                <h3 className="font-bold text-white mb-1">متابعة فورية</h3>
                <p className="text-xs text-slate-400">وصول تفاصيل طلبك مباشرة للإدارة لتسهيل المتابعة.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. شاشة خطوات التسجيل في التربوي */}
        {currentView === 'steps' && (
          <div className="max-w-2xl w-full bg-slate-900/70 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📜</span> خطوات التسجيل في الدبلوم التربوي
              </h2>
              <button onClick={() => setCurrentView('home')} className="text-slate-400 hover:text-white text-sm">إغلاق ✖</button>
            </div>

            <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
              <div className="flex gap-4 items-start bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">1</span>
                <p><strong className="text-white block mb-0.5">تجهيز الأوراق المطلوبة:</strong> أصل شهادة البكالوريوس/الليسانس + أصل بيان الدرجات + صورة البطاقة + 6 صور شخصية + شهادة الموقف من التجنيد للذكور.</p>
              </div>

              <div className="flex gap-4 items-start bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">2</span>
                <p><strong className="text-white block mb-0.5">التسجيل الإلكتروني:</strong> الدخول على موقع الجامعة وحجز استمارة التقديم المبدئية وطباعتها.</p>
              </div>

              <div className="flex gap-4 items-start bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">3</span>
                <p><strong className="text-white block mb-0.5">دورة التحول الرقمي:</strong> التقديم لحجز دورة التحول الرقمي المعتمدة المقررة كشرط أساسي للتخرج من التربوي.</p>
              </div>

              <div className="flex gap-4 items-start bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
                <span className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">4</span>
                <p><strong className="text-white block mb-0.5">تسليم الملف بالكلية:</strong> التوجه إلى قسم الدراسات العليا بالكلية وتسليم الملف كاملاً ودفع المصروفات المقررة.</p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setCurrentView('register')}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition text-center"
              >
                انتقل للتسجيل في دورة التحول الرقمي
              </button>
            </div>
          </div>
        )}

        {/* 3. شاشة استمارة التسجيل */}
        {currentView === 'register' && (
          <div className="max-w-lg w-full bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl my-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">استمارة التحول الرقمي</h2>
                <p className="text-slate-400 text-xs mt-1">سجل بياناتك لإتمام الحجز بنجاح</p>
              </div>
              <button onClick={() => setCurrentView('home')} className="text-slate-400 hover:text-white text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">الرجوع للرئيسية</button>
            </div>

            {status.msg && (
              <div className={`p-3.5 rounded-xl mb-5 text-sm text-center font-medium ${
                status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">الاسم بالكامل</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الرباعي"
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">رقم الهاتف (11 رقم)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-600 text-sm"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">الأرقام المدخلة: {formData.phone.length} / 11</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">المحافظة</label>
                  <select
                    name="governorate"
                    required
                    value={formData.governorate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white text-sm"
                  >
                    {Object.keys(EGYPT_DATA).map((gov) => (
                      <option key={gov} value={gov} className="bg-slate-900 text-white">{gov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">المدينة / المركز</label>
                  <select
                    name="city"
                    required
                    disabled={!formData.governorate}
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white text-sm disabled:opacity-40"
                  >
                    <option value="" className="bg-slate-900">اختر المدينة</option>
                    {formData.governorate && EGYPT_DATA[formData.governorate].map((city) => (
                      <option key={city} value={city} className="bg-slate-900 text-white">{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">العنوان / الشارع <span className="text-slate-500">(اختياري)</span></label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="أدخل اسم الشارع أو تفاصيل العنوان"
                  className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white placeholder-slate-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">الكلية / المعهد</label>
                <select
                  name="college"
                  required
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white text-sm"
                >
                  <option value="" className="bg-slate-900">اختر الكلية</option>
                  {COLLEGES_LIST.map((col) => (
                    <option key={col} value={col} className="bg-slate-900 text-white">{col}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">التقدير العام</label>
                <select
                  name="grade"
                  required
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-white text-sm"
                >
                  <option value="" className="bg-slate-900">اختر التقدير</option>
                  <option value="امتياز" className="bg-slate-900">امتياز</option>
                  <option value="جيد جداً" className="bg-slate-900">جيد جداً</option>
                  <option value="جيد" className="bg-slate-900">جيد</option>
                  <option value="مقبول" className="bg-slate-900">مقبول</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-blue-600/30 disabled:opacity-50 text-sm"
              >
                {loading ? 'جاري التسجيل...' : 'تأكيد التسجيل الان'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* الفوتر السفلية */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500 z-10">
        جميع الحقوق محفوظة © منصة التربوي - جامعة الزقازيق 2026
      </footer>

    </main>
  );
}