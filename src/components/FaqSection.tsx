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
    a: 'تتولى اللجنة التدقيق المكتبي ومطابقة الوثائق الرسمية، والتواصل المباشر مع المرشحين للتحقق من كشوفات الرسوم الجامعية وسجلات الدخل العائلي.',
  },
  {
    q: 'هل تقديم الطلب يُعد ضماناً للحصول على الكفالة؟',
    a: 'لا، تقديم الطلب هو خطوة أولى للمفاضلة والتدقيق المكتبي، وتُعتمد القرارات النهائية رسمياً من قبل اللجنة بعد استكمال فحص ومطابقة الوثائق الثبوتية.',
  },
  {
    q: 'كيف يمكنني تصحيح أي معلومة في حال وقوع خطأ أثناء الإدخال؟',
    a: 'يمكن للمتقدم التواصل مع أمانة سر المبادرة عبر البريد الإلكتروني الرسمي المعتمد، مع إرفاق الرقم المرجعي للطلب والمستند الرسمي المؤيد للتصحيح المطلوب.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-right max-w-xl mb-10">
          <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider block mb-1">
            دليل الاستفسارات
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
            الأسئلة الشائعة حول المبادرة
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
            إجابات واضحة ومباشرة حول إجراءات التقديم والتدقيق المكتبي واعتماد المنح.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-zinc-200 rounded-sm overflow-hidden bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 text-black font-semibold text-xs sm:text-sm hover:bg-zinc-50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/40">
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
