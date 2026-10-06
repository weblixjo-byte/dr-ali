'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, GraduationCap, ArrowUp, ShieldCheck, HeartHandshake, CheckCircle2, Award } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#16a34a] text-white border-t-4 border-black no-print relative overflow-hidden">
      {/* Top Yellow Cartoon Accent Strip */}
      <div className="h-2.5 bg-[#facc15] border-b-2 border-black"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b-2 border-black/20">
          
          {/* Column 1: Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 text-right space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#16a34a] flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <GraduationCap className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-white text-xl tracking-tight block">
                  مبادرة د. علي التعليمية
                </span>
                <span className="text-xs text-amber-200 font-bold flex items-center gap-1.5 mt-0.5">
                  صندوق كفالة الرسوم الأكاديمية الجامعية
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed max-w-md font-semibold">
              مبادرة تعليمية أهلية مستقلة تهدف إلى كفالة رسوم الساعات الجامعية للطلبة المتعثرين والأكثر استحقاقاً في الجامعات والكليات الأردنية المعتمدة، وفق معايير المفاضلة الشفافة والتدقيق المكتبي الموثق.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span>المملكة الأردنية الهاشمية</span>
                <span>🇯🇴</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#facc15] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                <span>دورة 2025/2026</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="font-black text-base text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black"></span>
              <span>روابط سريعة</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-white/95">
              <li>
                <a href="#" className="hover:text-amber-200 hover:underline transition-colors block py-0.5">الرئيسية</a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-amber-200 hover:underline transition-colors block py-0.5">شروط الأهلية والمفاضلة</a>
              </li>
              <li>
                <a href="#apply" className="hover:text-amber-200 hover:underline transition-colors block py-0.5">استمارة التقديم</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-200 hover:underline transition-colors block py-0.5">الأسئلة الشائعة</a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-200 hover:underline transition-colors inline-flex items-center gap-1.5 py-0.5">
                  <span>بوابة تدقيق الطلبات</span>
                  <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-md font-mono">إدارة</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust Standards (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="font-black text-base text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black"></span>
              <span>ضوابط الكفالة</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-white/95 font-bold">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-200 shrink-0 stroke-[2.5]" />
                <span>تدقيق مكتبي محايد</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-200 shrink-0 stroke-[2.5]" />
                <span>دفع مباشر للجامعة</span>
              </li>
              <li className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-200 shrink-0 stroke-[2.5]" />
                <span>تكافؤ الفرص بدون وساطة</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-200 shrink-0 stroke-[2.5]" />
                <span>سرية تامة لبيانات الأسرة</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Back-to-Top (3 cols) */}
          <div className="lg:col-span-3 text-right flex flex-col justify-between">
            <div>
              <h4 className="font-black text-base text-white mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black"></span>
                <span>التواصل والاستفسارات</span>
              </h4>
              <p className="text-xs text-white/95 leading-relaxed mb-3 font-semibold">
                تستقبل أمانة سر المبادرة كافة الاستفسارات الرسمية عبر البريد الإلكتروني:
              </p>
              <a
                href="mailto:info@scholarship-initiative.org"
                className="inline-flex items-center gap-2 p-3 rounded-2xl bg-white text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform text-xs font-bold w-full"
                dir="ltr"
              >
                <Mail className="w-4 h-4 text-[#16a34a] shrink-0 stroke-[2.5]" />
                <span className="font-mono text-xs truncate">info@scholarship-initiative.org</span>
              </a>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#facc15] hover:bg-[#eab308] text-black text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <ArrowUp className="w-4 h-4 stroke-[3]" />
                <span>العودة لأعلى الصفحة</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-white">
          <div className="text-right">
            <span>© {new Date().getFullYear()} مبادرة د. علي التعليمية لكفالة التعليم الجامعي. كافة الحقوق محفوظة.</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black"></span>
            <span>نحو مستقبل أكاديمي واعد لكل طالب وطالبة في الأردن</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
