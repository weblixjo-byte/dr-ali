'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 no-print">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight block">
              مبادرة المنح الدراسية
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              كفالة الرسوم الأكاديمية الجامعية
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
          >
            بوابة الإدارة
          </Link>
          <a
            href="#apply"
            className="text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-colors shadow-xs"
          >
            تقديم طلب
          </a>
        </div>
      </div>
    </header>
  );
}
