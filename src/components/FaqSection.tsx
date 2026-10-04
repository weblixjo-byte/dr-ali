'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const faqList: FaqItem[] = [
  {
    q: 'هل التقديم على المنحة مجاني؟',
    a: 'نعم، التقديم مجاني بالكامل ولا تتقاضى المبادرة أي رسوم إدارية أو مالية في أي مرحلة من المراحل.',
  },
  {
    q: 'هل أحتاج إلى إنشاء حساب أو تسجيل مستخدم في الموقع؟',
    a: 'لا، التقديم يتم مباشرة عبر الاستمارة المخصصة داخل الصفحة دون الحاجة لإنشاء كلمة مرور أو حساب شخصي، ويحصل الطالب على رقم طلب مرجعي فريد لمتابعة طلبه.',
  },
  {
    q: 'هل مجرد تقديم الطلب يعني القبول أو يضمن الحصول على المنحة؟',
    a: 'لا، التقديم خطوة أولى لمراجعة الأهلية ودراسة الحالة الاقتصادية. المقاعد المتاحة محددة بـ 6 منح دراسية فقط، ويتم اعتماد المقبولين بقرار يدوي من اللجنة بعد التحقق المكتبي.',
  },
  {
    q: 'كيف يتم ترتيب الطلبات لتحديد الأكثر حاجة؟',
    a: 'يتم احتساب درجة موضوعية حتمية من 100 نقطة مبنية على: دخل الفرد في الأسرة (55 نقطة)، نسبة الرسوم غير المغطاة (20 نقطة)، عبء المصاريف الضرورية كالإيجار والعلاج (15 نقطة)، وهشاشة مصدر الإعالة (10 نقاط). أعلى الطلبات درجة هم مرشحو المراجعة.',
  },
  {
    q: 'كيف يتم التحقق من صحة المعلومات المدخلة؟',
    a: 'تقوم لجنة التدقيق بعد إغلاق التقديم بالتواصل المباشر مع المرشحين الأكثر حاجة لطلب المستندات الرسمية الثبوتية (كشف الرسوم الجامعية المتبقية، إثباتات الدخل أو المعاش، وعقد الإيجار إن وجد).',
  },
  {
    q: 'متى يتم إعلان نتائج المنحة؟',
    a: 'تُعلن النتائج المعتمدة للطلبة الستة المقبولين وفق التاريخ المعلن في جدول المبادرة، بعد اكتمال مرحلة المراجعة والتحقق المكتبي وسداد الرسوم لحسابات الجامعات.',
  },
  {
    q: 'كيف أطلب تصحيح معلومة إذا أخطأت أثناء تعبئة الطلب؟',
    a: 'يمكنك التواصل مع إدارة المبادرة عبر البريد الإلكتروني أو الهاتف المعتمد المذكور في أسفل الصفحة، مع تزويدنا برقم الطلب المرجعي وشرح المعلومة المراد تصحيحها وإثباتها، ليقوم المسؤول بتسجيل طلب التصحيح وحفظه في سجل التدقيق.',
  },
  {
    q: 'كيف تُستخدم بياناتي الشخصية والمالية؟',
    a: 'تُستخدم بياناتك حصرياً لأغراض المفاضلة والتحقق من الأهلية بواسطة أعضاء اللجنة المختصين، وتُحفظ في قواعد بيانات مشفرة، ولا يتم مشاركتها أو بيعها أو نشرها لأي جهة تجارية أو عامة إطلاقاً.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-12 border-b border-gray-200 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">الأسئلة الشائعة</h2>
          <p className="text-sm text-gray-600">
            إجابات واضحة ومباشرة حول شروط التقديم، آلية الاحتساب، وسرية البيانات.
          </p>
        </div>

        <div className="space-y-2.5">
          {faqList.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-right p-4 flex items-center justify-between gap-4 text-slate-900 font-medium text-sm hover:bg-slate-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                    {item.a}
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
