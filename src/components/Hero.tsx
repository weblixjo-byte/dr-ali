import React from 'react';
import { ArrowDown, School, GraduationCap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-8 pb-14 lg:pt-14 lg:pb-20 bg-white overflow-hidden border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ======================================================== */}
          {/* RIGHT COLUMN (RTL): Unified Headline, Description & CTAs */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 text-right space-y-6">
            {/* Main Balanced Headline with Subtle Highlighter Accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-bold text-zinc-900 tracking-tight leading-[1.25]">
              كفالة التعليم{' '}
              <span className="relative inline-block text-zinc-900">
                الجامعي
                {/* Subtle Curved Accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-emerald-500/30 pointer-events-none -z-10"
                  viewBox="0 0 160 14"
                  fill="none"
                >
                  <path
                    d="M3 10C45 3.5 115 3.5 157 9"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              للطلبة الأكثر استحقاقاً
            </h1>

            {/* Clear, Professional Description */}
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-xl">
              مبادرة تعليمية مستقلة لكفالة الرسوم الأكاديمية للطلبة المقبلين على الدراسة الجامعية أو المنتظمين فيها من ذوي الحاجة الاقتصادية، وفق معايير موضوعية وتدقيق مكتبي معتمد لكافة الوثائق الثبوتية.
            </p>

            {/* Action Buttons Group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-medium transition-colors cursor-pointer"
              >
                <span>بدء تعبئة طلب الكفالة</span>
                <ArrowDown className="w-4 h-4 stroke-[2.2]" />
              </a>

              <a
                href="#guidelines"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 text-sm font-medium transition-colors cursor-pointer"
              >
                <span>الشروط ومعايير الأهلية</span>
              </a>
            </div>
          </div>

          {/* ======================================================== */}
          {/* LEFT COLUMN (RTL): Student Visual & Responsive Badges */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 relative flex flex-col justify-center items-center">
            <div className="relative w-full max-w-[490px]">
              
              {/* Central Student Photo */}
              <div className="relative z-10 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-student-new.jpg"
                  alt="طالب جامعي"
                  className="w-full h-auto object-contain mx-auto select-none pointer-events-none rounded-2xl"
                />

                {/* Floating Card 1 (Top Left): Scholarship Badge (Tablet/Desktop only) */}
                <div className="hidden sm:block absolute top-[28%] -left-4 md:-left-6 z-20 bg-white/95 backdrop-blur-sm border border-zinc-200/90 rounded-2xl p-4 max-w-[210px] text-right transition-transform hover:-translate-y-1 duration-200">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <GraduationCap className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-zinc-900">
                      كفالة الرسوم
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal font-normal">
                    تغطية الساعات المعتمدة للطلبة المستحقين للدورة الحالية.
                  </p>
                </div>

                {/* Floating Card 2 (Bottom Right): Universities Badge (Tablet/Desktop only) */}
                <div className="hidden sm:block absolute bottom-6 -right-4 md:-right-6 z-20 bg-white/95 backdrop-blur-sm border border-zinc-200/90 rounded-2xl p-4 max-w-[210px] text-right transition-transform hover:-translate-y-1 duration-200">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                      <School className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-semibold text-zinc-900">
                      الجامعات المشمولة
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal font-normal">
                    كافة الجامعات والكليات الأردنية الرسمية والخاصة المعتمدة.
                  </p>
                </div>
              </div>

            </div>

            {/* Mobile Only: Badges displayed cleanly in a neat 2-col grid below image */}
            <div className="grid grid-cols-1 sm:hidden gap-2.5 w-full mt-4">
              <div className="bg-white border border-zinc-200 rounded-xl p-3.5 text-right flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                  <GraduationCap className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-900 block">
                    كفالة الرسوم
                  </span>
                  <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                    تغطية الساعات المعتمدة للطلبة المستحقين للدورة الحالية.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-3.5 text-right flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 mt-0.5">
                  <School className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-900 block">
                    الجامعات المشمولة
                  </span>
                  <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
                    كافة الجامعات والكليات الأردنية الرسمية والخاصة المعتمدة.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
