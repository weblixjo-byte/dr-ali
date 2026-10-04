'use client';

import React, { useEffect, useState } from 'react';
import { Eye, ShieldAlert } from 'lucide-react';

interface StatsState {
  totalReceived: number;
  reviewedCount: number;
  availableScholarships: number;
  isSubmissionOpen: boolean;
  criteriaVersion: number;
  criteriaApprovedAt: string;
  currencyCode: string;
  isResultsFinalized: boolean;
  approvedBeneficiariesCount: number;
  totalApprovedSupport: number | null;
}

export default function TransparencySection() {
  const [stats, setStats] = useState<StatsState>({
    totalReceived: 0,
    reviewedCount: 0,
    availableScholarships: 6,
    isSubmissionOpen: true,
    criteriaVersion: 1,
    criteriaApprovedAt: '2026-01-15',
    currencyCode: 'ر.س',
    isResultsFinalized: false,
    approvedBeneficiariesCount: 0,
    totalApprovedSupport: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public-stats')
      .then((res) => res.json())
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="transparency" className="py-12 border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>مؤشرات الشفافية العامة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">سجل الشفافية والأرقام المعتمدة</h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border self-start sm:self-auto bg-gray-50 border-gray-200 text-gray-800">
            <span
              className={`w-2 h-2 rounded-full ${
                stats.isSubmissionOpen ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            ></span>
            <span>حالة التقديم: {stats.isSubmissionOpen ? 'مفتوح لاستقبال الطلبات' : 'مغلق للمراجعة'}</span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded border border-gray-200 bg-white">
            <div className="text-xs text-gray-500 mb-1">إجمالي الطلبات المستلمة</div>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.totalReceived}
            </div>
          </div>

          <div className="p-4 rounded border border-gray-200 bg-white">
            <div className="text-xs text-gray-500 mb-1">الطلبات المراجعة مكتبياً</div>
            <div className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.reviewedCount}
            </div>
          </div>

          <div className="p-4 rounded border border-gray-200 bg-white">
            <div className="text-xs text-gray-500 mb-1">المقاعد المتاحة للتخصيص</div>
            <div className="text-2xl font-bold text-slate-900">6</div>
          </div>

          <div className="p-4 rounded border border-gray-200 bg-white">
            <div className="text-xs text-gray-500 mb-1">نسخة المعايير المعتمدة</div>
            <div className="text-base font-bold text-slate-900 mt-1">
              الإصدار {stats.criteriaVersion}
            </div>
          </div>
        </div>

        {/* Finalized Summary Banner if Approved */}
        {stats.isResultsFinalized && (
          <div className="p-4 rounded border border-emerald-200 bg-emerald-50 text-emerald-950 text-xs sm:text-sm mb-6 flex items-start gap-3">
            <div className="font-semibold text-emerald-900">
              تم اعتماد النتائج رسمياً: تم إقرار سداد رسوم {stats.approvedBeneficiariesCount} طلاب مستفيدين
              {stats.totalApprovedSupport !== null && (
                <span> بإجمالي دعم معتمد قدره {stats.totalApprovedSupport.toLocaleString('ar-SA')} {stats.currencyCode}</span>
              )}.
            </div>
          </div>
        )}

        {/* Privacy & Ethics Notice */}
        <div className="flex items-start gap-2.5 p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>ميثاق خصوصية البيانات:</strong> التزاماً بحرمة البيانات الشخصية وكرامة المتقدمين، لا تنشر المبادرة أسماء الطلاب أو دخول أسرهم أو الترتيب الفردي لأي متقدم، وتقتصر البيانات المنشورة على الإحصاءات المؤسسية التجميعية.
          </p>
        </div>
      </div>
    </section>
  );
}
