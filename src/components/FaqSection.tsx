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
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
            الأسئلة الشائعة حول المبادرة
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed font-medium">
            إجابات واضحة ومباشرة حول إجراءات التقديم والتدقيق المكتبي وشروط استحقاق كفالة الرسوم الجامعية.
          </p>
        </div>

        {/* Accordion Cards in Cartoon Neo-Brutalist Style */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-3xl border-2 border-black transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-emerald-50/60'
                    : 'bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-right p-5 sm:p-6 flex items-center justify-between gap-4 text-black font-black text-sm sm:text-base hover:bg-zinc-50/40 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-xl border-2 border-black font-mono text-xs font-black flex items-center justify-center shrink-0 ${
                      isOpen
                        ? 'bg-[#22c55e] text-white'
                        : 'bg-zinc-100 text-black'
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 stroke-[2.5] ${
                      isOpen ? 'rotate-180 text-black' : 'text-zinc-500'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-zinc-800 leading-relaxed border-t-2 border-black/10 bg-white/70 font-medium">
                    <p className="pr-11">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need Help Callout Banner */}
        <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-amber-100 border-[2.5px] border-black flex flex-col sm:flex-row items-center justify-between gap-5 text-right">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#22c55e] text-white border-2 border-black flex items-center justify-center shrink-0">
              <MessageCircleQuestion className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-black text-black text-sm sm:text-base">
                هل لديك استفسار آخر لم تجده هنا؟
              </h4>
              <p className="text-xs text-zinc-700 mt-0.5 font-semibold">
                فريق أمانة سر المبادرة جاهز للرد على كافة أسئلتكم ومساعدتكم.
              </p>
            </div>
          </div>

          <a
            href="mailto:info@scholarship-initiative.org"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-zinc-50 text-black font-black text-xs sm:text-sm border-2 border-black active:translate-x-0.5 active:translate-y-0.5 transition-all shrink-0"
            dir="ltr"
          >
            <Mail className="w-4 h-4 text-[#16a34a] stroke-[2.5]" />
            <span className="font-mono">info@scholarship-initiative.org</span>
          </a>
        </div>

      </div>
    </section>
  );
}
