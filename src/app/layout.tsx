import type { Metadata } from 'next';
import { Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مبادرة المنح الدراسية للطلاب الأكثر حاجة | بوابة التقديم الرسمية',
  description:
    'بوابة التقديم الرسمية والشفافة لمبادرة المنح الدراسية المخصصة للطلاب الأكثر حاجة اقتصادية، لاعتماد 6 منح دراسية وفق معايير موضوعية ومعلنة.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${notoArabic.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-slate-200 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
