'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X, ArrowDown, Shield } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
            <GraduationCap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-bold text-zinc-900 text-base sm:text-lg tracking-tight block">
            مبادرة د. علي الرحامنة التعليمية
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
          <a
            href="#"
            className="text-emerald-600 font-semibold transition-colors relative py-1"
          >
            الرئيسية
          </a>
          <a
            href="#guidelines"
            className="hover:text-zinc-900 transition-colors py-1"
          >
            الشروط والأهلية
          </a>
          <a
            href="#faq"
            className="hover:text-zinc-900 transition-colors py-1"
          >
            الأسئلة الشائعة
          </a>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 py-1 px-3 rounded-lg hover:bg-zinc-100/70 transition-colors text-xs sm:text-sm"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>بوابة الإدارة</span>
          </Link>
        </nav>

        {/* CTA Button & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#apply"
            className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <span>تقديم طلب الكفالة</span>
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.2]" />
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
            className="block py-2 text-sm font-semibold text-emerald-600"
          >
            الرئيسية
          </a>
          <a
            href="#guidelines"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-700 hover:text-black"
          >
            الشروط والأهلية
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-700 hover:text-black"
          >
            الأسئلة الشائعة
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-zinc-600 hover:text-black"
          >
            <Shield className="w-4 h-4 text-zinc-400" />
            <span>بوابة الإدارة</span>
          </Link>
          <a
            href="#apply"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
          >
            <span>تقديم طلب الكفالة</span>
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      )}
    </header>
  );
}
