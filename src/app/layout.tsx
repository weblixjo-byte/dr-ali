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
  title: 'مبادرة د. علي الرحامنة التعليمية',
  description:
    'البوابة الرسمية لكفالة الرسوم الأكاديمية للطلبة المقبلين على التعليم الجامعي والمنتظمين فيه من ذوي الحاجة الاقتصادية في المملكة الأردنية الهاشمية.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${notoArabic.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
