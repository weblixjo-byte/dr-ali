import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section id="about" className="py-12 md:py-16 border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Notice Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium mb-6">
          <span>دورة الدعم الأكاديمي الحالية</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          <span>مخصص لـ 6 مقاعد معتمدة فقط</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
          مبادرة التكافل الأكاديمي لدعم 6 طلاب من الأكثر حاجة
        </h1>

        {/* Subheading / Description */}
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
          مبادرة خيرية مؤسسية مستقلة تهدف إلى تمكين 6 طلاب وطالبات جامعيين يواجهون عوائق اقتصادية حرجة تهدد مسيرتهم التعليمية، عبر سداد الرسوم الدراسية غير المغطاة وفق منظومة مفاضلة رقمية حتمية ومعلنة.
        </p>

        {/* Essential Institutional Disclaimer */}
        <div className="p-4 rounded border border-amber-200 bg-amber-50/70 text-amber-950 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold block mb-1">إقرار مهم للمتقدمين:</span>
            تقديم الطلب لا يعني القبول النهائي أو منح المساعدة تلقائياً. تعتمد لجنة المنح المستفيدين الستة يدويًا بعد إغلاق التقديم ومطابقة كافة الوثائق الرسمية والتحقق المكتبي من دقة البيانات الاقتصادية المصرح بها.
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100 text-sm text-gray-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">ترتيب موضوعي معلن</span>
              درجات مفاضلة حتمية من 100 نقطة دون أي تدخل خوارزمي غامض.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">سقف 6 مستفيدين</span>
              حصر الدعم في 6 مقاعد بحد أقصى تلتزم به إدارة المبادرة.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 block">تدقيق وتحقق يدوي</span>
              مراجعة ثبوتية الدخل والرسوم من قبل اللجنة قبل اعتماد أي قرار.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
