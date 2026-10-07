'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'هل التقديم مجاني وهل يتطلب إنشاء حساب في الموقع؟',
    a: 'التقديم مجاني بالكامل ولا يتطلب إنشاء أي حساب مستخدم؛ تُدخل البيانات مباشرة عبر الاستمارة الإلكترونية ويحصل الطالب فوراً على رقم مرجعي رسمي وإيصال إلكتروني قابل للطباعة.',
  },
  {
    q: 'ما هي الخطوات والإجراءات المتبعة بعد تقديم الطلب؟',
    a: 'تتولى اللجنة التدقيق المكتبي ومطابقة الوثائق الرسمية، والتحقق المباشر من كشوفات الرسوم الجامعية وسجلات الدخل العائلي.',
  },
  {
    q: 'هل تقديم الطلب يُعد ضماناً للحصول على الكفالة؟',
    a: 'لا، تقديم الطلب هو خطوة أولى للمفاضلة والتدقيق المكتبي، وتُعتمد القرارات النهائية رسمياً من قبل اللجنة بعد استكمال فحص ومطابقة الوثائق الثبوتية.',
  },
  {
    q: 'كيف يتم التحقق من صحة البيانات ومطابقتها؟',
    a: 'تخضع كافة الطلبات للتدقيق والمطابقة مع الوثائق الرسمية والمؤسسات التعليمية عند دراسة الطلبات، وتتم مراجعة أي مستندات بدقة قبل إصدار قرارات الكفالة النهائية.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-12 sm:py-20 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-right max-w-2xl mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
            الأسئلة الشائعة حول المبادرة
          </h2>
          <p className="text-xs sm:text-base text-zinc-600 mt-2.5 sm:mt-3 leading-relaxed font-normal">
            إجابات واضحة ومباشرة حول إجراءات التقديم والتدقيق المكتبي وشروط استحقاق كفالة الرسوم الجامعية.
          </p>
        </div>

        {/* Accordion Cards in Minimal Style */}
        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-50/70 border-zinc-300'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-right p-4 sm:p-6 flex items-center justify-between gap-3 text-zinc-900 font-semibold text-xs sm:text-base transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg font-mono text-xs font-semibold flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 stroke-[2.2] ${
                      isOpen ? 'rotate-180 text-zinc-900' : 'text-zinc-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 bg-white/50 font-normal">
                    <p className="pr-0 sm:pr-10">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
