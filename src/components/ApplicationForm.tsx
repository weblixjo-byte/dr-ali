'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Printer,
  AlertCircle,
  ShieldAlert,
  GraduationCap,
  Building2,
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
    governorateOrCity: 'عمان',
    preferredContactMethod: 'phone' as 'phone' | 'whatsapp' | 'email',

    // High School (Tawjihi)
    tawjihiGpa: '' as unknown as number,
    tawjihiBranch: 'علمي',
    tawjihiYear: '2025',

    // University Status
    hasAttendedUniversity: false,
    enrollmentStatus: 'prospective' as 'enrolled' | 'accepted' | 'paused' | 'prospective' | 'not_enrolled',

    institutionName: '',
    studyLevel: 'بكالوريوس',
    major: '',
    academicYearOrSemester: 'مقبل على السنة الأولى',
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
    disqualificationAcknowledged: false,
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
        setErrorMessage('يرجى إدخال رقم هاتف صالح للتواصل مكون من أرقام فقط.');
        return false;
      }
      if (!formData.governorateOrCity.trim()) {
        setErrorMessage('يرجى تحديد المحافظة.');
        return false;
      }
      const gpa = Number(formData.tawjihiGpa);
      if (formData.tawjihiGpa === ('' as unknown as number) || isNaN(gpa) || gpa < 50 || gpa > 100) {
        setErrorMessage('يرجى إدخال معدل ثانوية عامة (توجيهي) صحيح بين 50 و 100.');
        return false;
      }
      if (!formData.tawjihiBranch.trim()) {
        setErrorMessage('يرجى تحديد فرع الثانوية العامة.');
        return false;
      }
      if (!formData.institutionName.trim()) {
        setErrorMessage(
          formData.hasAttendedUniversity
            ? 'يرجى كتابة اسم الجامعة أو الكلية المقيد بها.'
            : 'يرجى كتابة اسم الجامعة أو الكلية المرغوب الالتحاق بها.'
        );
        return false;
      }
      if (!formData.major.trim()) {
        setErrorMessage(
          formData.hasAttendedUniversity
            ? 'يرجى كتابة التخصص الأكاديمي الملتحق به.'
            : 'يرجى كتابة التخصص الأكاديمي المطلوب دراسته.'
        );
        return false;
      }
      if (formData.periodTuitionFee === ('' as unknown as number) || periodTuition <= 0) {
        setErrorMessage('يرجى تحديد الرسوم الدراسية للفصل (د.أ).');
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
        !formData.noGuaranteeAcknowledged ||
        !formData.disqualificationAcknowledged
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

      tawjihiGpa: Number(formData.tawjihiGpa) || 0,
      tawjihiBranch: formData.tawjihiBranch.trim(),
      tawjihiYear: formData.tawjihiYear.trim(),
      hasAttendedUniversity: formData.hasAttendedUniversity,

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
      disqualificationAcknowledged: true,
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

  // SUCCESS CONFIRMATION VIEW (OFFICIAL CERTIFICATE RECEIPT)
  if (successData) {
    return (
      <section id="apply" className="py-12 sm:py-24 bg-white border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-5 sm:p-12 rounded-2xl border border-zinc-200 text-center relative overflow-hidden">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <Check className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>

            <h2 className="text-xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2">
              تم استلام وتأكيد طلب الكفالة بنجاح
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed font-normal">
              تم تسجيل طلبكم رسمياً لدى أمانة سر المبادرة، وحفظ البيانات في قاعدة البيانات المعتمدة بانتظار إجراءات التدقيق المكتبي ومطابقة الوثائق الرسمية.
            </p>

            {/* Official Receipt Card */}
            <div className="receipt-card border border-zinc-200 rounded-xl sm:rounded-2xl p-4 sm:p-7 bg-zinc-50 mb-6 sm:mb-8 text-right text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-zinc-200 mb-3.5 gap-2">
                <div>
                  <div className="font-bold text-zinc-900 text-sm sm:text-base">إشعار استلام طلب كفالة دراسية</div>
                  <div className="text-[11px] text-zinc-500 font-normal">مبادرة من حقك تتعلم • المملكة الأردنية الهاشمية</div>
                </div>
                <div className="font-mono font-semibold text-zinc-900 text-xs bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 self-start sm:self-auto">
                  رقم الطلب: {successData.referenceNumber}
                </div>
              </div>

              <dl className="space-y-2.5 sm:space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-zinc-100 gap-0.5 sm:gap-2">
                  <dt className="text-zinc-500 font-medium">اسم المتقدم الرباعي:</dt>
                  <dd className="font-semibold text-zinc-900">{formData.fullName}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-zinc-100 gap-0.5 sm:gap-2">
                  <dt className="text-zinc-500 font-medium">رقم الهاتف للتواصل:</dt>
                  <dd className="font-mono font-semibold text-zinc-900" dir="ltr">{formData.phoneCountryCode} {formData.phoneNumber}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-zinc-100 gap-0.5 sm:gap-2">
                  <dt className="text-zinc-500 font-medium">المؤسسة والتخصص:</dt>
                  <dd className="font-semibold text-zinc-900">{formData.institutionName} — {formData.major}</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-zinc-100 gap-0.5 sm:gap-2">
                  <dt className="text-zinc-500 font-medium">معدل التوجيهي:</dt>
                  <dd className="font-mono font-semibold text-zinc-900">{formData.tawjihiGpa}% ({formData.tawjihiBranch})</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-zinc-100 gap-0.5 sm:gap-2">
                  <dt className="text-zinc-500 font-medium">المبلغ المطلوب كفالته:</dt>
                  <dd className="font-mono font-bold text-emerald-800 text-sm bg-emerald-50 px-3 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto">{calculatedUncovered.toLocaleString('ar-JO')} د.أ</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-zinc-100 gap-0.5 sm:gap-2">
                  <dt className="text-zinc-500 font-medium">تاريخ ووقت التقديم:</dt>
                  <dd className="font-medium text-zinc-800">
                    {new Date(successData.createdAt).toLocaleDateString('ar-JO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between pt-2 gap-1.5 sm:gap-2">
                  <dt className="text-zinc-500 font-medium">حالة الطلب الحالية:</dt>
                  <dd className="font-medium text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                    <span>قيد التدقيق المكتبي والمطابقة الرسمية</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl border border-zinc-200 text-zinc-800 bg-white hover:bg-zinc-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-zinc-700 stroke-[2]" />
                <span>طباعة أو حفظ الإشعار (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setStep(1);
                  window.location.reload();
                }}
                className="w-full sm:w-auto py-3 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
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
    <section id="apply" className="py-12 sm:py-20 bg-zinc-50/60 border-b border-zinc-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
            استمارة طلب كفالة الرسوم الأكاديمية
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
            يرجى إدخال البيانات الأكاديمية والمالية بدقة لمطابقتها مع الوثائق الرسمية.
          </p>
        </div>

        {/* Responsive Stepper */}
        {/* Mobile Stepper Header */}
        <div className="sm:hidden mb-5 bg-white p-3.5 rounded-xl border border-zinc-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-900">
              الخطوة {step} من 3: {step === 1 ? 'البيانات الأكاديمية' : step === 2 ? 'الأسرة والدخل' : 'المصاريف والإقرار'}
            </span>
            <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {step === 1 ? '33%' : step === 2 ? '66%' : '100%'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop / Tablet Stepper */}
        <div className="hidden sm:flex items-center justify-center gap-4 mb-7 text-xs font-medium">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-emerald-700 font-semibold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 1 ? 'bg-emerald-600 text-white' : step > 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200/80 text-zinc-600'
            }`}>
              {step > 1 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '1'}
            </span>
            <span>البيانات الأكاديمية</span>
          </div>

          <div className="w-10 h-px bg-zinc-200" />

          <div className={`flex items-center gap-2 ${step === 2 ? 'text-emerald-700 font-semibold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 2 ? 'bg-emerald-600 text-white' : step > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200/80 text-zinc-600'
            }`}>
              {step > 2 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : '2'}
            </span>
            <span>الأسرة والدخل</span>
          </div>

          <div className="w-10 h-px bg-zinc-200" />

          <div className={`flex items-center gap-2 ${step === 3 ? 'text-emerald-700 font-semibold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 3 ? 'bg-emerald-600 text-white' : 'bg-zinc-200/80 text-zinc-600'
            }`}>
              3
            </span>
            <span>المصاريف والإقرار</span>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5 stroke-[2]" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-zinc-200/90 p-4 sm:p-8 text-zinc-900 shadow-xs">
          {/* Honeypot for Anti-Bot */}
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

          {/* STEP 1: Personal, High School & Academic Study */}
          {step === 1 && (
            <div className="space-y-5 sm:space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    الاسم الرباعي كاملاً <span className="text-emerald-600 font-bold">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="أدخل اسمك الرباعي كما في الهوية"
                    className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-xs sm:placeholder:text-sm placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      رقم الهاتف للتواصل <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => updateField('phoneNumber', e.target.value)}
                      placeholder="07XXXXXXXX"
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors text-right"
                    />
                  </div>

                  <div>
                    <label htmlFor="governorateOrCity" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      المحافظة <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <select
                      id="governorateOrCity"
                      value={formData.governorateOrCity}
                      onChange={(e) => updateField('governorateOrCity', e.target.value)}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
                    >
                      <option value="عمان">عمان</option>
                      <option value="إربد">إربد</option>
                      <option value="الزرقاء">الزرقاء</option>
                      <option value="البلقاء">البلقاء (السلط)</option>
                      <option value="الكرك">الكرك</option>
                      <option value="معان">معان</option>
                      <option value="العقبة">العقبة</option>
                      <option value="المفرق">المفرق</option>
                      <option value="مادبا">مادبا</option>
                      <option value="جرش">جرش</option>
                      <option value="عجلون">عجلون</option>
                      <option value="الطفيلة">الطفيلة</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* High School (Tawjihi) Details */}
              <div className="pt-1 sm:pt-2">
                <div className="pb-2 mb-3.5 border-b border-zinc-100 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-zinc-900">شهادة الثانوية العامة (التوجيهي)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label htmlFor="tawjihiGpa" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      معدل التوجيهي (%) <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <input
                      id="tawjihiGpa"
                      type="number"
                      step="0.01"
                      min="50"
                      max="100"
                      required
                      value={formData.tawjihiGpa}
                      onChange={(e) => updateField('tawjihiGpa', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="مثال: 85.5"
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="tawjihiBranch" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      فرع الثانوية <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <select
                      id="tawjihiBranch"
                      value={formData.tawjihiBranch}
                      onChange={(e) => updateField('tawjihiBranch', e.target.value)}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
                    >
                      <option value="علمي">علمي</option>
                      <option value="أدبي">أدبي</option>
                      <option value="صناعي">صناعي</option>
                      <option value="تكنولوجيا معلومات">تكنولوجيا معلومات / حاسوبي</option>
                      <option value="صحي">صحي / تمريضي</option>
                      <option value="شرعي">شرعي</option>
                      <option value="فندقي وزراعي">فندقي / زراعي</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tawjihiYear" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      سنة الشهادة <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <select
                      id="tawjihiYear"
                      value={formData.tawjihiYear}
                      onChange={(e) => updateField('tawjihiYear', e.target.value)}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
                    >
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020 وما قبل">2020 وما قبل</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic & University Profile */}
              <div className="pt-1 sm:pt-2">
                <div className="pb-2 mb-3.5 border-b border-zinc-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-zinc-900">المرحلة الجامعية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      updateField('hasAttendedUniversity', false);
                      updateField('enrollmentStatus', 'prospective');
                      updateField('academicYearOrSemester', 'مقبل على السنة الأولى');
                    }}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      !formData.hasAttendedUniversity
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm">خريج ثانوية عامة (مقبل على التسجيل)</div>
                      <div className="text-[11px] text-zinc-500 font-normal mt-0.5">لم يلتحق بالجامعة بعد</div>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      !formData.hasAttendedUniversity ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300'
                    }`}>
                      {!formData.hasAttendedUniversity && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateField('hasAttendedUniversity', true);
                      if (formData.enrollmentStatus === 'prospective' || formData.enrollmentStatus === 'not_enrolled') {
                        updateField('enrollmentStatus', 'enrolled');
                        updateField('academicYearOrSemester', 'السنة الأولى');
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      formData.hasAttendedUniversity
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm">طالب جامعي حالياً</div>
                      <div className="text-[11px] text-zinc-500 font-normal mt-0.5">ملتحق بالدراسة ومطالب بالرسوم</div>
                    </div>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      formData.hasAttendedUniversity ? 'border-emerald-600 bg-emerald-600' : 'border-zinc-300'
                    }`}>
                      {formData.hasAttendedUniversity && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                </div>

                {formData.hasAttendedUniversity ? (
                  /* Enrolled student fields */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="enrollmentStatus" className="block text-xs font-medium text-zinc-700 mb-1.5">
                          الحالة الأكاديمية <span className="text-emerald-600 font-bold">*</span>
                        </label>
                        <select
                          id="enrollmentStatus"
                          value={formData.enrollmentStatus}
                          onChange={(e) => updateField('enrollmentStatus', e.target.value)}
                          className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
                        >
                          <option value="enrolled">منتظم في الدراسة حالياً ومطالب بالرسوم</option>
                          <option value="paused">متوقف أو معلق القيد بسبب تراكم الرسوم</option>
                          <option value="accepted">مقبول حديثاً ومطالب بالسداد للبدء</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="academicYearOrSemester" className="block text-xs font-medium text-zinc-700 mb-1.5">
                          السنة أو المستوى الدراسي <span className="text-emerald-600 font-bold">*</span>
                        </label>
                        <select
                          id="academicYearOrSemester"
                          value={formData.academicYearOrSemester}
                          onChange={(e) => updateField('academicYearOrSemester', e.target.value)}
                          className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
                        >
                          <option value="السنة الأولى">السنة الأولى</option>
                          <option value="السنة الثانية">السنة الثانية</option>
                          <option value="السنة الثالثة">السنة الثالثة</option>
                          <option value="السنة الرابعة">السنة الرابعة</option>
                          <option value="السنة الخامسة فأعلى">السنة الخامسة فأعلى</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="institutionName" className="block text-xs font-medium text-zinc-700 mb-1.5">
                          اسم الجامعة أو الكلية <span className="text-emerald-600 font-bold">*</span>
                        </label>
                        <input
                          id="institutionName"
                          type="text"
                          required
                          value={formData.institutionName}
                          onChange={(e) => updateField('institutionName', e.target.value)}
                          placeholder="مثال: الجامعة الأردنية"
                          className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="major" className="block text-xs font-medium text-zinc-700 mb-1.5">
                          التخصص الأكاديمي <span className="text-emerald-600 font-bold">*</span>
                        </label>
                        <input
                          id="major"
                          type="text"
                          required
                          value={formData.major}
                          onChange={(e) => updateField('major', e.target.value)}
                          placeholder="مثال: التمريض"
                          className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Prospective High School Graduate fields */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="institutionName" className="block text-xs font-medium text-zinc-700 mb-1.5">
                        الجامعة أو الكلية المرغوبة <span className="text-emerald-600 font-bold">*</span>
                      </label>
                      <input
                        id="institutionName"
                        type="text"
                        required
                        value={formData.institutionName}
                        onChange={(e) => updateField('institutionName', e.target.value)}
                        placeholder="اسم الجامعة الأردنية المستهدفة"
                        className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="major" className="block text-xs font-medium text-zinc-700 mb-1.5">
                        التخصص الأكاديمي المطلوب <span className="text-emerald-600 font-bold">*</span>
                      </label>
                      <input
                        id="major"
                        type="text"
                        required
                        value={formData.major}
                        onChange={(e) => updateField('major', e.target.value)}
                        placeholder="التخصص المطلوب دراسته"
                        className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Tuition Details */}
              <div className="pt-1 sm:pt-2">
                <div className="pb-2 mb-3.5 border-b border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-900">الرسوم الجامعية ومبلغ الكفالة</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="periodTuitionFee" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      {formData.hasAttendedUniversity
                        ? 'الرسوم المستحقة للفصل (د.أ)'
                        : 'الرسوم التقديرية للفصل الأول (د.أ)'}{' '}
                      <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <input
                      id="periodTuitionFee"
                      type="number"
                      min="0"
                      required
                      value={formData.periodTuitionFee}
                      onChange={(e) => updateField('periodTuitionFee', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="مثال: 850"
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="amountAlreadyPaid" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      {formData.hasAttendedUniversity
                        ? 'المبلغ المسدد من الرسوم إن وجد (د.أ)'
                        : 'المبلغ المتوفر للمساهمة إن وجد (د.أ)'}
                    </label>
                    <input
                      id="amountAlreadyPaid"
                      type="number"
                      min="0"
                      value={formData.amountAlreadyPaid}
                      onChange={(e) => updateField('amountAlreadyPaid', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-3.5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5">
                  <span className="text-xs font-medium text-zinc-600">المبلغ الصافي المطلوب كفالته:</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-emerald-700">
                    {calculatedUncovered.toLocaleString('ar-JO')} د.أ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Household & Income */}
          {step === 2 && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <div className="pb-2 mb-4 border-b border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-900">بيانات الأسرة والمعيل</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="householdSize" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      عدد أفراد الأسرة المقيمين معاً <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <input
                      id="householdSize"
                      type="number"
                      min="1"
                      required
                      value={formData.householdSize}
                      onChange={(e) => updateField('householdSize', Number(e.target.value))}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="actualBreadwinner" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      من يعيل الأسرة فعلياً؟ <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <select
                      id="actualBreadwinner"
                      value={formData.actualBreadwinner}
                      onChange={(e) => updateField('actualBreadwinner', e.target.value)}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
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
                    <label htmlFor="fatherStatus" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      حالة الأب <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <select
                      id="fatherStatus"
                      value={formData.fatherStatus}
                      onChange={(e) => updateField('fatherStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
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
                    <label htmlFor="motherStatus" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      حالة الأم <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <select
                      id="motherStatus"
                      value={formData.motherStatus}
                      onChange={(e) => updateField('motherStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
                    >
                      <option value="unemployed">ربة منزل / لا تعمل</option>
                      <option value="working">تعمل</option>
                      <option value="retired">متقاعدة</option>
                      <option value="deceased">متوفاة</option>
                      <option value="unavailable">غير متاحة / غائبة</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Income Sources Grid */}
              <div className="pt-1 sm:pt-2">
                <div className="pb-2 mb-4 border-b border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-900">مصادر الدخل الشهري للأسرة</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {!['deceased', 'unavailable'].includes(formData.fatherStatus) && (
                    <div>
                      <label htmlFor="fatherIncomeAmount" className="block text-xs font-medium text-zinc-700 mb-1.5">
                        دخل الأب الشهري الصافي (د.أ)
                      </label>
                      <input
                        id="fatherIncomeAmount"
                        type="number"
                        min="0"
                        value={formData.fatherIncomeAmount}
                        onChange={(e) => updateField('fatherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                      />
                    </div>
                  )}

                  {!['deceased', 'unavailable'].includes(formData.motherStatus) && (
                    <div>
                      <label htmlFor="motherIncomeAmount" className="block text-xs font-medium text-zinc-700 mb-1.5">
                        دخل الأم الشهري الصافي (د.أ)
                      </label>
                      <input
                        id="motherIncomeAmount"
                        type="number"
                        min="0"
                        value={formData.motherIncomeAmount}
                        onChange={(e) => updateField('motherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="pensionsAmount" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      معاشات تقاعدية / تأمينات (د.أ) إن وجدت
                    </label>
                    <input
                      id="pensionsAmount"
                      type="number"
                      min="0"
                      value={formData.pensionsAmount}
                      onChange={(e) => updateField('pensionsAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="regularAidAmount" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      مساعدات نقدية منتظمة أو معونة (د.أ)
                    </label>
                    <input
                      id="regularAidAmount"
                      type="number"
                      min="0"
                      value={formData.regularAidAmount}
                      onChange={(e) => updateField('regularAidAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Expenses, Obligations & Confirmation */}
          {step === 3 && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <div className="pb-2 mb-4 border-b border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-900">السكن والمصاريف الإضافية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="housingStatus" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      حالة سكن الأسرة <span className="text-emerald-600 font-bold">*</span>
                    </label>
                    <select
                      id="housingStatus"
                      value={formData.housingStatus}
                      onChange={(e) => updateField('housingStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors cursor-pointer"
                    >
                      <option value="rented">إيجار</option>
                      <option value="owned">ملك</option>
                      <option value="living_with_relatives">إقامة مع الأقارب</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  {formData.housingStatus === 'rented' ? (
                    <div>
                      <label htmlFor="monthlyRent" className="block text-xs font-medium text-zinc-700 mb-1.5">
                        الإيجار الشهري (د.أ) <span className="text-emerald-600 font-bold">*</span>
                      </label>
                      <input
                        id="monthlyRent"
                        type="number"
                        min="0"
                        value={formData.monthlyRent}
                        onChange={(e) => updateField('monthlyRent', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="مثال: 180"
                        className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="recurringNecessaryMedicalExpenses" className="block text-xs font-medium text-zinc-700 mb-1.5">
                        مصاريف علاجية لأمراض مزمنة (د.أ) إن وجدت
                      </label>
                      <input
                        id="recurringNecessaryMedicalExpenses"
                        type="number"
                        min="0"
                        value={formData.recurringNecessaryMedicalExpenses}
                        onChange={(e) => updateField('recurringNecessaryMedicalExpenses', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                      />
                    </div>
                  )}
                </div>

                {formData.housingStatus === 'rented' && (
                  <div className="mb-4">
                    <label htmlFor="recurringNecessaryMedicalExpenses" className="block text-xs font-medium text-zinc-700 mb-1.5">
                      مصاريف علاجية شهرية لأمراض مزمنة غير مغطاة (د.أ) إن وجدت
                    </label>
                    <input
                      id="recurringNecessaryMedicalExpenses"
                      type="number"
                      min="0"
                      value={formData.recurringNecessaryMedicalExpenses}
                      onChange={(e) => updateField('recurringNecessaryMedicalExpenses', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full h-11 px-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="additionalContext" className="block text-xs font-medium text-zinc-700 mb-1.5">
                    ملاحظات أو ظروف خاصة تود إحاطة اللجنة بها (اختياري)
                  </label>
                  <textarea
                    id="additionalContext"
                    value={formData.additionalContext}
                    onChange={(e) => updateField('additionalContext', e.target.value)}
                    rows={2}
                    placeholder="بيان أي ظروف استثنائية أو التزامات..."
                    className="w-full p-3 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Declarations (Mandatory) */}
              <div className="pt-1 sm:pt-2">
                <div className="pb-2 mb-3.5 border-b border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-900">الإقرارات والتعهدات الرسمية</span>
                </div>

                <div className="space-y-3 text-xs text-zinc-700">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.infoAccuracyAcknowledged}
                      onChange={(e) => updateField('infoAccuracyAcknowledged', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-300 accent-emerald-600 text-emerald-600 shrink-0 cursor-pointer"
                    />
                    <span>أقر بصحة ودقة كافة المعلومات والبيانات المدخلة في هذا الطلب حسب علمي ومسؤوليتي.</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.dataUseAcknowledged}
                      onChange={(e) => updateField('dataUseAcknowledged', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-300 accent-emerald-600 text-emerald-600 shrink-0 cursor-pointer"
                    />
                    <span>أوافق على استخدام هذه البيانات من قبل لجنة المبادرة لغايات التدقيق والمفاضلة بسرية تامة.</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.willingToProvideDocsAcknowledged}
                      onChange={(e) => updateField('willingToProvideDocsAcknowledged', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-300 accent-emerald-600 text-emerald-600 shrink-0 cursor-pointer"
                    />
                    <span>أتعهد بتقديم كافة المستندات الثبوتية الرسمية عند طلب اللجنة للتحقق المكتبي.</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.noGuaranteeAcknowledged}
                      onChange={(e) => updateField('noGuaranteeAcknowledged', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-300 accent-emerald-600 text-emerald-600 shrink-0 cursor-pointer"
                    />
                    <span>أعلم أن تقديم الطلب خطوة للمفاضلة ولا يعني القبول التلقائي ويخضع لقرار اللجنة النهائي.</span>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 cursor-pointer text-rose-950 font-medium">
                    <input
                      type="checkbox"
                      required
                      checked={formData.disqualificationAcknowledged}
                      onChange={(e) => updateField('disqualificationAcknowledged', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-rose-300 accent-rose-600 text-rose-600 shrink-0 cursor-pointer"
                    />
                    <span>أقر بأنني على علم تام بأن إدخال أي معلومات غير صحيحة أو مضللة سيؤدي للاستبعاد الفوري والنهائي للطلب.</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-7 sm:mt-8 pt-4 sm:pt-5 border-t border-zinc-100 flex items-center justify-between gap-2.5 sm:gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial py-3 sm:py-2.5 px-4 sm:px-5 rounded-xl border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
                <span>الخطوة السابقة</span>
              </button>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 sm:flex-initial py-3 sm:py-2.5 px-6 sm:px-7 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>متابعة</span>
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial py-3 sm:py-2.5 px-6 sm:px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جارٍ تأكيد الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2]" />
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
