import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 bg-white border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          <span>استقبال طلبات الدعم الأكاديمي متاح حالياً</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          منح كفالة الرسوم الجامعية
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          مبادرة خيرية مؤسسية مستقلة تهدف لسداد الرسوم الدراسية غير المغطاة للطلبة الجامعيين الذين يواجهون صعوبات مالية، بعد مراجعة دقيقة وتدقيق مكتبي لكافة الوثائق.
        </p>

        <div className="flex items-center justify-center gap-3">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-xs"
          >
            <span>بدء تعبئة الطلب</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
