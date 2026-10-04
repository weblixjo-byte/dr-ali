import React from 'react';
import { Mail, Phone, Lock, HeartHandshake } from 'lucide-react';

interface FooterProps {
  contactEmail?: string;
  contactPhone?: string;
}

export default function Footer({
  contactEmail = 'info@scholarship-initiative.org',
  contactPhone = '+966110000000',
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 text-sm no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Initiative Mission */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <HeartHandshake className="w-5 h-5 text-slate-400" />
              <span>مبادرة التكافل الأكاديمي</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              مبادرة خيرية مؤسسية مستقلة تُعنى بتمكين الطلاب الأكثر حاجة من استكمال دراستهم الجامعية عبر كفالة سداد الرسوم الأكاديمية لـ 6 مقاعد دراسية مستحقة.
            </p>
            <div className="text-[11px] text-slate-500">
              جميع الإجراءات تتم وفق معايير معلنة واعتماد يدوي موثق من لجنة المراجعة.
            </div>
          </div>

          {/* Col 2: Privacy Summary */}
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>سياسة الخصوصية وسرية البيانات</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              تلتزم المبادرة بحماية خصوصية كافة المتقدمين. لا يتم مشاركة البيانات الأسرية أو المالية مع أي طرف ثالث أو استخدامها لأغراض تسويقية، ولا يتم نشر أسماء المستفيدين أو ظروفهم الخاصة للعامة، وتُحفظ البيانات في بيئة سحابية مشفرة.
            </p>
          </div>

          {/* Col 3: Real Configurable Contacts */}
          <div>
            <div className="text-white font-semibold text-sm mb-3">قنوات التواصل والاستفسارات الرسمية</div>
            <p className="text-xs text-slate-400 mb-3">
              للاستفسارات أو طلبات تصحيح البيانات المثبتة، يرجى التواصل مع أمانة اللجنة:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-white transition-colors underline"
                  dir="ltr"
                >
                  {contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href={`tel:${contactPhone}`}
                  className="hover:text-white transition-colors"
                  dir="ltr"
                >
                  {contactPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            جميع الحقوق محفوظة لمبادرة المنح الدراسية © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-slate-300 transition-colors">عن المبادرة</a>
            <a href="#criteria" className="hover:text-slate-300 transition-colors">المعايير المعتمدة</a>
            <a href="#faq" className="hover:text-slate-300 transition-colors">الأسئلة الشائعة</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
