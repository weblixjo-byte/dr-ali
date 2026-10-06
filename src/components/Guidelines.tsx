import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Guidelines() {
  const items = [
    {
      num: '01',
      title: 'نطاق الشمول والأهلية الأكاديمية',
      desc: 'تشمل المبادرة الطلبة المقبلين على الالتحاق بالتعليم الجامعي (خريجي الثانوية العامة - التوجيهي) المقبولين رسمياً، بالإضافة إلى الطلبة المنتظمين حالياً في الجامعات والكليات الأردنية المعتمدة.',
    },
    {
      num: '02',
      title: 'التدقيق المكتبي والوثائق الرسمية',
      desc: 'تتولى اللجنة فحص ومطابقة كشوفات العلامات الرسمية، وإثباتات دخل الأسرة، وسجلات الأحوال المدنية، وكشوفات الرسوم الصادرة عن وحدة القبول والتسجيل لكل مرشح قبل اعتماد أي قرار.',
    },
    {
      num: '03',
      title: 'سياسة الاستبعاد الفوري للبيانات المضللة',
      desc: 'يتحمل المتقدم المسؤولية القانونية والأخلاقية الكاملة عن صحة البيانات؛ ويؤدي ثبوت أي تضليل أو إخفاء لمعلومات جوهرية تخص الدخل أو الرسوم إلى الاستبعاد الفوري والنهائي دون استثناء.',
    },
  ];

  return (
    <section id="guidelines" className="py-16 sm:py-20 bg-zinc-50/50 border-b border-zinc-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-right max-w-xl mb-12">
          <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider block mb-1">
            الضوابط والإرشادات الرسمية
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
            شروط الاستحقاق وضوابط المفاضلة
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
            تخضع عملية المفاضلة لمنظومة معايير شفافة وموحدة تكفل توجيه الكفالة للطلبة الأكثر حاجة واستحقاقاً.
          </p>
        </div>

        {/* 3 Architectural Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="pt-6 border-t border-zinc-300 relative text-right flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-semibold text-zinc-400 block mb-3">
                  {item.num}
                </span>
                <h3 className="text-sm font-bold text-black mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Official Disqualification Callout */}
        <div className="p-4 sm:p-5 rounded-sm border border-zinc-300 bg-white text-right flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold text-black block mb-0.5">
              تنبيه قانوني ومسؤولية إفصاح:
            </strong>
            <span className="text-zinc-600 leading-relaxed">
              تخضع كافة الطلبات للتحقق والمطابقة مع الوثائق الرسمية والمؤسسات التعليمية. أي معلومة غير دقيقة أو متناقضة يُكتشف وجودها خلال مرحلة التدقيق تستوجب استبعاد الطلب كلياً وبشكل نهائي لضمان العدالة وتكافؤ الفرص لكافة المتقدمين.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
