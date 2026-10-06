import React from 'react';
import { ArrowDown, GraduationCap, CheckCircle2, School, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 bg-white border-b border-zinc-200 overflow-hidden">
      {/* Decorative Background Accents matching the reference design */}
      <div className="absolute top-12 left-8 text-amber-400 font-extrabold text-3xl select-none pointer-events-none hidden lg:block opacity-80">
        +
      </div>
      <div className="absolute bottom-16 right-12 text-emerald-500 font-extrabold text-4xl select-none pointer-events-none hidden lg:block opacity-80">
        +
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ======================================================== */}
          {/* COLUMN 1 (Right in RTL): Bold Headline & Primary Eyebrow */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 text-right">
            {/* Minimal Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-[11px] font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>المملكة الأردنية الهاشمية • الدورة 2025/2026</span>
            </div>

            {/* Main Headline with Stylized Highlight Underline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black text-black tracking-tight leading-[1.2] mb-6">
              كفالة التعليم{' '}
              <span className="relative inline-block text-black">
                الجامعي
                {/* Yellow Highlighter Stroke */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-amber-400 pointer-events-none"
                  viewBox="0 0 160 14"
                  fill="none"
                >
                  <path
                    d="M3 10C45 3.5 115 3.5 157 9"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              للطلبة الأكثر استحقاقاً
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal mb-8 max-w-md">
              تمكين الطلبة الأردنيين من استكمال دراستهم الأكاديمية دون عوائق مالية، عبر تغطية الرسوم وفق معايير موضوعية وتدقيق مكتبي معتمد.
            </p>

            {/* Institutional Trust Bullets */}
            <div className="space-y-3 pt-4 border-t border-zinc-100 text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>دعم مباشر لرسوم الساعات المعتمدة لكافة التخصصات</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تدقيق رسمي محايد دون أي وساطة أو تدخل شخصي</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2 (Center): Student Illustration & Floating Cards */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-[480px]">
              {/* Central Student Graphic with Organic Background Blobs */}
              <div className="relative z-10 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-student-clean.png"
                  alt="طالب جامعي مستفيد من كفالة التعليم"
                  className="w-full h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-sm"
                />

                {/* Floating Card 1 (Left): Scholarship Coverage */}
                <div className="absolute top-[46%] -left-2 sm:-left-6 z-20 bg-white border border-black rounded-2xl p-3.5 sm:p-4 shadow-xl max-w-[190px] sm:max-w-[210px] text-right transition-transform hover:-translate-y-1 duration-200">
                  <div className="text-xs sm:text-[13px] font-bold text-black">
                    كفالة الرسوم الأكاديمية
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-zinc-600 mt-1 leading-normal">
                    تغطية الساعات المعتمدة في كافة الجامعات الرسمية والخاصة.
                  </div>
                </div>

                {/* Floating Card 2 (Right): Campus Transportation / University Reach */}
                <div className="absolute bottom-4 -right-2 sm:-right-6 z-20 bg-white border border-black rounded-2xl p-3.5 sm:p-4 shadow-xl max-w-[190px] sm:max-w-[210px] text-right transition-transform hover:-translate-y-1 duration-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
                      <School className="w-3.5 h-3.5 text-amber-800" />
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-black">
                      الجامعات المشمولة
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-zinc-600 leading-normal">
                    كافة الجامعات والكليات الأردنية المعتمدة دون استثناء.
                  </div>
                </div>
              </div>

              {/* Decorative Subtle Dashed Path */}
              <svg
                className="absolute -bottom-6 -left-8 w-24 h-24 text-amber-300/60 pointer-events-none hidden sm:block"
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

          {/* ======================================================== */}
          {/* COLUMN 3 (Left in RTL): Description, 3D Cap, and Green CTA */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 text-right flex flex-col items-start lg:items-start justify-center">
            {/* 3D Graduation Cap Icon Card */}
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg mb-6">
              <GraduationCap className="w-7 h-7 text-amber-400" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal mb-8">
              المبادرة تتيح للطلبة المؤهلين التقديم الإلكتروني المباشر بدون وسطاء، وتعتمد اللجنة المستفيدين يدوياً بعد التحقق الكامل من الوثائق الثبوتية.
            </p>

            {/* Prominent Emerald Green Rounded CTA Button matching reference */}
            <div className="w-full space-y-3">
              <a
                href="#apply"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <span>تقديم طلب الكفالة</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#guidelines"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-300 text-xs font-semibold transition-colors"
              >
                <span>معايير الأهلية والشروط</span>
              </a>
            </div>

            {/* Verification Metadata Footnote */}
            <div className="mt-8 pt-4 border-t border-zinc-100 w-full flex items-center justify-between text-[11px] text-zinc-400">
              <span>كفالة دراسية مستقلة</span>
              <span>•</span>
              <span>توثيق رسمي 100%</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
