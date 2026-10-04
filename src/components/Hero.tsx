import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 bg-white border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
          منح كفالة الرسوم الجامعية
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          مبادرة خيرية مستقلة لكفالة الرسوم الدراسية للطلبة المقبلين على التعليم الجامعي أو المنتظمين فيه من ذوي الحاجة الاقتصادية، عبر نظام مفاضلة موضوعي وتدقيق رسمي لكافة الوثائق.
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
