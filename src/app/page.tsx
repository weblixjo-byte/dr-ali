import type { Metadata } from 'next';
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Guidelines from '@/components/Guidelines';
import ApplicationForm from '@/components/ApplicationForm';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'مبادرة من حقك تتعلم | كفالة الرسوم الجامعية',
  description:
    'البوابة الرسمية لكفالة الرسوم الأكاديمية للطلبة المقبلين على التعليم الجامعي والمنتظمين فيه من ذوي الحاجة الاقتصادية في المملكة الأردنية الهاشمية.',
  openGraph: {
    title: 'مبادرة من حقك تتعلم',
    description:
      'البوابة الرسمية لكفالة الرسوم الأكاديمية للطلبة المقبلين على التعليم الجامعي والمنتظمين فيه من ذوي الحاجة الاقتصادية في المملكة الأردنية الهاشمية.',
    url: '/',
    siteName: 'مبادرة من حقك تتعلم',
    locale: 'ar_JO',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'مبادرة من حقك تتعلم لكفالة الرسوم الجامعية',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مبادرة من حقك تتعلم',
    description:
      'البوابة الرسمية لكفالة الرسوم الأكاديمية للطلبة المقبلين على التعليم الجامعي والمنتظمين فيه من ذوي الحاجة الاقتصادية في المملكة الأردنية الهاشمية.',
    images: ['/og-image.jpg'],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Guidelines (Conditions and Eligibility) */}
        <Guidelines />

        {/* 4. Streamlined Application Form */}
        <ApplicationForm />

        {/* 5. Essential FAQ */}
        <FaqSection />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
