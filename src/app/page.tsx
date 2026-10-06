import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StudentCrowd from '@/components/StudentCrowd';
import Guidelines from '@/components/Guidelines';
import ApplicationForm from '@/components/ApplicationForm';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section matching the user's requested visual layout */}
        <Hero />

        {/* 3. Moving Students Crowd Section (Moved to the section right below Hero) */}
        <section className="bg-white border-b border-zinc-200 pt-8 pb-0 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 text-[11px] font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200 rounded-full mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>مجتمع الطلبة الجامعيين في الأردن</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
              مسيرة الأمل والتمكين الأكاديمي
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto mt-1">
              نعمل على إتاحة فرصة التعليم الجامعي العادل والمستمر للطلبة المتعثرين ماليًا
            </p>
          </div>
          <StudentCrowd />
        </section>

        {/* 4. Guidelines (Conditions and Eligibility) */}
        <Guidelines />

        {/* 5. Streamlined Application Form */}
        <ApplicationForm />

        {/* 6. Essential FAQ */}
        <FaqSection />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
