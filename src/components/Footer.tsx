'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, GraduationCap, ArrowUp, ShieldCheck, HeartHandshake, CheckCircle2, Award } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-900 text-white border-t border-zinc-800 no-print relative overflow-hidden">
      {/* Top Colorful Accent Strip matching Header */}
      <div className="h-1 bg-gradient-to-r from-[#22c55e] via-[#facc15] to-[#22c55e]"></div>

      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#facc15]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-zinc-800/80">
          
          {/* Column 1: Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 text-right space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center shadow-lg border-2 border-white/10">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg tracking-tight block">
                  مبادرة د. علي التعليمية
                </span>
                <span className="text-xs text-[#facc15] font-semibold flex items-center gap-1.5">
                  صندوق كفالة الرسوم الأكاديمية الجامعية
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md font-normal">
              مبادرة تعليمية أهلية مستقلة تهدف إلى كفالة رسوم الساعات الجامعية للطلبة المتعثرين والأكثر استحقاقاً في الجامعات والكليات الأردنية المعتمدة، وفق معايير المفاضلة الشفافة والتدقيق المكتبي الموثق.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-[11px] font-medium text-zinc-300">
                <span>المملكة الأردنية الهاشمية</span>
                <span className="text-xs">🇯🇴</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>دورة 2025/2026 المفتوحة</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
              <span>روابط سريعة</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li>
                <a href="#" className="hover:text-[#22c55e] transition-colors">الرئيسية</a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-[#22c55e] transition-colors">شروط الأهلية والمفاضلة</a>
              </li>
              <li>
                <a href="#apply" className="hover:text-[#22c55e] transition-colors">استمارة التقديم</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#22c55e] transition-colors">الأسئلة الشائعة</a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#facc15] transition-colors flex items-center gap-1">
                  <span>بوابة تدقيق الطلبات</span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">إدارة</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust Standards (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]"></span>
              <span>ضوابط الكفالة</span>
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>تدقيق مكتبي محايد</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>دفع مباشر للجامعة</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#facc15] shrink-0" />
                <span>تكافؤ الفرص بدون وساطة</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>سرية تامة لبيانات الأسرة</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Back-to-Top (3 cols) */}
          <div className="lg:col-span-3 text-right flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                <span>التواصل والاستفسارات</span>
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                تستقبل أمانة سر المبادرة كافة الاستفسارات الرسمية المتعلقة بالطلبات عبر البريد:
              </p>
              <a
                href="mailto:info@scholarship-initiative.org"
                className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 hover:border-emerald-500/50 hover:bg-zinc-800 text-xs text-emerald-400 transition-colors w-full"
                dir="ltr"
              >
                <Mail className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span className="font-mono text-xs truncate">info@scholarship-initiative.org</span>
              </a>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#facc15]" />
                <span>العودة لأعلى الصفحة</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="text-right">
            <span>© {new Date().getFullYear()} مبادرة د. علي التعليمية لكفالة التعليم الجامعي. كافة الحقوق محفوظة.</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span>نحو مستقبل أكاديمي واعد لكل طالب وطالبة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
