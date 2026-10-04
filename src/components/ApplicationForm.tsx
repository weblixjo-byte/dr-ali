'use client';

import React, { useState, useEffect, useId } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Printer,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Send,
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

  // Anti-bot & Idempotency state
  const [submissionTimestamp, setSubmissionTimestamp] = useState<number>(Date.now());
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');

  useEffect(() => {
    // Generate fresh idempotency key in memory
    const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setIdempotencyKey(`client-sub-${Date.now()}-${rand}`);
    setSubmissionTimestamp(Date.now());
  }, []);

  // Form State (kept exclusively in React state memory, never stored in localStorage)
  const [formData, setFormData] = useState({
    // 1. Personal & Contact
    fullName: '',
    phoneCountryCode: '+966',
    phoneNumber: '',
    email: '',
    governorateOrCity: '',
    preferredContactMethod: 'phone' as 'phone' | 'whatsapp' | 'email',

    // Academic & Study
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
    educationNotes: '',

    // 2. Household & Family
    householdSize: 5,
    dependentsCount: 3,
    earnersCount: 1,
    otherStudyingFamilyMembersCount: 1,
    actualBreadwinner: 'father' as 'father' | 'mother' | 'student' | 'brother_sister' | 'relative' | 'none_shared',
    fatherStatus: 'working' as 'working' | 'unemployed' | 'retired' | 'deceased' | 'unavailable' | 'not_applicable' | 'other',
    motherStatus: 'unemployed' as 'working' | 'unemployed' | 'retired' | 'deceased' | 'unavailable' | 'not_applicable' | 'other',
    alternativeSupportAvailable: 'no' as 'yes' | 'no' | 'partial',
    recentBreadwinnerLoss: false,
    recentBreadwinnerLossDate: '',
    recentBreadwinnerLossImpact: '',
    familyNotes: '',

    // Income breakdown
    fatherIncomeAmount: '' as unknown as number,
    fatherIncomeKnown: 'known' as 'known' | 'unknown' | 'na',
    motherIncomeAmount: '' as unknown as number,
    motherIncomeKnown: 'known' as 'known' | 'unknown' | 'na',
    studentHasIncome: false,
    studentIncomeAmount: '' as unknown as number,
    pensionsAmount: '' as unknown as number,
    regularAidAmount: '' as unknown as number,
    irregularAidAnnualEstimate: '' as unknown as number,
    hasSeasonalIncome: false,
    seasonalIncomeCalculationMethod: '',

    // 3. Expenses & Obligations
    housingStatus: 'rented' as 'owned' | 'rented' | 'living_with_relatives' | 'other',
    monthlyRent: '' as unknown as number,
    recurringNecessaryMedicalExpenses: '' as unknown as number,
    necessaryCareObligations: '' as unknown as number,
    otherFamilyEducationExpenses: '' as unknown as number,
    basicTransportExpenses: '' as unknown as number,

    // Circumstances
    recentJobLossOrIncomeDrop: false,
    recentJobLossDetails: '',
    deathOrAbsenceOfBreadwinnerImpact: false,
    deathOrAbsenceImpactDetails: '',
    healthOrCaregivingBurdenImpact: false,
    healthOrCaregivingDetails: '',
    additionalContext: '',

    // 4. Declarations
    infoAccuracyAcknowledged: false,
    dataUseAcknowledged: false,
    willingToProvideDocsAcknowledged: false,
    noGuaranteeAcknowledged: false,
  });

  // Derived uncovered tuition calculation
  const periodTuition = Number(formData.periodTuitionFee) || 0;
  const paid = Number(formData.amountAlreadyPaid) || 0;
  const support = Number(formData.confirmedExternalSupport) || 0;
  const calculatedUncovered = Math.max(0, periodTuition - paid - support);

  // Field change handler
  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 5) {
        setErrorMessage('يرجى كتابة الاسم الرباعي كاملاً (5 أحرف على الأقل).');
        return false;
      }
      if (!formData.phoneNumber.trim() || !/^\d{7,15}$/.test(formData.phoneNumber.trim())) {
        setErrorMessage('يرجى إدخال رقم هاتف صالح مكون من أرقام فقط.');
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
        setErrorMessage('يرجى إدخال التخصص الدراسي.');
        return false;
      }
      if (formData.periodTuitionFee === ('' as unknown as number) || periodTuition < 0) {
        setErrorMessage('يرجى تحديد رسوم الفترة المستحقة بشكل صحيح.');
        return false;
      }
      if (calculatedUncovered <= 0) {
        setErrorMessage('المبلغ المتبقي غير المغطى يساوي صفراً. المنحة مخصصة للطلاب الذين عليهم رسوم متبقية تستلزم السداد.');
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
        setErrorMessage('عند اختيار سكن بالإيجار، يرجى توضيح قيمة الإيجار الشهري التقريبية.');
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
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
      setStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: document.getElementById('apply')?.offsetTop || 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Build standard payload
    const isFatherAbsent = ['deceased', 'unavailable', 'not_applicable'].includes(formData.fatherStatus);
    const isMotherAbsent = ['deceased', 'unavailable', 'not_applicable'].includes(formData.motherStatus);

    const payload: PublicApplicationSubmissionInput = {
      idempotencyKey,
      website_url_hp: honeypot,
      submissionTimestamp,

      // 1. Contact & Personal
      fullName: formData.fullName.trim(),
      phoneCountryCode: formData.phoneCountryCode.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim() || undefined,
      governorateOrCity: formData.governorateOrCity.trim(),
      preferredContactMethod: formData.preferredContactMethod,

      // Study
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
      educationNotes: formData.educationNotes.trim() || undefined,

      // 2. Family
      householdSize: Number(formData.householdSize) || 1,
      dependentsCount: Number(formData.dependentsCount) || 0,
      earnersCount: Number(formData.earnersCount) || 0,
      otherStudyingFamilyMembersCount: Number(formData.otherStudyingFamilyMembersCount) || 0,
      actualBreadwinner: formData.actualBreadwinner,
      fatherStatus: formData.fatherStatus,
      motherStatus: formData.motherStatus,
      alternativeSupportAvailable: formData.alternativeSupportAvailable,
      recentBreadwinnerLoss: formData.recentBreadwinnerLoss,
      recentBreadwinnerLossDate: formData.recentBreadwinnerLossDate || undefined,
      recentBreadwinnerLossImpact: formData.recentBreadwinnerLossImpact.trim() || undefined,
      familyNotes: formData.familyNotes.trim() || undefined,

      // Income Structure
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
        irregularAidAnnualEstimate: formData.irregularAidAnnualEstimate !== ('' as unknown as number)
          ? Number(formData.irregularAidAnnualEstimate)
          : null,
      },
      hasSeasonalIncome: formData.hasSeasonalIncome,
      seasonalIncomeCalculationMethod: formData.seasonalIncomeCalculationMethod.trim() || undefined,

      // 3. Expenses
      housingStatus: formData.housingStatus,
      monthlyRent: formData.housingStatus === 'rented' && formData.monthlyRent ? Number(formData.monthlyRent) : null,
      recurringNecessaryMedicalExpenses: formData.recurringNecessaryMedicalExpenses ? Number(formData.recurringNecessaryMedicalExpenses) : null,
      necessaryCareObligations: formData.necessaryCareObligations ? Number(formData.necessaryCareObligations) : null,
      otherFamilyEducationExpenses: formData.otherFamilyEducationExpenses ? Number(formData.otherFamilyEducationExpenses) : null,
      basicTransportExpenses: formData.basicTransportExpenses ? Number(formData.basicTransportExpenses) : null,
      otherObligations: [],

      // Circumstances
      recentJobLossOrIncomeDrop: formData.recentJobLossOrIncomeDrop,
      recentJobLossDetails: formData.recentJobLossDetails.trim() || undefined,
      deathOrAbsenceOfBreadwinnerImpact: formData.deathOrAbsenceOfBreadwinnerImpact,
      deathOrAbsenceImpactDetails: formData.deathOrAbsenceImpactDetails.trim() || undefined,
      healthOrCaregivingBurdenImpact: formData.healthOrCaregivingBurdenImpact,
      healthOrCaregivingDetails: formData.healthOrCaregivingDetails.trim() || undefined,
      additionalContext: formData.additionalContext.trim() || undefined,

      // Declarations
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
        throw new Error(data.error || 'حدث خطأ غير متوقع أثناء إرسال الطلب.');
      }

      setSuccessData({
        referenceNumber: data.referenceNumber,
        createdAt: data.createdAt,
      });
      window.scrollTo({ top: document.getElementById('apply')?.offsetTop || 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS STATE VIEW
  if (successData) {
    return (
      <section id="apply" className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="p-6 md:p-8 rounded border border-emerald-300 bg-white shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Check className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 mb-2">
              تم استلام طلبك وتثبيته في قاعدة البيانات بنجاح
            </h2>

            <p className="text-center text-sm text-gray-600 mb-6">
              طلبك الآن مقيد ومحفوظ رسمياً لدى لجنة المبادرة برقم مرجعي فريد.
            </p>

            {/* Printable Receipt Card (excludes sensitive financial details) */}
            <div className="receipt-card border border-gray-200 rounded p-6 bg-slate-50/70 mb-6 text-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
                <div>
                  <div className="font-bold text-slate-900 text-base">إيصال استلام طلب منحة دراسية</div>
                  <div className="text-xs text-gray-500">مبادرة دعم الطلاب الأكثر حاجة (6 منح معتمدة)</div>
                </div>
                <div className="text-left font-mono font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded border border-gray-200">
                  {successData.referenceNumber}
                </div>
              </div>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div>
                  <dt className="text-gray-500 text-xs">اسم المتقدم:</dt>
                  <dd className="font-semibold text-slate-900">{formData.fullName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">المؤسسة التعليمية:</dt>
                  <dd className="font-medium text-slate-900">{formData.institutionName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">التخصص الدراسي:</dt>
                  <dd className="font-medium text-slate-900">{formData.major}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">تاريخ وساعة الإرسال:</dt>
                  <dd className="font-medium text-slate-800">
                    {new Date(successData.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                  <dt className="text-gray-500 text-xs">الحالة الراهنة:</dt>
                  <dd className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span>قيد المراجعة والتدقيق المكتبي لدى اللجنة</span>
                  </dd>
                </div>
              </dl>

              <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 leading-relaxed">
                * ملاحظة مؤسسية: هذا الإيصال يؤكد استلام وحفظ طلبك فقط، ولا يمنح قبولاً أو وعداً بالاعتماد. تلتزم المبادرة بحماية خصوصيتك ولا يتضمن هذا الإيصال أي مبالغ مالية أو بيانات أسرية خاصة.
              </div>
            </div>

            {/* Print & Return Actions */}
            <div className="flex flex-col sm:flex-row gap-3 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded border border-gray-300 text-slate-800 bg-white hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
                className="py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors cursor-pointer text-center"
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
    <section id="apply" className="py-12 border-b border-gray-200 bg-slate-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center sm:text-right">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">استمارة تقديم الطلب</h2>
          <p className="text-sm text-gray-600">
            تعبئة البيانات مخصصة للطلاب الذين عليهم رسوم دراسية معلقة. تُحفظ المسودة في الذاكرة أثناء التعبئة.
          </p>
        </div>

        {/* Progress Bar & Steps Indicator */}
        <div className="mb-8 border border-gray-200 rounded bg-white p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-500 mb-3">
            <span className={step >= 1 ? 'text-slate-900 font-semibold' : ''}>1. الدراسة والتواصل</span>
            <span className={step >= 2 ? 'text-slate-900 font-semibold' : ''}>2. الأسرة والدخل</span>
            <span className={step >= 3 ? 'text-slate-900 font-semibold' : ''}>3. المصاريف والظروف</span>
            <span className={step >= 4 ? 'text-slate-900 font-semibold' : ''}>4. المراجعة والإقرار</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded border border-rose-200 bg-rose-50 text-rose-900 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded p-6 sm:p-8">
          {/* Honeypot field (hidden from legitimate users, attracts bots) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website_url_hp">Website</label>
            <input
              id="website_url_hp"
              type="text"
              name="website_url_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* STEP 1: Personal, Contact & Academic Study */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-4">
                  بيانات التواصل والمعلومات الشخصية
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-xs font-semibold text-gray-800 mb-1">
                      الاسم الرباعي كاملاً <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="كما هو مدون في الوثائق الرسمية"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-800 mb-1">
                      رقم الهاتف للتواصل <span className="text-rose-600">*</span>
                    </label>
                    <div className="flex gap-2" dir="ltr">
                      <input
                        type="text"
                        readOnly
                        value={formData.phoneCountryCode}
                        className="w-16 px-2 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-center font-mono"
                      />
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                        placeholder="50XXXXXXX"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-800 mb-1">
                      البريد الإلكتروني (اختياري)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="governorateOrCity" className="block text-xs font-semibold text-gray-800 mb-1">
                      المدينة أو المحافظة <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="governorateOrCity"
                      type="text"
                      required
                      value={formData.governorateOrCity}
                      onChange={(e) => updateField('governorateOrCity', e.target.value)}
                      placeholder="مثال: الرياض، جدة، أبها..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredContactMethod" className="block text-xs font-semibold text-gray-800 mb-1">
                      وسيلة التواصل المفضلة <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={(e) => updateField('preferredContactMethod', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="phone">اتصال هاتفي</option>
                      <option value="whatsapp">واتساب</option>
                      <option value="email">بريد إلكتروني</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-4">
                  بيانات الدراسة والرسوم المستحقة
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="institutionName" className="block text-xs font-semibold text-gray-800 mb-1">
                      المؤسسة التعليمية (الجامعة أو الكلية) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="institutionName"
                      type="text"
                      required
                      value={formData.institutionName}
                      onChange={(e) => updateField('institutionName', e.target.value)}
                      placeholder="اسم الجامعة أو الكلية الرسمية"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="major" className="block text-xs font-semibold text-gray-800 mb-1">
                      التخصص الأكاديمي <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="major"
                      type="text"
                      required
                      value={formData.major}
                      onChange={(e) => updateField('major', e.target.value)}
                      placeholder="مثال: هندسة، تمريض، محاسبة..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="academicYearOrSemester" className="block text-xs font-semibold text-gray-800 mb-1">
                      السنة أو الفصل الدراسي <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="academicYearOrSemester"
                      type="text"
                      required
                      value={formData.academicYearOrSemester}
                      onChange={(e) => updateField('academicYearOrSemester', e.target.value)}
                      placeholder="مثال: السنة الثالثة - الفصل الأول"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="enrollmentStatus" className="block text-xs font-semibold text-gray-800 mb-1">
                      الحالة الأكاديمية الراهنة <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="enrollmentStatus"
                      value={formData.enrollmentStatus}
                      onChange={(e) => updateField('enrollmentStatus', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="enrolled">منتظم في الدراسة حالياً</option>
                      <option value="accepted">مقبول حديثاً ومطالب بالسداد</option>
                      <option value="paused">متوقف أو معلق مؤقتاً بسبب الرسوم</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="otherScholarshipsOrDiscounts" className="block text-xs font-semibold text-gray-800 mb-1">
                      هل لديك منح أو خصومات أخرى؟ <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="otherScholarshipsOrDiscounts"
                      value={formData.otherScholarshipsOrDiscounts}
                      onChange={(e) => updateField('otherScholarshipsOrDiscounts', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="none">لا يوجد أي منحة أو خصم آخر</option>
                      <option value="partial">خصم أو منحة جزئية</option>
                      <option value="full">تغطية كاملة من جهة أخرى</option>
                    </select>
                  </div>

                  {/* Financial Fields */}
                  <div className="sm:col-span-2 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-gray-200 rounded">
                      <div>
                        <label htmlFor="periodTuitionFee" className="block text-xs font-semibold text-gray-800 mb-1">
                          رسوم الفترة المطلوبة (ر.س) <span className="text-rose-600">*</span>
                        </label>
                        <input
                          id="periodTuitionFee"
                          type="number"
                          min="0"
                          step="50"
                          required
                          value={formData.periodTuitionFee}
                          onChange={(e) => updateField('periodTuitionFee', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="مثال: 12000"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                        />
                      </div>

                      <div>
                        <label htmlFor="amountAlreadyPaid" className="block text-xs font-semibold text-gray-800 mb-1">
                          المبلغ المدفوع بالفعل (ر.س)
                        </label>
                        <input
                          id="amountAlreadyPaid"
                          type="number"
                          min="0"
                          step="50"
                          value={formData.amountAlreadyPaid}
                          onChange={(e) => updateField('amountAlreadyPaid', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="0 إذا لم يدفع شيء"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmedExternalSupport" className="block text-xs font-semibold text-gray-800 mb-1">
                          دعم دراسي مؤكد من جهة أخرى
                        </label>
                        <input
                          id="confirmedExternalSupport"
                          type="number"
                          min="0"
                          step="50"
                          value={formData.confirmedExternalSupport}
                          onChange={(e) => updateField('confirmedExternalSupport', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="0 إن لم يوجد"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                        />
                      </div>

                      {/* Automated Uncovered Tuition Calculation */}
                      <div className="sm:col-span-3 pt-3 mt-2 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                        <span className="text-gray-600">المبلغ المتبقي غير المغطى المحسوب آلياً:</span>
                        <span className="font-mono font-bold text-slate-900 text-base mt-1 sm:mt-0">
                          {calculatedUncovered.toLocaleString('ar-SA')} ر.س
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPaymentDeadlineNear}
                        onChange={(e) => updateField('isPaymentDeadlineNear', e.target.checked)}
                        className="rounded border-gray-300 text-slate-900 focus:ring-0"
                      />
                      <span>يوجد موعد قريب وملزم لسداد الرسوم المتبقية لدى المؤسسة.</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.atRiskOfSuspension}
                        onChange={(e) => updateField('atRiskOfSuspension', e.target.checked)}
                        className="rounded border-gray-300 text-slate-900 focus:ring-0"
                      />
                      <span>توجد مخاطرة فعلية بحرمان الطالب من الاختبارات أو طي القيد بسبب الرسوم.</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Household & Income Breakdown */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-4">
                  بيانات الوحدة الاقتصادية والأسرة
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="householdSize" className="block text-xs font-semibold text-gray-800 mb-1">
                      عدد أفراد الأسرة (شاملاً الطالب) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="householdSize"
                      type="number"
                      min="1"
                      max="30"
                      required
                      value={formData.householdSize}
                      onChange={(e) => updateField('householdSize', Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                    />
                    <span className="text-[11px] text-gray-500 mt-0.5 block">
                      الوحدة الاقتصادية التي تتشارك الدخل والمصاريف فعلياً.
                    </span>
                  </div>

                  <div>
                    <label htmlFor="dependentsCount" className="block text-xs font-semibold text-gray-800 mb-1">
                      عدد الأفراد المعالين في الأسرة
                    </label>
                    <input
                      id="dependentsCount"
                      type="number"
                      min="0"
                      max="30"
                      value={formData.dependentsCount}
                      onChange={(e) => updateField('dependentsCount', Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="actualBreadwinner" className="block text-xs font-semibold text-gray-800 mb-1">
                      من يعيل الأسرة فعلياً؟ <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="actualBreadwinner"
                      value={formData.actualBreadwinner}
                      onChange={(e) => updateField('actualBreadwinner', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="father">الأب</option>
                      <option value="mother">الأم</option>
                      <option value="student">الطالب نفسه (المعيل الفعلي)</option>
                      <option value="brother_sister">أخ أو أخت</option>
                      <option value="relative">قريب آخر</option>
                      <option value="none_shared">لا يوجد معيل محدد (اعتماد على المساعدات)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fatherStatus" className="block text-xs font-semibold text-gray-800 mb-1">
                      حالة الأب <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="fatherStatus"
                      value={formData.fatherStatus}
                      onChange={(e) => updateField('fatherStatus', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="working">يعمل</option>
                      <option value="unemployed">لا يعمل / عاطل</option>
                      <option value="retired">متقاعد</option>
                      <option value="deceased">متوفى</option>
                      <option value="unavailable">غير متاح / غائب</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="motherStatus" className="block text-xs font-semibold text-gray-800 mb-1">
                      حالة الأم <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="motherStatus"
                      value={formData.motherStatus}
                      onChange={(e) => updateField('motherStatus', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="unemployed">ربة منزل / لا تعمل</option>
                      <option value="working">تعمل</option>
                      <option value="retired">متقاعدة</option>
                      <option value="deceased">متوفاة</option>
                      <option value="unavailable">غير متاحة / غائبة</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="alternativeSupportAvailable" className="block text-xs font-semibold text-gray-800 mb-1">
                      هل يتوفر دعم منتظم أو بديل؟ <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="alternativeSupportAvailable"
                      value={formData.alternativeSupportAvailable}
                      onChange={(e) => updateField('alternativeSupportAvailable', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="no">لا يوجد أي دعم بديل</option>
                      <option value="partial">دعم جزئي غير كافٍ</option>
                      <option value="yes">نعم يتوفر دعم منتظم</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Income Sources Breakdown */}
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-2">
                  مصادر الدخل الشهري المتاح للأسرة
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  تحديد الدخل الصافي الشهري الفعلي بدقة يحدد دخل الفرد. ميّز بين الصفر والبيانات غير المعروفة.
                </p>

                <div className="space-y-4">
                  {/* Father Income (Conditional: only if father is not deceased/unavailable) */}
                  {!['deceased', 'unavailable'].includes(formData.fatherStatus) && (
                    <div className="p-3 rounded border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">دخل الأب الشهري (ر.س)</div>
                        <div className="text-[11px] text-gray-500">الراتب أو العائد الصافي من عمل الأب</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={formData.fatherIncomeKnown}
                          onChange={(e) => updateField('fatherIncomeKnown', e.target.value)}
                          className="px-2 py-1.5 text-xs border border-gray-300 rounded bg-white"
                        >
                          <option value="known">محدد ومعروف</option>
                          <option value="unknown">غير معروف بدقة</option>
                          <option value="na">لا ينطبق (0 دخل)</option>
                        </select>
                        {formData.fatherIncomeKnown === 'known' && (
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={formData.fatherIncomeAmount}
                            onChange={(e) => updateField('fatherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="0"
                            className="w-28 px-2 py-1.5 text-xs border border-gray-300 rounded font-mono bg-white"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mother Income */}
                  {!['deceased', 'unavailable'].includes(formData.motherStatus) && (
                    <div className="p-3 rounded border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-900">دخل الأم الشهري (ر.س)</div>
                        <div className="text-[11px] text-gray-500">الراتب أو العائد الصافي من عمل الأم</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={formData.motherIncomeKnown}
                          onChange={(e) => updateField('motherIncomeKnown', e.target.value)}
                          className="px-2 py-1.5 text-xs border border-gray-300 rounded bg-white"
                        >
                          <option value="known">محدد ومعروف</option>
                          <option value="unknown">غير معروف بدقة</option>
                          <option value="na">لا ينطبق (0 دخل)</option>
                        </select>
                        {formData.motherIncomeKnown === 'known' && (
                          <input
                            type="number"
                            min="0"
                            step="100"
                            value={formData.motherIncomeAmount}
                            onChange={(e) => updateField('motherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="0"
                            className="w-28 px-2 py-1.5 text-xs border border-gray-300 rounded font-mono bg-white"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pensions / Alternative Support (Crucial especially if breadwinner is deceased) */}
                  <div className="p-3 rounded border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">المعاشات التقاعدية أو التأمينية (ر.س)</div>
                      <div className="text-[11px] text-gray-500">معاش التقاعد أو التأمينات للأسرة إن وجد</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.pensionsAmount}
                      onChange={(e) => updateField('pensionsAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0 إن لم يوجد"
                      className="w-28 px-2 py-1.5 text-xs border border-gray-300 rounded font-mono bg-white"
                    />
                  </div>

                  {/* Regular Aid */}
                  <div className="p-3 rounded border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-900">المساعدات النقدية المنتظمة (ر.س)</div>
                      <div className="text-[11px] text-gray-500">الضمان الاجتماعي أو الدعم النقدي الشهري المستقر</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={formData.regularAidAmount}
                      onChange={(e) => updateField('regularAidAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0 إن لم يوجد"
                      className="w-28 px-2 py-1.5 text-xs border border-gray-300 rounded font-mono bg-white"
                    />
                  </div>

                  {/* Student Income Checkbox & details */}
                  <div className="p-3 rounded border border-gray-200 bg-white">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-900 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={formData.studentHasIncome}
                        onChange={(e) => updateField('studentHasIncome', e.target.checked)}
                        className="rounded border-gray-300 text-slate-900 focus:ring-0"
                      />
                      <span>هل لدى الطالب دخل شخصي من عمل جزئي أو حر؟</span>
                    </label>

                    {formData.studentHasIncome && (
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          قيمة دخل الطالب الشهري (تضاف مرة واحدة لإجمالي الأسرة):
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={formData.studentIncomeAmount}
                          onChange={(e) => updateField('studentIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="المبلغ الشهري"
                          className="w-32 px-2 py-1.5 text-xs border border-gray-300 rounded font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Seasonal Income */}
                  <div className="p-3 rounded border border-gray-200 bg-white">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-900 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={formData.hasSeasonalIncome}
                        onChange={(e) => updateField('hasSeasonalIncome', e.target.checked)}
                        className="rounded border-gray-300 text-slate-900 focus:ring-0"
                      />
                      <span>هل تعتمد الأسرة على دخل موسمي أو متغير؟</span>
                    </label>

                    {formData.hasSeasonalIncome && (
                      <div className="pt-2 border-t border-gray-100 space-y-2">
                        <input
                          type="text"
                          value={formData.seasonalIncomeCalculationMethod}
                          onChange={(e) => updateField('seasonalIncomeCalculationMethod', e.target.value)}
                          placeholder="وضح متوسط الدخل الشهري محسوباً على آخر 12 شهراً..."
                          className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded"
                        />
                        <span className="text-[11px] text-gray-500 block">
                          لا تخلط دخل شهر استثنائي مع المعدل السنوي للأسرة.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Expenses, Obligations & Special Circumstances */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-4">
                  المصاريف والالتزامات الأساسية المؤهلة
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="housingStatus" className="block text-xs font-semibold text-gray-800 mb-1">
                      حالة السكن <span className="text-rose-600">*</span>
                    </label>
                    <select
                      id="housingStatus"
                      value={formData.housingStatus}
                      onChange={(e) => updateField('housingStatus', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white"
                    >
                      <option value="rented">إيجار</option>
                      <option value="owned">ملك للأسرة</option>
                      <option value="living_with_relatives">إقامة مع الأقارب</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  {/* Monthly Rent (Conditional) */}
                  {formData.housingStatus === 'rented' && (
                    <div>
                      <label htmlFor="monthlyRent" className="block text-xs font-semibold text-gray-800 mb-1">
                        الإيجار الشهري التقريبي (ر.س) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="monthlyRent"
                        type="number"
                        min="0"
                        step="100"
                        value={formData.monthlyRent}
                        onChange={(e) => updateField('monthlyRent', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="قيمة إيجار السكن"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="recurringNecessaryMedicalExpenses" className="block text-xs font-semibold text-gray-800 mb-1">
                      مصاريف علاجية متكررة غير مغطاة (ر.س شهرياً)
                    </label>
                    <input
                      id="recurringNecessaryMedicalExpenses"
                      type="number"
                      min="0"
                      step="50"
                      value={formData.recurringNecessaryMedicalExpenses}
                      onChange={(e) => updateField('recurringNecessaryMedicalExpenses', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0 إن لم يوجد"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                    />
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      علاج أمراض مزمنة أو إعاقات تتطلب مصاريف دورية.
                    </span>
                  </div>

                  <div>
                    <label htmlFor="basicTransportExpenses" className="block text-xs font-semibold text-gray-800 mb-1">
                      مصاريف النقل الإلزامية للجامعة (ر.س شهرياً)
                    </label>
                    <input
                      id="basicTransportExpenses"
                      type="number"
                      min="0"
                      step="50"
                      value={formData.basicTransportExpenses}
                      onChange={(e) => updateField('basicTransportExpenses', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0 إن لم يوجد"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Special Circumstances */}
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-2">
                  الظروف الاستثنائية والطارئة
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  تساعد هذه البنود في فهم الواقع الاقتصادي للأسرة بموضوعية. (لا يُقيّم التعبير الإنشائي بل الأثر المادي).
                </p>

                <div className="space-y-3">
                  <div className="p-3 border border-gray-200 rounded">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.recentJobLossOrIncomeDrop}
                        onChange={(e) => updateField('recentJobLossOrIncomeDrop', e.target.checked)}
                        className="rounded border-gray-300 text-slate-900 focus:ring-0"
                      />
                      <span>فقدان حديث للعمل أو انخفاض حاد وموثق في دخل المعيل خلال العام الماضي.</span>
                    </label>
                    {formData.recentJobLossOrIncomeDrop && (
                      <textarea
                        value={formData.recentJobLossDetails}
                        onChange={(e) => updateField('recentJobLossDetails', e.target.value)}
                        placeholder="شرح موجز لتاريخ فقدان العمل والأثر المترتب..."
                        rows={2}
                        className="w-full mt-2 p-2 text-xs border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div className="p-3 border border-gray-200 rounded">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.healthOrCaregivingBurdenImpact}
                        onChange={(e) => updateField('healthOrCaregivingBurdenImpact', e.target.checked)}
                        className="rounded border-gray-300 text-slate-900 focus:ring-0"
                      />
                      <span>التزامات رعاية صحية أو أسرية حرجة تؤثر جوهرياً على استقرار دخل الأسرة.</span>
                    </label>
                    {formData.healthOrCaregivingBurdenImpact && (
                      <textarea
                        value={formData.healthOrCaregivingDetails}
                        onChange={(e) => updateField('healthOrCaregivingDetails', e.target.value)}
                        placeholder="شرح موجز للأثر الاقتصادي دون حاجة لتفاصيل طبية دقيقة..."
                        rows={2}
                        className="w-full mt-2 p-2 text-xs border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label htmlFor="additionalContext" className="block text-xs font-semibold text-gray-800 mb-1">
                      ملاحظات أو ظروف إضافية تود إحاطة اللجنة بها (اختياري)
                    </label>
                    <textarea
                      id="additionalContext"
                      value={formData.additionalContext}
                      onChange={(e) => updateField('additionalContext', e.target.value)}
                      placeholder="ملاحظات مختصرة ذات صلة بالوضع المالي..."
                      rows={2}
                      className="w-full p-2.5 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Full Review, Declarations & Submission */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-4">
                  مراجعة ملخص بيانات الطلب
                </h3>

                <div className="border border-gray-200 rounded divide-y divide-gray-100 text-xs sm:text-sm">
                  <div className="p-3.5 bg-slate-50 flex justify-between">
                    <span className="text-gray-500">الاسم والمؤسسة:</span>
                    <span className="font-semibold text-slate-900">
                      {formData.fullName} ({formData.institutionName} - {formData.major})
                    </span>
                  </div>

                  <div className="p-3.5 flex justify-between">
                    <span className="text-gray-500">رقم الهاتف والمدينة:</span>
                    <span className="font-medium text-slate-800">
                      {formData.phoneNumber} - {formData.governorateOrCity}
                    </span>
                  </div>

                  <div className="p-3.5 flex justify-between">
                    <span className="text-gray-500">رسوم الفترة والمدفوع:</span>
                    <span className="font-mono text-slate-800">
                      الرسوم: {Number(formData.periodTuitionFee).toLocaleString('ar-SA')} ر.س | المدفوع: {Number(formData.amountAlreadyPaid || 0).toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50/50 flex justify-between font-medium">
                    <span className="text-slate-900">المبلغ المتبقي المعلق للمنحة:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {calculatedUncovered.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>

                  <div className="p-3.5 flex justify-between">
                    <span className="text-gray-500">أفراد الأسرة وحالة السكن:</span>
                    <span className="font-medium text-slate-800">
                      {formData.householdSize} أفراد | السكن: {formData.housingStatus === 'rented' ? `إيجار (${formData.monthlyRent || 0} ر.س)` : 'ملك / أخرى'}
                    </span>
                  </div>

                  <div className="p-3.5 flex justify-between">
                    <span className="text-gray-500">حالة الوالدين والمعيل:</span>
                    <span className="font-medium text-slate-800">
                      الأب: {formData.fatherStatus} | الأم: {formData.motherStatus} | المعيل: {formData.actualBreadwinner}
                    </span>
                  </div>
                </div>
              </div>

              {/* Declarations (Mandatory) */}
              <div>
                <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-gray-100 mb-3">
                  الإقرارات والتعهدات النظامية
                </h3>

                <div className="space-y-3 bg-slate-50 p-4 border border-gray-200 rounded">
                  <label className="flex items-start gap-2 text-xs text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.infoAccuracyAcknowledged}
                      onChange={(e) => updateField('infoAccuracyAcknowledged', e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-slate-900 focus:ring-0 shrink-0"
                    />
                    <span>أقر بصحة ودقة كافة المعلومات المدخلة حسب علمي ومعرفتي التامة.</span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.dataUseAcknowledged}
                      onChange={(e) => updateField('dataUseAcknowledged', e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-slate-900 focus:ring-0 shrink-0"
                    />
                    <span>أوافق على استخدام هذه البيانات من قبل لجنة المبادرة لأغراض دراسة الطلب والمفاضلة الاقتصادية.</span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.willingToProvideDocsAcknowledged}
                      onChange={(e) => updateField('willingToProvideDocsAcknowledged', e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-slate-900 focus:ring-0 shrink-0"
                    />
                    <span>أتعهد بتقديم كافة المستندات الثبوتية الرسمية عند طلب اللجنة للتحقق المكتبي.</span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-slate-900 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.noGuaranteeAcknowledged}
                      onChange={(e) => updateField('noGuaranteeAcknowledged', e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-slate-900 focus:ring-0 shrink-0"
                    />
                    <span>أعلم تماماً أن تقديم الطلب لا يضمن القبول، وأن المقاعد محددة بـ 6 منح دراسية خاضعة لاعتماد اللجنة.</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="py-2 px-4 rounded border border-gray-300 text-slate-800 bg-white hover:bg-gray-50 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الخطوة السابقة</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>متابعة للخطوة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-6 rounded bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جارٍ تأكيد وحفظ الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب رسمياً</span>
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
