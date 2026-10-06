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
