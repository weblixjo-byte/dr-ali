import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-12 text-xs text-zinc-500 no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-sm bg-black text-white flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-black text-xs block">
              مبادرة د. علي التعليمية
            </span>
            <span className="text-[11px] text-zinc-400">
              صندوق كفالة الرسوم الجامعية للطلبة الأكثر حاجة • المملكة الأردنية الهاشمية
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-zinc-600">
          <a
            href="mailto:info@scholarship-initiative.org"
            className="hover:text-black flex items-center gap-1.5 transition-colors"
            dir="ltr"
          >
            <Mail className="w-3.5 h-3.5 text-black" />
            <span className="font-mono text-xs">info@scholarship-initiative.org</span>
          </a>
          <span className="text-zinc-400">© {new Date().getFullYear()} كافة الحقوق محفوظة</span>
        </div>
      </div>
    </footer>
  );
}
