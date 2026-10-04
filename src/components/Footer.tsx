import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-10 text-xs text-slate-500 no-print">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-800">مبادرة كفالة الرسوم الأكاديمية</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="mailto:info@scholarship-initiative.org"
            className="hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            dir="ltr"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>info@scholarship-initiative.org</span>
          </a>
          <span>© {new Date().getFullYear()} كافة الحقوق محفوظة</span>
        </div>
      </div>
    </footer>
  );
}
