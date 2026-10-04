import React from 'react';
import { BookOpen, FileCheck, ShieldAlert } from 'lucide-react';

export default function Guidelines() {
  const items = [
    {
      icon: BookOpen,
      title: 'شروط الأهلية والشمول',
      desc: 'تشمل المبادرة الطلبة المقبلين على الدراسة الجامعية (خريجي التوجيهي) والطلبة المنتظمين في الجامعات والكليات المعتمدة داخل المملكة.',
    },
    {
      icon: FileCheck,
      title: 'التدقيق والوثائق الرسمية',
      desc: 'تتواصل اللجنة للتحقق من كشوفات العلامات الرسمية وإثباتات الدخل وشهادات التوجيهي لمطابقتها بدقة مع بيانات الطلب.',
    },
    {
      icon: ShieldAlert,
      title: 'التدقيق الصارم والاستبعاد الفوري',
      desc: 'يتحمل المتقدم المسؤولية الكاملة؛ وأي معلومة غير صحيحة أو مضللة تُكتشف أثناء التدقيق تؤدي للاستبعاد النهائي والفوري للطلب.',
    },
  ];

  return (
    <section className="py-12 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-3.5">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
