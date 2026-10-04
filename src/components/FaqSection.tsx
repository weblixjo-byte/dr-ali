'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'هل التقديم مجاني وهل أحتاج لإنشاء حساب؟',
    a: 'التقديم مجاني بالكامل ولا يتطلب إنشاء أي حساب؛ يتم إدخال البيانات مباشرة ويحصل الطالب على رقم طلب مرجعي.',
  },
  {
    q: 'ما هي الخطوات بعد إرسال الطلب؟',
    a: 'تقوم اللجنة بمراجعة الطلبات والتواصل المباشر مع المرشحين لمطابقة الوثائق الرسمية الثبوتية للرسوم والدخل.',
  },
  {
    q: 'هل تقديم الطلب يعني القبول النهائي؟',
    a: 'لا، تقديم الطلب خطوة أولى للمراجعة والتدقيق المكتبي، وتُعتمد القرارات رسمياً من قبل اللجنة بعد استكمال فحص الوثائق.',
  },
  {
    q: 'كيف يمكنني تصحيح معلومة في حال الخطأ؟',
    a: 'يمكنك التواصل مع إدارة المبادرة عبر البريد الإلكتروني الرسمي مع ذكر رقم طلبك المرجعي والمستند الموضح للتصحيح.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6 text-center sm:text-right">
          الأسئلة الشائعة
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-right p-4 flex items-center justify-between gap-4 text-slate-900 font-semibold text-xs sm:text-sm hover:bg-slate-50/50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.a}
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
