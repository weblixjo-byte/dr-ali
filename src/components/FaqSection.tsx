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
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-right max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span>دليل الاستفسارات الأكاديمية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
            الأسئلة الشائعة حول المبادرة
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
            إجابات واضحة ومباشرة حول إجراءات التقديم والتدقيق المكتبي وشروط استحقاق كفالة الرسوم الجامعية.
          </p>
        </div>

        {/* Accordion Cards */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#22c55e] bg-emerald-50/20 shadow-sm border-r-4 border-r-[#22c55e]'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 text-black font-bold text-sm sm:text-base hover:bg-zinc-50/60 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black shrink-0 ${
                      isOpen
                        ? 'bg-[#22c55e] text-white'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#16a34a]' : 'text-zinc-400'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 pt-2 text-xs sm:text-sm text-zinc-700 leading-relaxed border-t border-emerald-100 bg-white/70">
                    <p className="pr-10">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need Help Callout Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50/40 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-5 text-right">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircleQuestion className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-extrabold text-black text-sm sm:text-base">
                هل لديك استفسار آخر لم تجده هنا؟
              </h4>
              <p className="text-xs text-zinc-600 mt-0.5">
                فريق أمانة سر المبادرة جاهز للرد على كافة أسئلتكم ومساعدتكم.
              </p>
            </div>
          </div>

          <a
            href="mailto:info@scholarship-initiative.org"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-50 text-emerald-950 font-bold text-xs border border-emerald-300 shadow-xs transition-colors shrink-0"
            dir="ltr"
          >
            <Mail className="w-3.5 h-3.5 text-[#16a34a]" />
            <span className="font-mono">info@scholarship-initiative.org</span>
          </a>
        </div>

      </div>
    </section>
  );
}
