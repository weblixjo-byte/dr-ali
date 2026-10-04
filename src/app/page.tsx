import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Guidelines from '@/components/Guidelines';
import ApplicationForm from '@/components/ApplicationForm';
import FaqSection from '@/components/FaqSection';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero */}
        <Hero />

        {/* 3. Guidelines (3 clean essentials without criteria leakage) */}
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
