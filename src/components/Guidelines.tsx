import React from 'react';
import { GraduationCap, FileCheck2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Guidelines() {
  const items = [
    {
      num: '01',
      title: 'نطاق الشمول والأهلية الأكاديمية',
      desc: 'تشمل المبادرة الطلبة المقبلين على الالتحاق بالتعليم الجامعي (خريجي الثانوية العامة - التوجيهي) المقبولين رسمياً، بالإضافة إلى الطلبة المنتظمين حالياً في الجامعات والكليات الأردنية المعتمدة.',
      icon: GraduationCap,
      iconColor: 'text-[#16a34a]',
      iconBg: 'bg-emerald-50',
    },
    {
      num: '02',
      title: 'التدقيق المكتبي والوثائق الرسمية',
      desc: 'تتولى اللجنة فحص ومطابقة كشوفات العلامات الرسمية، وإثباتات دخل الأسرة، وسجلات الأحوال المدنية، وكشوفات الرسوم الصادرة عن وحدة القبول والتسجيل لكل مرشح قبل اعتماد أي قرار.',
      icon: FileCheck2,
      iconColor: 'text-[#16a34a]',
      iconBg: 'bg-emerald-50',
    },
    {
      num: '03',
      title: 'سياسة الاستبعاد الفوري للبيانات المضللة',
      desc: 'يتحمل المتقدم المسؤولية القانونية والأخلاقية الكاملة عن صحة البيانات؛ ويؤدي ثبوت أي تضليل أو إخفاء لمعلومات جوهرية تخص الدخل أو الرسوم إلى الاستبعاد الفوري والنهائي دون استثناء.',
      icon: AlertTriangle,
      iconColor: 'text-[#16a34a]',
      iconBg: 'bg-emerald-50',
    },
  ];

  return (
    <section id="guidelines" className="py-16 sm:py-24 bg-[#22c55e] border-y-[3px] border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-right max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            شروط الاستحقاق وضوابط المفاضلة
          </h2>
          <p className="text-sm sm:text-base text-white/95 mt-3 leading-relaxed font-semibold">
            تخضع عملية المفاضلة لمنظومة معايير شفافة وموحدة تكفل توجيه الكفالة للطلبة الأكثر حاجة واستحقاقاً في كافة محافظات المملكة.
          </p>
        </div>

        {/* 3 Pure White Cartoon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border-[2.5px] border-black hover:-translate-y-1.5 transition-all duration-200 text-right flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge and Icon Strip */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-black px-3 py-1 rounded-xl bg-[#facc15] text-black border-2 border-black">
                      معيار {item.num}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl ${item.iconBg} ${item.iconColor} border-2 border-black flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5 stroke-[2.4]" />
                    </div>
                  </div>

                  {/* Card Title (Black Text) */}
                  <h3 className="text-lg sm:text-xl font-black text-black mb-3 leading-snug tracking-tight">
                    {item.title}
                  </h3>

                  {/* Card Description (Black/Zinc Text) */}
                  <p className="text-xs sm:text-sm text-zinc-700 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cartoon Styled Legal Disqualification Callout (Red Alert Style) */}
        <div className="p-5 sm:p-6 rounded-3xl border-[2.5px] border-black bg-[#fee2e2] text-right flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#ef4444] border-2 border-black flex items-center justify-center shrink-0 text-white mt-0.5">
            <ShieldAlert className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div className="text-xs sm:text-sm">
            <strong className="font-black text-red-950 block mb-1 text-sm sm:text-base">
              تنبيه تدقيق قانوني ومسؤولية إفصاح رسمية:
            </strong>
            <span className="text-zinc-900 leading-relaxed block font-semibold">
              تخضع كافة الطلبات للتحقق والمطابقة مع الوثائق الرسمية والمؤسسات التعليمية. أي معلومة غير دقيقة أو متناقضة يُكتشف وجودها خلال مرحلة التدقيق تستوجب استبعاد الطلب كلياً وبشكل نهائي لضمان العدالة وتكافؤ الفرص لكافة المتقدمين.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
