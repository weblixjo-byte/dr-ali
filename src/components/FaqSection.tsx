'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, MessageCircleQuestion } from 'lucide-react';

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

        {/* Need Help Callout Banner */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-7 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 text-right">
          <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <MessageCircleQuestion className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-xs sm:text-base">
                هل لديك استفسار آخر لم تجده هنا؟
              </h4>
              <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 font-normal">
                فريق أمانة سر المبادرة جاهز للرد على كافة أسئلتكم ومساعدتكم.
              </p>
            </div>
          </div>

          <a
            href="mailto:info@scholarship-initiative.org"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 font-medium text-xs sm:text-sm border border-zinc-200 transition-colors shrink-0"
            dir="ltr"
          >
            <Mail className="w-4 h-4 text-emerald-600 stroke-[2]" />
            <span className="font-mono text-xs sm:text-sm">info@scholarship-initiative.org</span>
          </a>
        </div>

      </div>
    </section>
  );
}
