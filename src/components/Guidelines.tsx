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
    <section id="guidelines" className="py-16 sm:py-24 bg-zinc-50/60 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-right max-w-2xl mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-900 tracking-tight leading-tight">
            شروط الاستحقاق وضوابط المفاضلة
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 mt-3 leading-relaxed font-normal">
            تخضع عملية المفاضلة لمنظومة معايير شفافة وموحدة تكفل توجيه الكفالة للطلبة الأكثر حاجة واستحقاقاً في كافة محافظات المملكة.
          </p>
        </div>

        {/* 3 Minimal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
          {items.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200 hover:border-zinc-300 transition-colors duration-200 text-right flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge and Icon Strip */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200/80">
                      معيار {item.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2.5 leading-snug tracking-tight">
                    {item.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Disqualification Callout */}
        <div className="p-5 sm:p-6 rounded-2xl border border-rose-200 bg-rose-50/50 text-right flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="text-xs sm:text-sm">
            <strong className="font-bold text-rose-950 block mb-1 text-sm sm:text-base">
              تنبيه تدقيق قانوني ومسؤولية إفصاح رسمية:
            </strong>
            <span className="text-rose-900/90 leading-relaxed block font-normal">
              تخضع كافة الطلبات للتحقق والمطابقة مع الوثائق الرسمية والمؤسسات التعليمية. أي معلومة غير دقيقة أو متناقضة يُكتشف وجودها خلال مرحلة التدقيق تستوجب استبعاد الطلب كلياً وبشكل نهائي لضمان العدالة وتكافؤ الفرص لكافة المتقدمين.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
