import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, School } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-16 pb-14 sm:pt-24 sm:pb-20 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Institutional Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-[11px] font-medium text-zinc-900 bg-zinc-100 border border-zinc-200 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
          <span>المملكة الأردنية الهاشمية • الدورة الأكاديمية 2025/2026</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight leading-[1.15] mb-6">
          كفالة التعليم الجامعي للطلبة المستحقين
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
          مبادرة تعليمية مستقلة لكفالة الرسوم الأكاديمية للطلبة المقبلين على الدراسة الجامعية أو المنتظمين فيها من ذوي الحاجة الاقتصادية، وفق معايير موضوعية وتدقيق رسمي معتمد لكافة الوثائق الثبوتية.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <a
            href="#apply"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-black hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-xs"
          >
            <span>بدء تعبئة طلب الكفالة</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#guidelines"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-white hover:bg-zinc-50 text-black border border-zinc-300 text-sm font-medium transition-colors"
          >
            <span>الشروط ومعايير الأهلية</span>
          </a>
        </div>

        {/* Institutional Pillars Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-zinc-200 text-right">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-sm bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
              <School className="w-3.5 h-3.5 text-black" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black">المؤسسات المشمولة</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">
                كافة الجامعات والكليات الرسمية والخاصة المعتمدة في الأردن.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-sm bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black">معايير المفاضلة</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">
                استحقاق اجتماعي واقتصادي موثق بدقة دون وساطة أو تدخل شخصي.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-sm bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-black">التدقيق والاعتماد</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">
                فحص مكتبي رسمي لكافة كشوفات الرسوم وسجلات الدخل.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
