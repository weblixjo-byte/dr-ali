import React from 'react';
import { Calendar, ShieldCheck, Landmark, Users } from 'lucide-react';

interface ScholarshipDetailsProps {
  coverageDescription?: string;
  valueCapDescription?: string;
  targetGroupDescription?: string;
  institutionsDescription?: string;
  startDate?: string;
  endDate?: string;
  announcementDate?: string;
}

export default function ScholarshipDetails({
  coverageDescription = 'سداد الرسوم الدراسية المتبقية غير المغطاة للفترة الأكاديمية الحالية حتى السقف المالي المعتمد.',
  valueCapDescription = 'تغطية تصل إلى 15,000 ر.س كحد أقصى للرسوم المستحقة لكل طالب مستفيد.',
  targetGroupDescription = 'الطلاب والطالبات المنتظمون في الجامعات والكليات المعتمدة الذين يعانون من صعوبات مالية حقيقية تهدد إكمال دراستهم.',
  institutionsDescription = 'كافة الجامعات والكليات الأهلية والحكومية المعتمدة رسمياً التي تتطلب رسوماً دراسية.',
  startDate = '2026-02-01',
  endDate = '2026-03-31',
  announcementDate = '2026-04-15',
}: ScholarshipDetailsProps) {
  return (
    <section id="details" className="py-12 border-b border-gray-200 bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">تفاصيل المنحة وشروط الاستحقاق</h2>
          <p className="text-sm text-gray-600">
            بيانات الدعم والنطاق الزمني والمؤسسي المعتمد لهذه الدورة.
          </p>
        </div>

        {/* 4 Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded border border-gray-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>ما تغطيه المنحة وسقف القيمة</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">{coverageDescription}</p>
            <div className="text-xs font-medium text-slate-700 bg-slate-100 p-2 rounded border border-slate-200">
              {valueCapDescription}
            </div>
          </div>

          <div className="p-5 bg-white rounded border border-gray-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
              <Users className="w-4 h-4 text-slate-700" />
              <span>الفئة المستهدفة</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{targetGroupDescription}</p>
          </div>

          <div className="p-5 bg-white rounded border border-gray-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-2">
              <Landmark className="w-4 h-4 text-slate-700" />
              <span>المؤسسات التعليمية المشمولة</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{institutionsDescription}</p>
          </div>

          <div className="p-5 bg-white rounded border border-gray-200">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-3">
              <Calendar className="w-4 h-4 text-slate-700" />
              <span>الجدول الزمني للتقديم والنتائج</span>
            </div>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-gray-100">
                <dt className="text-gray-500">بداية استقبال الطلبات:</dt>
                <dd className="font-medium text-slate-800">{startDate}</dd>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-gray-100">
                <dt className="text-gray-500">إغلاق التقديم:</dt>
                <dd className="font-medium text-slate-800">{endDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">إعلان القرارات واعتماد المستفيدين:</dt>
                <dd className="font-semibold text-slate-900">{announcementDate}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
