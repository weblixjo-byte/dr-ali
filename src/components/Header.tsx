'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-black text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-black text-sm tracking-tight block">
              مبادرة د. علي التعليمية
            </span>
            <span className="text-[11px] text-zinc-500 font-normal">
              صندوق كفالة الرسوم الأكاديمية • الأردن
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4 text-xs">
          <a
            href="#guidelines"
            className="hidden sm:inline-block text-zinc-600 hover:text-black transition-colors px-2 py-1"
          >
            الشروط والأهلية
          </a>
          <a
            href="#faq"
            className="hidden sm:inline-block text-zinc-600 hover:text-black transition-colors px-2 py-1"
          >
            الأسئلة الشائعة
          </a>
          <Link
            href="/admin"
            className="text-zinc-500 hover:text-black px-2.5 py-1.5 rounded transition-colors"
          >
            بوابة الإدارة
          </Link>
          <a
            href="#apply"
            className="font-medium text-white bg-black hover:bg-zinc-800 px-4 py-2 rounded-sm transition-colors shadow-xs"
          >
            تقديم طلب
          </a>
        </nav>
      </div>
    </header>
  );
}
