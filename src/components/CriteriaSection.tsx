import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function CriteriaSection() {
  return (
    <section id="criteria" className="py-12 border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">معايير الأهلية ومنظومة الأولوية (100 نقطة)</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            تعتمد المبادرة مبدأ الشفافية الكاملة والفصل الدقيق بين <strong className="text-slate-900">شروط الأهلية المبدئية</strong> و<strong className="text-slate-900">درجة الحاجة الاقتصادية</strong>.
          </p>
        </div>

        {/* Eligibility vs Need Distinction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded border border-slate-200 bg-slate-50 text-sm">
            <h3 className="font-semibold text-slate-900 mb-2">1. شروط الأهلية المبدئية (نعم / لا)</h3>
            <ul className="space-y-1.5 text-xs text-gray-700 list-disc list-inside">
              <li>أن يكون الطالب مسجلاً أو مقبولاً في مؤسسة تعليمية معتمدة.</li>
              <li>وجود رسوم دراسية مستحقة غير مغطاة للفترة الحالية.</li>
              <li>صحة وإقرار كافة البيانات المالية والأسرية المدخلة.</li>
              <li>الاستعداد لتزويد اللجنة بكافة المستندات الثبوتية عند طلبها.</li>
            </ul>
          </div>

          <div className="p-4 rounded border border-slate-200 bg-slate-50 text-sm">
            <h3 className="font-semibold text-slate-900 mb-2">2. درجة الحاجة الاقتصادية (حساب آلي من 100)</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-2">
              تُحسب الدرجة بصيغة حتمية ومعلنة تعتمد على الأرقام الثابتة فقط. لا تعتمد المفاضلة على المعدل الأكاديمي، ولا على الانتماء أو البلاغة النصية، ولا تستخدم أي خوارزميات ذكاء اصطناعي.
            </p>
            <div className="text-xs text-slate-800 font-medium">
              أعلى 6 طلبات في الترتيب هم مرشحو التدقيق النهائي للجنة.
            </div>
          </div>
        </div>

        {/* Weights Table */}
        <div className="border border-gray-200 rounded overflow-hidden mb-6">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-100 text-slate-900 text-xs font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 w-28">الوزن النسبي</th>
                <th className="py-3 px-4">المعيار الاقتصادي</th>
                <th className="py-3 px-4 hidden sm:table-cell">آلية الاحتساب الموضوعية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">55 نقطة</td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">انخفاض دخل الفرد الشهري في الأسرة</div>
                  <div className="text-xs text-gray-500 sm:hidden mt-0.5">
                    إجمالي الدخل الشهري المتاح للأسرة ÷ عدد أفراد الوحدة الاقتصادية.
                  </div>
                </td>
                <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-gray-600 leading-relaxed">
                  يُحسب بقسمة صافي دخل الأسرة المتاح شهرياً على عدد الأفراد. كلما انخفض دخل الفرد زادت النقاط خطياً مقارنة بسقف الحاجة المعتمد.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">20 نقطة</td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">نسبة الرسوم الدراسية غير المغطاة</div>
                  <div className="text-xs text-gray-500 sm:hidden mt-0.5">
                    المبلغ الدراسي المتبقي ÷ إجمالي رسوم الفترة.
                  </div>
                </td>
                <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-gray-600 leading-relaxed">
                  (الرسوم المستحقة - المدفوع - الدعم الخارجي) ÷ إجمالي رسوم الفترة. تمنح النقاط بناء على النسبة المئوية للمبلغ المتبقي المعلق.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">15 نقطة</td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">عبء المصاريف الأساسية المؤهلة</div>
                  <div className="text-xs text-gray-500 sm:hidden mt-0.5">
                    نسبة الإيجار والنفقات العلاجية الضرورية إلى الدخل.
                  </div>
                </td>
                <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-gray-600 leading-relaxed">
                  المصاريف الضرورية المؤهلة (إيجار السكن، العلاج المزمن، مصاريف الرعاية والنقل الإلزامي). لا تُخصم من الدخل لتفادي الازدواجية.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">10 نقاط</td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">هشاشة مصدر الإعالة أو فقده</div>
                  <div className="text-xs text-gray-500 sm:hidden mt-0.5">
                    غياب المعيل، تعطل رب الأسرة، أو كون الطالب معيل أسرته.
                  </div>
                </td>
                <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-gray-600 leading-relaxed">
                  تقييم الأثر الاقتصادي الفعلي لغياب أو وفاة المعيل، أو بطالته، مع الأخذ بالاعتبار المعاشات البديلة لضمان العدالة الموضوعية.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tie-breaker Rule Info */}
        <div className="flex items-start gap-2.5 text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
          <HelpCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">قواعد كسر التعادل:</strong> في حال تساوي درجتي متقدمين، يُقدم الأقل في دخل الفرد الشهري، ثم الأكثر في مبلغ الرسوم غير المغطى، ثم الأكبر في عدد أفراد الأسرة. ولا تُعتبر أسبقية وقت إرسال الطلب معياراً للأفضلية.
          </div>
        </div>
      </div>
    </section>
  );
}
