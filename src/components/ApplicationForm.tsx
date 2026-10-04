'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Printer,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
} from 'lucide-react';
import { PublicApplicationSubmissionInput } from '@/lib/validation';

export default function ApplicationForm() {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceNumber: string;
    createdAt: string;
  } | null>(null);

  // Anti-bot & Idempotency
  const [submissionTimestamp, setSubmissionTimestamp] = useState<number>(Date.now());
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');

  useEffect(() => {
    const rand = Math.random().toString(36).substring(2, 12);
    setIdempotencyKey(`app-${Date.now()}-${rand}`);
    setSubmissionTimestamp(Date.now());
  }, []);

  // Form State (kept in-memory only)
  const [formData, setFormData] = useState({
    // 1. Personal & Academic
    fullName: '',
    phoneCountryCode: '+962',
    phoneNumber: '',
    email: '',
    governorateOrCity: '',
    preferredContactMethod: 'phone' as 'phone' | 'whatsapp' | 'email',

    institutionName: '',
    studyLevel: 'بكالوريوس',
    major: '',
    academicYearOrSemester: 'السنة الأولى',
    enrollmentStatus: 'enrolled' as 'enrolled' | 'accepted' | 'paused',
    periodTuitionFee: '' as unknown as number,
    amountAlreadyPaid: '' as unknown as number,
    confirmedExternalSupport: '' as unknown as number,
    isPaymentDeadlineNear: false,
    atRiskOfSuspension: false,
    otherScholarshipsOrDiscounts: 'none' as 'none' | 'partial' | 'full',

    // 2. Household & Income
    householdSize: 5,
    dependentsCount: 3,
    earnersCount: 1,
    actualBreadwinner: 'father' as 'father' | 'mother' | 'student' | 'brother_sister' | 'relative' | 'none_shared',
    fatherStatus: 'working' as 'working' | 'unemployed' | 'retired' | 'deceased' | 'unavailable' | 'not_applicable' | 'other',
    motherStatus: 'unemployed' as 'working' | 'unemployed' | 'retired' | 'deceased' | 'unavailable' | 'not_applicable' | 'other',
    alternativeSupportAvailable: 'no' as 'yes' | 'no' | 'partial',
    recentBreadwinnerLoss: false,

    fatherIncomeAmount: '' as unknown as number,
    fatherIncomeKnown: 'known' as 'known' | 'unknown' | 'na',
    motherIncomeAmount: '' as unknown as number,
    motherIncomeKnown: 'known' as 'known' | 'unknown' | 'na',
    studentHasIncome: false,
    studentIncomeAmount: '' as unknown as number,
    pensionsAmount: '' as unknown as number,
    regularAidAmount: '' as unknown as number,
    hasSeasonalIncome: false,
    seasonalIncomeCalculationMethod: '',

    // 3. Expenses & Declarations
    housingStatus: 'rented' as 'owned' | 'rented' | 'living_with_relatives' | 'other',
    monthlyRent: '' as unknown as number,
    recurringNecessaryMedicalExpenses: '' as unknown as number,
    basicTransportExpenses: '' as unknown as number,
    recentJobLossOrIncomeDrop: false,
    additionalContext: '',

    infoAccuracyAcknowledged: false,
    dataUseAcknowledged: false,
    willingToProvideDocsAcknowledged: false,
    noGuaranteeAcknowledged: false,
  });

  const periodTuition = Number(formData.periodTuitionFee) || 0;
  const paid = Number(formData.amountAlreadyPaid) || 0;
  const support = Number(formData.confirmedExternalSupport) || 0;
  const calculatedUncovered = Math.max(0, periodTuition - paid - support);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const validateStep = (currentStep: number): boolean => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 5) {
        setErrorMessage('يرجى كتابة الاسم الرباعي كاملاً (5 أحرف على الأقل).');
        return false;
      }
      if (!formData.phoneNumber.trim() || !/^\d{7,15}$/.test(formData.phoneNumber.trim())) {
        setErrorMessage('يرجى إدخال رقم هاتف صالح للتواصل.');
        return false;
      }
      if (!formData.governorateOrCity.trim()) {
        setErrorMessage('يرجى إدخال المدينة أو المحافظة.');
        return false;
      }
      if (!formData.institutionName.trim()) {
        setErrorMessage('يرجى تحديد المؤسسة التعليمية (الجامعة أو الكلية).');
        return false;
      }
      if (!formData.major.trim()) {
        setErrorMessage('يرجى إدخال التخصص الأكاديمي.');
        return false;
      }
      if (formData.periodTuitionFee === ('' as unknown as number) || periodTuition < 0) {
        setErrorMessage('يرجى تحديد رسوم الفترة المستحقة.');
        return false;
      }
      if (calculatedUncovered <= 0) {
        setErrorMessage('المبلغ المتبقي غير المغطى يساوي صفراً. المنحة مخصصة للرسوم المتبقية المستحقة.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (formData.householdSize < 1) {
        setErrorMessage('عدد أفراد الأسرة يجب أن يكون 1 على الأقل.');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (formData.housingStatus === 'rented' && (!formData.monthlyRent || Number(formData.monthlyRent) <= 0)) {
        setErrorMessage('عند اختيار سكن بالإيجار، يرجى كتابة قيمة الإيجار الشهري التقريبية.');
        return false;
      }
      if (
        !formData.infoAccuracyAcknowledged ||
        !formData.dataUseAcknowledged ||
        !formData.willingToProvideDocsAcknowledged ||
        !formData.noGuaranteeAcknowledged
      ) {
        setErrorMessage('يجب الموافقة على جميع الإقرارات والتعهدات أدناه قبل إرسال الطلب.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(3, prev + 1));
      const el = document.getElementById('apply');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const isFatherAbsent = ['deceased', 'unavailable', 'not_applicable'].includes(formData.fatherStatus);
    const isMotherAbsent = ['deceased', 'unavailable', 'not_applicable'].includes(formData.motherStatus);

    const payload: PublicApplicationSubmissionInput = {
      idempotencyKey,
      website_url_hp: honeypot,
      submissionTimestamp,

      fullName: formData.fullName.trim(),
      phoneCountryCode: formData.phoneCountryCode.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim() || undefined,
      governorateOrCity: formData.governorateOrCity.trim(),
      preferredContactMethod: formData.preferredContactMethod,

      institutionName: formData.institutionName.trim(),
      studyLevel: formData.studyLevel.trim(),
      major: formData.major.trim(),
      academicYearOrSemester: formData.academicYearOrSemester.trim(),
      enrollmentStatus: formData.enrollmentStatus,
      periodTuitionFee: Number(formData.periodTuitionFee) || 0,
      amountAlreadyPaid: Number(formData.amountAlreadyPaid) || 0,
      confirmedExternalSupport: Number(formData.confirmedExternalSupport) || 0,
      isPaymentDeadlineNear: formData.isPaymentDeadlineNear,
      atRiskOfSuspension: formData.atRiskOfSuspension,
      otherScholarshipsOrDiscounts: formData.otherScholarshipsOrDiscounts,

      householdSize: Number(formData.householdSize) || 1,
      dependentsCount: Number(formData.dependentsCount) || 0,
      earnersCount: Number(formData.earnersCount) || 0,
      otherStudyingFamilyMembersCount: 0,
      actualBreadwinner: formData.actualBreadwinner,
      fatherStatus: formData.fatherStatus,
      motherStatus: formData.motherStatus,
      alternativeSupportAvailable: formData.alternativeSupportAvailable,
      recentBreadwinnerLoss: formData.recentBreadwinnerLoss,

      income: {
        fatherIncome: isFatherAbsent
          ? null
          : formData.fatherIncomeKnown === 'unknown'
          ? { amount: null, frequency: 'fixed', isNetAvailable: true, isUnknown: true }
          : {
              amount: formData.fatherIncomeAmount !== ('' as unknown as number) ? Number(formData.fatherIncomeAmount) : null,
              frequency: 'fixed',
              isNetAvailable: true,
              isUnknown: false,
            },
        motherIncome: isMotherAbsent
          ? null
          : formData.motherIncomeKnown === 'unknown'
          ? { amount: null, frequency: 'fixed', isNetAvailable: true, isUnknown: true }
          : {
              amount: formData.motherIncomeAmount !== ('' as unknown as number) ? Number(formData.motherIncomeAmount) : null,
              frequency: 'fixed',
              isNetAvailable: true,
              isUnknown: false,
            },
        studentIncome: formData.studentHasIncome
          ? {
              amount: Number(formData.studentIncomeAmount) || 0,
              frequency: 'fixed',
              isNetAvailable: true,
              isUnknown: false,
            }
          : null,
        otherFamilyContributions: null,
        pensions: formData.pensionsAmount !== ('' as unknown as number) && Number(formData.pensionsAmount) > 0
          ? { amount: Number(formData.pensionsAmount), frequency: 'fixed', isNetAvailable: true, isUnknown: false }
          : null,
        regularCashAid: formData.regularAidAmount !== ('' as unknown as number) && Number(formData.regularAidAmount) > 0
          ? { amount: Number(formData.regularAidAmount), frequency: 'fixed', isNetAvailable: true, isUnknown: false }
          : null,
      },
      hasSeasonalIncome: formData.hasSeasonalIncome,
      seasonalIncomeCalculationMethod: formData.seasonalIncomeCalculationMethod.trim() || undefined,

      housingStatus: formData.housingStatus,
      monthlyRent: formData.housingStatus === 'rented' && formData.monthlyRent ? Number(formData.monthlyRent) : null,
      recurringNecessaryMedicalExpenses: formData.recurringNecessaryMedicalExpenses ? Number(formData.recurringNecessaryMedicalExpenses) : null,
      necessaryCareObligations: null,
      otherFamilyEducationExpenses: null,
      basicTransportExpenses: formData.basicTransportExpenses ? Number(formData.basicTransportExpenses) : null,
      otherObligations: [],

      recentJobLossOrIncomeDrop: formData.recentJobLossOrIncomeDrop,
      deathOrAbsenceOfBreadwinnerImpact: false,
      healthOrCaregivingBurdenImpact: false,
      additionalContext: formData.additionalContext.trim() || undefined,

      infoAccuracyAcknowledged: true,
      dataUseAcknowledged: true,
      willingToProvideDocsAcknowledged: true,
      noGuaranteeAcknowledged: true,
    };

    try {
      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء حفظ الطلب.');
      }

      setSuccessData({
        referenceNumber: data.referenceNumber,
        createdAt: data.createdAt,
      });
      const el = document.getElementById('apply');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (successData) {
    return (
      <section id="apply" className="py-16 bg-slate-50/50">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              تم استلام وتأكيد طلبك بنجاح
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              طلبك الآن مقيد رسمياً لدى لجنة المراجعة برقم مرجعي فريد لمتابعة التدقيق المكتبي.
            </p>

            {/* Official Receipt Card */}
            <div className="receipt-card border border-slate-200 rounded-xl p-5 bg-slate-50/50 mb-6 text-right text-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-3.5">
                <div>
                  <div className="font-bold text-slate-900 text-sm">إيصال استلام طلب كفالة دراسية</div>
                  <div className="text-[11px] text-slate-500">مبادرة المنح الجامعية الرسمية</div>
                </div>
                <div className="font-mono font-bold text-slate-900 text-xs bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {successData.referenceNumber}
                </div>
              </div>

              <dl className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-500">اسم المتقدم:</dt>
                  <dd className="font-semibold text-slate-900">{formData.fullName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">المؤسسة التعليمية والتخصص:</dt>
                  <dd className="font-medium text-slate-900">{formData.institutionName} - {formData.major}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">تاريخ الإرسال:</dt>
                  <dd className="font-medium text-slate-800">
                    {new Date(successData.createdAt).toLocaleDateString('ar-JO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <dt className="text-slate-500">الحالة:</dt>
                  <dd className="font-semibold text-slate-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>قيد المراجعة والتدقيق المكتبي</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-800 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة أو حفظ الإيصال (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setStep(1);
                  window.location.reload();
                }}
                className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-14 sm:py-20 bg-slate-50/40">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            استمارة طلب المنحة
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            يرجى تعبئة كافة الحقول بدقة. تُحفظ البيانات أثناء الكتابة وتُرسل مباشرة إلى قاعدة البيانات.
          </p>
        </div>

        {/* Minimalist 3-Step Indicator */}
        <div className="mb-6 flex items-center justify-between text-xs font-semibold text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className={step >= 1 ? 'text-slate-900' : ''}>1. الدراسة والتواصل</span>
          <span className="text-slate-300">•</span>
          <span className={step >= 2 ? 'text-slate-900' : ''}>2. الأسرة والدخل</span>
          <span className="text-slate-300">•</span>
          <span className={step >= 3 ? 'text-slate-900' : ''}>3. المصاريف والمصادقة</span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-950 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Honeypot */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <input
              type="text"
              name="website_url_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* STEP 1: Personal & Academic Study */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-800 mb-1.5">
                    الاسم الرباعي كاملاً <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      رقم الهاتف للتواصل <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2" dir="ltr">
                      <input
                        type="text"
                        readOnly
                        value={formData.phoneCountryCode}
                        className="w-16 h-11 px-2 text-sm rounded-lg border border-slate-200 bg-slate-100 text-center font-mono text-slate-700"
                      />
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                        className="flex-1 h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="governorateOrCity" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      المدينة أو المحافظة <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="governorateOrCity"
                      type="text"
                      required
                      value={formData.governorateOrCity}
                      onChange={(e) => updateField('governorateOrCity', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="institutionName" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      المؤسسة التعليمية (الجامعة / الكلية) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="institutionName"
                      type="text"
                      required
                      value={formData.institutionName}
                      onChange={(e) => updateField('institutionName', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="major" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      التخصص الأكاديمي <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="major"
                      type="text"
                      required
                      value={formData.major}
                      onChange={(e) => updateField('major', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="academicYearOrSemester" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      السنة أو الفصل الدراسي <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="academicYearOrSemester"
                      type="text"
                      required
                      value={formData.academicYearOrSemester}
                      onChange={(e) => updateField('academicYearOrSemester', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="enrollmentStatus" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      الحالة الأكاديمية الراهنة <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="enrollmentStatus"
                      value={formData.enrollmentStatus}
                      onChange={(e) => updateField('enrollmentStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    >
                      <option value="enrolled">منتظم في الدراسة حالياً</option>
                      <option value="accepted">مقبول حديثاً ومطالب بالسداد</option>
                      <option value="paused">متوقف أو معلق بسبب الرسوم</option>
                    </select>
                  </div>
                </div>

                {/* Tuition Details Box */}
                <div className="pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="periodTuitionFee" className="block text-xs font-semibold text-slate-800 mb-1">
                          رسوم الفترة المطلوبة (د.أ) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="periodTuitionFee"
                          type="number"
                          min="0"
                          required
                          value={formData.periodTuitionFee}
                          onChange={(e) => updateField('periodTuitionFee', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white font-mono focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label htmlFor="amountAlreadyPaid" className="block text-xs font-semibold text-slate-800 mb-1">
                          المبلغ المدفوع إن وجد (د.أ)
                        </label>
                        <input
                          id="amountAlreadyPaid"
                          type="number"
                          min="0"
                          value={formData.amountAlreadyPaid}
                          onChange={(e) => updateField('amountAlreadyPaid', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full h-10 px-3 text-sm rounded-lg border border-slate-200 bg-white font-mono focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">المبلغ المتبقي المطلوب كفالته:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {calculatedUncovered.toLocaleString('ar-JO')} د.أ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Household & Income */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="householdSize" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      عدد أفراد الأسرة المقيمين معاً <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="householdSize"
                      type="number"
                      min="1"
                      required
                      value={formData.householdSize}
                      onChange={(e) => updateField('householdSize', Number(e.target.value))}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="actualBreadwinner" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      من يعيل الأسرة فعلياً؟ <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="actualBreadwinner"
                      value={formData.actualBreadwinner}
                      onChange={(e) => updateField('actualBreadwinner', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="father">الأب</option>
                      <option value="mother">الأم</option>
                      <option value="student">الطالب نفسه</option>
                      <option value="brother_sister">أخ أو أخت</option>
                      <option value="relative">قريب آخر</option>
                      <option value="none_shared">لا يوجد معيل ثابت</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fatherStatus" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      حالة الأب <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="fatherStatus"
                      value={formData.fatherStatus}
                      onChange={(e) => updateField('fatherStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="working">يعمل</option>
                      <option value="unemployed">لا يعمل / متعطل</option>
                      <option value="retired">متقاعد</option>
                      <option value="deceased">متوفى</option>
                      <option value="unavailable">غير متاح / غائب</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="motherStatus" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      حالة الأم <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="motherStatus"
                      value={formData.motherStatus}
                      onChange={(e) => updateField('motherStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="unemployed">ربة منزل / لا تعمل</option>
                      <option value="working">تعمل</option>
                      <option value="retired">متقاعدة</option>
                      <option value="deceased">متوفاة</option>
                      <option value="unavailable">غير متاحة / غائبة</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Income Sources */}
                <div className="pt-2 space-y-3">
                  {!['deceased', 'unavailable'].includes(formData.fatherStatus) && (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">دخل الأب الشهري (د.أ)</div>
                        <div className="text-[11px] text-slate-500">الراتب أو العائد الصافي</div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={formData.fatherIncomeAmount}
                        onChange={(e) => updateField('fatherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-32 h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white font-mono focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  )}

                  {!['deceased', 'unavailable'].includes(formData.motherStatus) && (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">دخل الأم الشهري (د.أ)</div>
                        <div className="text-[11px] text-slate-500">الراتب أو العائد الصافي</div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={formData.motherIncomeAmount}
                        onChange={(e) => updateField('motherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-32 h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white font-mono focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  )}

                  {/* Pensions or aid */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">معاشات تقاعدية / تأمينات (د.أ)</div>
                      <div className="text-[11px] text-slate-500">معاش التقاعد أو الدعم البديل إن وجد</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={formData.pensionsAmount}
                      onChange={(e) => updateField('pensionsAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-32 h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white font-mono focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">مساعدات نقدية منتظمة (د.أ)</div>
                      <div className="text-[11px] text-slate-500">المعونة الوطنية أو دعم الجمعيات المستمر</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={formData.regularAidAmount}
                      onChange={(e) => updateField('regularAidAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-32 h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white font-mono focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Expenses, Obligations & Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="housingStatus" className="block text-xs font-semibold text-slate-800 mb-1.5">
                      حالة سكن الأسرة <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="housingStatus"
                      value={formData.housingStatus}
                      onChange={(e) => updateField('housingStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="rented">إيجار</option>
                      <option value="owned">ملك</option>
                      <option value="living_with_relatives">إقامة مع الأقارب</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  {formData.housingStatus === 'rented' && (
                    <div>
                      <label htmlFor="monthlyRent" className="block text-xs font-semibold text-slate-800 mb-1.5">
                        الإيجار الشهري التقريبي (د.أ) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="monthlyRent"
                        type="number"
                        min="0"
                        value={formData.monthlyRent}
                        onChange={(e) => updateField('monthlyRent', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="recurringNecessaryMedicalExpenses" className="block text-xs font-semibold text-slate-800 mb-1.5">
                    مصاريف علاجية شهرية متكررة لأمراض مزمنة غير مغطاة (د.أ) إن وجدت
                  </label>
                  <input
                    id="recurringNecessaryMedicalExpenses"
                    type="number"
                    min="0"
                    value={formData.recurringNecessaryMedicalExpenses}
                    onChange={(e) => updateField('recurringNecessaryMedicalExpenses', e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full h-11 px-3.5 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="additionalContext" className="block text-xs font-semibold text-slate-800 mb-1.5">
                    ملاحظات أو ظروف خاصة تود إحاطة اللجنة بها (اختياري)
                  </label>
                  <textarea
                    id="additionalContext"
                    value={formData.additionalContext}
                    onChange={(e) => updateField('additionalContext', e.target.value)}
                    rows={2}
                    className="w-full p-3 text-sm rounded-lg border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
                  />
                </div>

                {/* Declarations (Mandatory) */}
                <div className="pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.infoAccuracyAcknowledged}
                        onChange={(e) => updateField('infoAccuracyAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0 shrink-0"
                      />
                      <span>أقر بصحة ودقة كافة المعلومات المدخلة حسب علمي ومعرفتي.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.dataUseAcknowledged}
                        onChange={(e) => updateField('dataUseAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0 shrink-0"
                      />
                      <span>أوافق على استخدام هذه البيانات من قبل لجنة المبادرة لدراسة الطلب بسرية تامة.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.willingToProvideDocsAcknowledged}
                        onChange={(e) => updateField('willingToProvideDocsAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0 shrink-0"
                      />
                      <span>أتعهد بتقديم كافة المستندات الثبوتية الرسمية عند طلب اللجنة للتحقق المكتبي.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.noGuaranteeAcknowledged}
                        onChange={(e) => updateField('noGuaranteeAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0 shrink-0"
                      />
                      <span>أعلم أن تقديم الطلب لا يضمن القبول التلقائي ويخضع لقرار اللجنة.</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الخطوة السابقة</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>متابعة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جارٍ تأكيد الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب نهائياً</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
