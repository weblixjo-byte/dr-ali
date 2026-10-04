'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 text-slate-900 group">
          <div className="w-10 h-10 rounded border border-slate-300 bg-slate-50 flex items-center justify-center text-slate-800">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold text-base leading-tight">مبادرة المنح الدراسية</div>
            <div className="text-xs text-gray-500 font-normal">دعم 6 طلاب من الأكثر حاجة اقتصادية</div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#about" className="hover:text-slate-900 transition-colors">عن المبادرة</a>
          <a href="#details" className="hover:text-slate-900 transition-colors">تفاصيل المنحة</a>
          <a href="#criteria" className="hover:text-slate-900 transition-colors">المعايير والأولوية</a>
          <a href="#process" className="hover:text-slate-900 transition-colors">آلية الاختيار</a>
          <a href="#transparency" className="hover:text-slate-900 transition-colors">الشفافية</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">الأسئلة الشائعة</a>
        </nav>

        {/* CTA & Admin Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-gray-500 hover:text-slate-900 px-2 py-1.5 rounded transition-colors hidden sm:inline-block"
            title="بوابة لجنة المراجعة"
          >
            بوابة الإدارة
          </Link>
          <a
            href="#apply"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
          >
            تقديم طلب
          </a>
        </div>
      </div>
    </header>
  );
}
