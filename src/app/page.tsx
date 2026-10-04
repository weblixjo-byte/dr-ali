import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ScholarshipDetails from '@/components/ScholarshipDetails';
import CriteriaSection from '@/components/CriteriaSection';
import SelectionTimeline from '@/components/SelectionTimeline';
import TransparencySection from '@/components/TransparencySection';
import FaqSection from '@/components/FaqSection';
import ApplicationForm from '@/components/ApplicationForm';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Header */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero & Purpose (Target: 6, no promise of acceptance) */}
        <Hero />

        {/* 3. Scholarship Details (Coverage, cap, institutions, schedule) */}
        <ScholarshipDetails />

        {/* 4. Eligibility & Priority Criteria (100 points, weights, tie-breaker) */}
        <CriteriaSection />

        {/* 5. Selection Mechanism (5-step process) */}
        <SelectionTimeline />

        {/* 6. Transparency Section (Live counts, privacy pledge) */}
        <TransparencySection />

        {/* 7. Frequently Asked Questions (FAQ) */}
        <FaqSection />

        {/* 8. Application Form (Multi-step, in-memory draft, conditional logic, printable receipt) */}
        <ApplicationForm />
      </main>

      {/* 9. Privacy Policy & Contacts */}
      <Footer />
    </div>
  );
}
