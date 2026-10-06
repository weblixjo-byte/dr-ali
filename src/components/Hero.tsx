import React from 'react';
import { ArrowDown } from 'lucide-react';
import StudentCrowd from './StudentCrowd';

export default function Hero() {
  return (
    <section className="pt-14 sm:pt-20 bg-white border-b border-zinc-200 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Minimal Institutional Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-[11px] font-medium text-zinc-900 bg-zinc-100 border border-zinc-200 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
          <span>المملكة الأردنية الهاشمية • الدورة الأكاديمية 2025/2026</span>
        </div>

        {/* Clean Master Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black tracking-tight leading-[1.18] mb-4">
          كفالة التعليم الجامعي للطلبة المستحقين
        </h1>

        {/* Minimal Uncluttered Subtitle */}
        <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          مبادرة تعليمية مستقلة لتغطية الرسوم الجامعية وتمكين الطلبة الأردنيين الأكثر حاجة في كافة الجامعات المعتمدة، وفق تدقيق رسمي مباشر.
        </p>

        {/* Direct CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <a
            href="#apply"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-black hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-xs"
          >
            <span>تقديم طلب الكفالة</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#guidelines"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-white hover:bg-zinc-50 text-black border border-zinc-300 text-sm font-medium transition-colors"
          >
            <span>معايير الأهلية والشروط</span>
          </a>
        </div>
      </div>

      {/* Interactive Hand-Drawn Student Crowd Panorama (Matches Reference Video) */}
      <div className="w-full relative">
        <StudentCrowd />
      </div>

      {/* Subtle Institutional Assurance Bar */}
      <div className="bg-zinc-50 py-3.5 border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-zinc-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
            <span>كافة الجامعات الأردنية المعتمدة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
            <span>تدقيق رسمي ومحايد لكافة الوثائق</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
            <span>أولوية الحاجة الاقتصادية المثبتة</span>
          </div>
        </div>
      </div>
    </section>
  );
}
