'use client';

import React from 'react';
import { Mail, GraduationCap, ArrowUp, ShieldCheck, HeartHandshake, CheckCircle2, Award } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800 no-print relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-14 sm:pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-zinc-800/80">
          
          {/* Column 1: Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 text-right space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-bold text-white text-base sm:text-lg tracking-tight block">
                مبادرة د. علي الرحامنة التعليمية
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md font-normal">
              مبادرة تعليمية أهلية مستقلة تهدف إلى كفالة رسوم الساعات الجامعية للطلبة المتعثرين والأكثر استحقاقاً في الجامعات والكليات الأردنية المعتمدة، وفق معايير المفاضلة الشفافة والتدقيق المكتبي الموثق.
            </p>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="font-bold text-sm text-zinc-100 mb-3.5 sm:mb-4">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li>
                <a href="#" className="hover:text-white transition-colors block py-0.5">الرئيسية</a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-white transition-colors block py-0.5">شروط الأهلية والمفاضلة</a>
              </li>
              <li>
                <a href="#apply" className="hover:text-white transition-colors block py-0.5">استمارة التقديم</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors block py-0.5">الأسئلة الشائعة</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust Standards (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="font-bold text-sm text-zinc-100 mb-3.5 sm:mb-4">
              ضوابط الكفالة
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-normal">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2]" />
                <span>تدقيق مكتبي محايد</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2]" />
                <span>دفع مباشر للجامعة</span>
              </li>
              <li className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2]" />
                <span>تكافؤ الفرص بدون وساطة</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2]" />
                <span>سرية تامة لبيانات الأسرة</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Back-to-Top (3 cols) */}
          <div className="lg:col-span-3 text-right flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-zinc-100 mb-3.5 sm:mb-4">
                التواصل والاستفسارات
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3 font-normal">
                تستقبل أمانة سر المبادرة كافة الاستفسارات الرسمية عبر البريد الإلكتروني:
              </p>
              <a
                href="mailto:info@scholarship-initiative.org"
                className="inline-flex items-center gap-2 p-3 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-colors text-xs font-normal w-full"
                dir="ltr"
              >
                <Mail className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2]" />
                <span className="font-mono text-xs truncate">info@scholarship-initiative.org</span>
              </a>
            </div>

            <div className="pt-5 sm:pt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>العودة لأعلى الصفحة</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-normal text-zinc-500 text-center sm:text-right">
          <div>
            <span>© {new Date().getFullYear()} مبادرة د. علي الرحامنة التعليمية لكفالة التعليم الجامعي. كافة الحقوق محفوظة.</span>
          </div>
          <div>
            <span>نحو مستقبل أكاديمي واعد لكل طالب وطالبة في الأردن</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
