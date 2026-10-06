'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X, ArrowDown, Shield } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title with Vibrant Emerald/Amber Badge */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#22c55e] text-white flex items-center justify-center border-2 border-black group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-6 h-6 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-black text-base sm:text-lg tracking-tight block">
                مبادرة د. علي التعليمية
              </span>
            </div>
            <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span>صندوق كفالة الرسوم الأكاديمية</span>
              <span className="text-[#facc15] font-black">•</span>
              <span className="text-zinc-600 font-semibold">المملكة الأردنية الهاشمية</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-zinc-700">
          <a
            href="#"
            className="text-black hover:text-[#16a34a] transition-colors relative py-1"
          >
            الرئيسية
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#22c55e] rounded-full"></span>
          </a>
          <a
            href="#guidelines"
            className="hover:text-[#16a34a] transition-colors py-1"
          >
            الشروط والأهلية
          </a>
          <a
            href="#faq"
            className="hover:text-[#16a34a] transition-colors py-1"
          >
            الأسئلة الشائعة
          </a>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-black py-1 px-3 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>بوابة الإدارة</span>
          </Link>
        </nav>

        {/* CTA Button & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#apply"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs sm:text-sm font-black border-2 border-black active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <span>تقديم طلب الكفالة</span>
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 focus:outline-none"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-emerald-600"
          >
            الرئيسية
          </a>
          <a
            href="#guidelines"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-zinc-700 hover:text-black"
          >
            الشروط والأهلية
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-zinc-700 hover:text-black"
          >
            الأسئلة الشائعة
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-semibold text-zinc-600 hover:text-black"
          >
            <Shield className="w-4 h-4 text-zinc-400" />
            <span>بوابة الإدارة</span>
          </Link>
          <a
            href="#apply"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#22c55e] text-white font-extrabold text-sm border-2 border-black"
          >
            <span>تقديم طلب الكفالة</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}
