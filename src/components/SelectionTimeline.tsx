import React from 'react';

export default function SelectionTimeline() {
  const steps = [
    {
      num: '1',
      title: 'تقديم الطلب الإلكتروني',
      desc: 'يقوم الطالب بتعبئة البيانات الدراسية والمالية بدقة داخل المنصة دون حاجة لإنشاء حساب.',
    },
    {
      num: '2',
      title: 'مراجعة الاكتمال الأولي',
      desc: 'فحص صحة وتطابق البيانات الأساسية والتأكد من عدم وجود بيانات غير مكتملة أو مجهولة.',
    },
    {
      num: '3',
      title: 'التحقق المكتبي من الوثائق',
      desc: 'تتواصل اللجنة للتحقق من ثبوتيات الرسوم والدخل وحالة الإعالة للطلبات المتقدمة في الترتيب.',
    },
    {
      num: '4',
      title: 'ترتيب المؤهلين آلياً',
      desc: 'إدراج الطلبات المؤهلة والمتحقق منها في قائمة مفاضلة مرتبة حتمياً حسب درجة الحاجة المعتمدة.',
    },
    {
      num: '5',
      title: 'الاعتماد اليدوي لـ 6 مستفيدين',
      desc: 'اجتماع اللجنة بعد إغلاق التقديم لاعتماد أعلى 6 مستفيدين وسداد الرسوم الدراسية لحساب الجامعة.',
    },
  ];

  return (
    <section id="process" className="py-12 border-b border-gray-200 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">آلية الاختيار والاعتماد</h2>
          <p className="text-sm text-gray-600">
            خمس خطوات واضحة وموثقة تضمن النزاهة المؤسسية والعدالة التامة في تحديد المستحقين.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-7 h-7 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center mb-3">
                  {s.num}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1.5 leading-snug">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
