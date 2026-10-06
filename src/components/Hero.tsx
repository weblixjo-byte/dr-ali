import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 bg-white overflow-hidden border-b border-zinc-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main 3-Column Educational Hero Grid matching the Reference Design */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* ======================================================== */}
          {/* COLUMN 1: Bold Master Headline & Decorative Accents */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 text-right order-1">
            {/* Minimalist Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
              <span>المملكة الأردنية الهاشمية • الدورة 2025/2026</span>
            </div>

            {/* Grand Bold Headline with Yellow Highlighter Underline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-black text-black tracking-tight leading-[1.18] mb-6">
              كفالة التعليم <br />
              <span className="relative inline-block text-black">
                الجامعي
                {/* Yellow Highlighter Stroke matching mockup */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4 text-[#facc15] pointer-events-none -z-10"
                  viewBox="0 0 160 14"
                  fill="none"
                >
                  <path
                    d="M3 10C45 3.5 115 3.5 157 9"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              للطلبة <br />
              المستحقين .
            </h1>

            {/* Decorative Dashed Looped Arrow & Green Plus */}
            <div className="relative pt-2 pb-4 hidden lg:flex items-center gap-6">
              <svg className="w-32 h-20 text-[#facc15]" viewBox="0 0 120 70" fill="none">
                <path
                  d="M10 60 C 25 20, 50 15, 75 35 C 90 48, 105 40, 115 15"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                />
                <polygon points="112,12 119,16 114,24" fill="currentColor" />
              </svg>
              <span className="text-[#22c55e] font-black text-4xl select-none">+</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 2: Central Student Photo & Floating Neobrutalist Cards */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative flex justify-center order-2">
            <div className="relative w-full max-w-[480px]">
              
              {/* Top-Right Yellow Plus Accent */}
              <div className="absolute -top-3 right-4 text-[#facc15] font-black text-4xl select-none pointer-events-none z-20">
                +
              </div>

              {/* High-Resolution Generated Student with Colorful Backdrop Blobs */}
              <div className="relative z-10 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-student-new.jpg"
                  alt="طالب جامعي"
                  className="w-full h-auto object-contain mx-auto select-none pointer-events-none"
                />

                {/* Floating Card 1 (Bottom Left): Coverage Details */}
                <div className="absolute top-[48%] -left-3 sm:-left-8 z-30 bg-white border-2 border-black rounded-3xl p-4 sm:p-5 shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] max-w-[200px] sm:max-w-[220px] text-right transform -rotate-2 hover:rotate-0 transition-transform duration-200">
                  <h4 className="text-xs sm:text-sm font-black text-black">
                    كفالة الرسوم الجامعية
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-zinc-600 mt-1.5 leading-relaxed font-medium">
                    تغطية الساعات المعتمدة للطلبة المستحقين وفق معايير موضوعية شفافة.
                  </p>
                </div>

                {/* Floating Card 2 (Bottom Right): Universities with Cute Bus Icon */}
                <div className="absolute bottom-2 -right-3 sm:-right-8 z-30 bg-white border-2 border-black rounded-3xl p-4 sm:p-5 shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] max-w-[210px] sm:max-w-[230px] text-right transform rotate-2 hover:rotate-0 transition-transform duration-200">
                  {/* Cute Cartoon Bus Icon matching reference mockup */}
                  <div className="w-10 h-7 mb-2">
                    <svg viewBox="0 0 44 28" fill="none" className="w-full h-full">
                      <rect x="2" y="2" width="40" height="20" rx="4" fill="#FBBF24" stroke="#000" strokeWidth="2.5" />
                      <rect x="6" y="6" width="7" height="8" rx="1.5" fill="#93C5FD" stroke="#000" strokeWidth="1.8" />
                      <rect x="16" y="6" width="7" height="8" rx="1.5" fill="#93C5FD" stroke="#000" strokeWidth="1.8" />
                      <rect x="26" y="6" width="7" height="8" rx="1.5" fill="#93C5FD" stroke="#000" strokeWidth="1.8" />
                      <circle cx="10" cy="22" r="4" fill="#1F2937" stroke="#000" strokeWidth="2" />
                      <circle cx="10" cy="22" r="1.5" fill="#E5E7EB" />
                      <circle cx="32" cy="22" r="4" fill="#1F2937" stroke="#000" strokeWidth="2" />
                      <circle cx="32" cy="22" r="1.5" fill="#E5E7EB" />
                    </svg>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-black">
                    الجامعات المشمولة
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-zinc-600 mt-1.5 leading-relaxed font-medium">
                    كافة الجامعات والكليات الأردنية الرسمية والخاصة المعتمدة.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMN 3: 3D Graduation Cap, Description, Green Button */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 text-right flex flex-col items-start lg:items-start justify-center order-3">
            
            {/* 3D Graduation Cap Floating Icon matching reference */}
            <div className="w-24 h-24 mb-4 select-none pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/graduation-cap-3d.jpg"
                alt="قبعة التخرج"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>

            {/* Concise Description matching the reference placement */}
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal mb-8 max-w-sm">
              مبادرة تعليمية مستقلة لكفالة الرسوم الأكاديمية للطلبة المقبلين على الدراسة الجامعية أو المنتظمين فيها من ذوي الحاجة الاقتصادية، وفق معايير موضوعية وتدقيق رسمي معتمد.
            </p>

            {/* Signature Emerald Green Pill Button matching the reference */}
            <div className="w-full space-y-3">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm sm:text-base font-extrabold border-2 border-black shadow-[3px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <span>تقديم طلب الكفالة</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <div>
                <a
                  href="#guidelines"
                  className="inline-block text-xs font-bold text-zinc-700 hover:text-black underline underline-offset-4 transition-colors"
                >
                  معايير الأهلية والشروط العامة ←
                </a>
              </div>
            </div>

            {/* Social Icons row matching the right side of the reference */}
            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center gap-3 text-zinc-700">
              <span className="text-[11px] text-zinc-400 font-medium">مبادرة موثقة 100%</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
