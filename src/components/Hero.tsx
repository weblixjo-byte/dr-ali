import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, School, GraduationCap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-8 pb-14 lg:pt-14 lg:pb-20 bg-white overflow-hidden border-b border-zinc-200">
      {/* Decorative Subtle Background Plus Accents */}
      <div className="absolute top-10 right-8 text-amber-400 font-extrabold text-2xl select-none pointer-events-none opacity-60 hidden lg:block">
        +
      </div>
      <div className="absolute bottom-12 left-10 text-emerald-500 font-extrabold text-3xl select-none pointer-events-none opacity-60 hidden lg:block">
        +
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ======================================================== */}
          {/* RIGHT COLUMN (RTL): Unified Headline, Description & CTAs */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 text-right space-y-6">
            
            {/* Minimalist Official Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>المملكة الأردنية الهاشمية • الدورة الأكاديمية 2025/2026</span>
            </div>

            {/* Main Balanced Headline with Stylized Yellow Highlighter */}
            <h1 className="text-3xl sm:text-5xl lg:text-[48px] xl:text-[52px] font-black text-black tracking-tight leading-[1.2]">
              كفالة التعليم{' '}
              <span className="relative inline-block text-black">
                الجامعي
                {/* Yellow Highlighter Stroke */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-amber-400 pointer-events-none -z-10"
                  viewBox="0 0 160 14"
                  fill="none"
                >
                  <path
                    d="M3 10C45 3.5 115 3.5 157 9"
                    stroke="currentColor"
                    strokeWidth="5.5"
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

            {/* Action Buttons Group (Directly with Content) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm sm:text-base font-black border-2 border-black shadow-[3px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <span>بدء تعبئة طلب الكفالة</span>
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                href="#guidelines"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 border-2 border-amber-300/80 text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>الشروط ومعايير الأهلية</span>
              </a>
            </div>

            {/* Institutional Trust Bullets Strip */}
            <div className="pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl px-3.5 py-2 text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تغطية مباشرة لرسوم الساعات المعتمدة</span>
              </div>
              <div className="flex items-center gap-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl px-3.5 py-2 text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>تدقيق رسمي ومحايد دون وساطة</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* LEFT COLUMN (RTL): Student Visual & Floating Glass Cards  */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="relative w-full max-w-[490px]">
              
              {/* Central Student Photo with Organic Colored Backdrops */}
              <div className="relative z-10 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-student-new.jpg"
                  alt="طالب جامعي"
                  className="w-full h-auto object-contain mx-auto select-none pointer-events-none"
                />

                {/* Floating Card 1 (Top Left): Scholarship Badge */}
                <div className="absolute top-[28%] -left-2 sm:-left-6 z-20 bg-white/95 backdrop-blur-sm border border-zinc-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xl max-w-[190px] sm:max-w-[210px] text-right transition-transform hover:-translate-y-1 duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-black">
                      كفالة الرسوم
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    تغطية الساعات المعتمدة للطلبة المستحقين للدورة الحالية.
                  </p>
                </div>

                {/* Floating Card 2 (Bottom Right): Universities Badge */}
                <div className="absolute bottom-6 -right-2 sm:-right-6 z-20 bg-white/95 backdrop-blur-sm border border-zinc-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xl max-w-[190px] sm:max-w-[210px] text-right transition-transform hover:-translate-y-1 duration-200">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <School className="w-4 h-4 text-amber-700" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-bold text-black">
                      الجامعات المشمولة
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    كافة الجامعات والكليات الأردنية الرسمية والخاصة المعتمدة.
                  </p>
                </div>
              </div>

              {/* Decorative Delicate Dashed Path */}
              <svg
                className="absolute -bottom-6 -left-6 w-24 h-24 text-amber-300/50 pointer-events-none hidden sm:block"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M10 80 Q 40 10 90 40"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
