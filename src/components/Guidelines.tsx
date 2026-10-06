import React from 'react';
import { GraduationCap, FileCheck2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Guidelines() {
  const items = [
    {
      num: '01',
      title: 'نطاق الشمول والأهلية الأكاديمية',
      desc: 'تشمل المبادرة الطلبة المقبلين على الالتحاق بالتعليم الجامعي (خريجي الثانوية العامة - التوجيهي) المقبولين رسمياً، بالإضافة إلى الطلبة المنتظمين حالياً في الجامعات والكليات الأردنية المعتمدة.',
      icon: GraduationCap,
      color: 'emerald',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      borderAccent: 'border-t-4 border-t-[#22c55e]',
    },
    {
      num: '02',
      title: 'التدقيق المكتبي والوثائق الرسمية',
      desc: 'تتولى اللجنة فحص ومطابقة كشوفات العلامات الرسمية، وإثباتات دخل الأسرة، وسجلات الأحوال المدنية، وكشوفات الرسوم الصادرة عن وحدة القبول والتسجيل لكل مرشح قبل اعتماد أي قرار.',
      icon: FileCheck2,
      color: 'amber',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      borderAccent: 'border-t-4 border-t-[#facc15]',
    },
    {
      num: '03',
      title: 'سياسة الاستبعاد الفوري للبيانات المضللة',
      desc: 'يتحمل المتقدم المسؤولية القانونية والأخلاقية الكاملة عن صحة البيانات؛ ويؤدي ثبوت أي تضليل أو إخفاء لمعلومات جوهرية تخص الدخل أو الرسوم إلى الاستبعاد الفوري والنهائي دون استثناء.',
      icon: AlertTriangle,
      color: 'emerald',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      borderAccent: 'border-t-4 border-t-[#22c55e]',
    },
  ];

  return (
    <section id="guidelines" className="py-16 sm:py-24 bg-gradient-to-b from-white via-emerald-50/20 to-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-right max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span>الضوابط والإرشادات الرسمية</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
            شروط الاستحقاق وضوابط المفاضلة
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed">
            تخضع عملية المفاضلة لمنظومة معايير شفافة وموحدة تكفل توجيه الكفالة للطلبة الأكثر حاجة واستحقاقاً في كافة محافظات المملكة.
          </p>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm hover:shadow-md transition-all duration-200 text-right flex flex-col justify-between ${item.borderAccent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border ${item.badgeBg}`}>
                      معيار {item.num}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      item.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <IconComponent className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-black mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Official Disqualification Callout */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-amber-300 bg-amber-50/80 text-right flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800 mt-0.5">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="text-xs sm:text-sm">
            <strong className="font-extrabold text-amber-950 block mb-1 text-sm sm:text-base">
              تنبيه تدقيق قانوني ومسؤولية إفصاح رسمية:
            </strong>
            <span className="text-amber-900/90 leading-relaxed block">
              تخضع كافة الطلبات للتحقق والمطابقة مع الوثائق الرسمية والمؤسسات التعليمية. أي معلومة غير دقيقة أو متناقضة يُكتشف وجودها خلال مرحلة التدقيق تستوجب استبعاد الطلب كلياً وبشكل نهائي لضمان العدالة وتكافؤ الفرص لكافة المتقدمين.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
