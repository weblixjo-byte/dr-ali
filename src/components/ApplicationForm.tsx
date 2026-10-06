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
      <section id="apply" className="py-20 bg-gradient-to-b from-white via-emerald-50/20 to-white border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-zinc-200 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center mx-auto mb-5 border-2 border-black/10">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-2">
              تم استلام وتأكيد طلب الكفالة بنجاح
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 mb-8 max-w-lg mx-auto leading-relaxed">
              تم تسجيل طلبكم رسمياً لدى أمانة سر المبادرة، وحفظ البيانات في قاعدة البيانات المعتمدة بانتظار إجراءات التدقيق المكتبي ومطابقة الوثائق الرسمية.
            </p>

            {/* Official Receipt Card */}
            <div className="receipt-card border-[2.5px] border-black rounded-3xl p-6 sm:p-7 bg-emerald-50/50 mb-8 text-right text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-black/10 mb-4 gap-2">
                <div>
                  <div className="font-black text-black text-sm sm:text-base">إشعار استلام طلب كفالة دراسية</div>
                  <div className="text-[11px] text-zinc-600 font-semibold">مبادرة د. علي للتعليم الجامعي • المملكة الأردنية الهاشمية</div>
                </div>
                <div className="font-mono font-black text-black text-xs bg-[#facc15] px-3.5 py-1.5 rounded-xl border-2 border-black self-start sm:self-auto">
                  رقم الطلب: {successData.referenceNumber}
                </div>
              </div>

              <dl className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <dt className="text-zinc-600 font-bold">اسم المتقدم الرباعي:</dt>
                  <dd className="font-black text-black">{formData.fullName}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <dt className="text-zinc-600 font-bold">رقم الهاتف للتواصل:</dt>
                  <dd className="font-mono font-black text-black" dir="ltr">{formData.phoneCountryCode} {formData.phoneNumber}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <dt className="text-zinc-600 font-bold">المؤسسة والتخصص:</dt>
                  <dd className="font-black text-black">{formData.institutionName} — {formData.major}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <dt className="text-zinc-600 font-bold">معدل التوجيهي:</dt>
                  <dd className="font-mono font-black text-black">{formData.tawjihiGpa}% ({formData.tawjihiBranch})</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <dt className="text-zinc-600 font-bold">المبلغ المطلوب كفالته:</dt>
                  <dd className="font-mono font-black text-black text-sm bg-[#facc15] px-3 py-0.5 rounded-lg border border-black">{calculatedUncovered.toLocaleString('ar-JO')} د.أ</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-black/5">
                  <dt className="text-zinc-600 font-bold">تاريخ ووقت التقديم:</dt>
                  <dd className="font-bold text-black">
                    {new Date(successData.createdAt).toLocaleDateString('ar-JO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
                <div className="flex justify-between pt-2">
                  <dt className="text-zinc-600 font-bold">حالة الطلب الحالية:</dt>
                  <dd className="font-black text-black flex items-center gap-1.5 bg-emerald-100 px-3 py-1 rounded-xl border border-black">
                    <Clock className="w-3.5 h-3.5 text-[#16a34a] stroke-[2.5]" />
                    <span>قيد التدقيق المكتبي والمطابقة الرسمية</span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3.5 px-5 rounded-2xl border-2 border-black text-black bg-white hover:bg-zinc-50 text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <Printer className="w-4 h-4 text-black stroke-[2.5]" />
                <span>طباعة أو حفظ الإشعار (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  setStep(1);
                  window.location.reload();
                }}
                className="py-3.5 px-8 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs sm:text-sm font-black border-2 border-black active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
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
    <section id="apply" className="py-20 sm:py-28 bg-gradient-to-b from-white via-emerald-50/10 to-white border-b border-zinc-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight">
            استمارة طلب كفالة الرسوم الأكاديمية
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2.5 leading-relaxed font-semibold">
            يرجى إدخال البيانات الأكاديمية والمالية بدقة كاملة. تُحفظ البيانات وتُرفع مباشرة للجنة التدقيق.
          </p>
        </div>

        {/* Vibrant Cartoon 3-Step Progress Header */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-8">
          <div
            className={`p-3.5 sm:p-4 rounded-3xl border-2 border-black transition-all text-right ${
              step === 1
                ? 'bg-emerald-100'
                : step > 1
                ? 'bg-white'
                : 'bg-zinc-100 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-mono text-[10px] font-black px-2.5 py-0.5 rounded-lg border-2 border-black ${
                step === 1
                  ? 'bg-[#22c55e] text-white'
                  : step > 1
                  ? 'bg-white text-black'
                  : 'bg-zinc-200 text-zinc-600'
              }`}>
                01
              </span>
              {step > 1 && <Check className="w-4 h-4 text-emerald-700 stroke-[3.5]" />}
            </div>
            <div className={`text-xs font-black leading-tight ${step >= 1 ? 'text-black' : 'text-zinc-600'}`}>
              الدراسة والاتصال
            </div>
          </div>

          <div
            className={`p-3.5 sm:p-4 rounded-3xl border-2 border-black transition-all text-right ${
              step === 2
                ? 'bg-emerald-100'
                : step > 2
                ? 'bg-white'
                : 'bg-zinc-100 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-mono text-[10px] font-black px-2.5 py-0.5 rounded-lg border-2 border-black ${
                step === 2
                  ? 'bg-[#22c55e] text-white'
                  : step > 2
                  ? 'bg-white text-black'
                  : 'bg-zinc-200 text-zinc-600'
              }`}>
                02
              </span>
              {step > 2 && <Check className="w-4 h-4 text-emerald-700 stroke-[3.5]" />}
            </div>
            <div className={`text-xs font-black leading-tight ${step >= 2 ? 'text-black' : 'text-zinc-600'}`}>
              الأسرة والدخل
            </div>
          </div>

          <div
            className={`p-3.5 sm:p-4 rounded-3xl border-2 border-black transition-all text-right ${
              step === 3
                ? 'bg-emerald-100'
                : 'bg-zinc-100 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`font-mono text-[10px] font-black px-2.5 py-0.5 rounded-lg border-2 border-black ${
                step === 3
                  ? 'bg-[#22c55e] text-white'
                  : 'bg-zinc-200 text-zinc-600'
              }`}>
                03
              </span>
            </div>
            <div className={`text-xs font-black leading-tight ${step === 3 ? 'text-black' : 'text-zinc-600'}`}>
              المصاريف والإقرار
            </div>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl border-2 border-black bg-rose-100 text-black text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5 stroke-[2.5]" />
            <div className="leading-relaxed font-black">{errorMessage}</div>
          </div>
        )}

        {/* Legal Disqualification Warning Notice */}
        <div className="mb-6 p-5 rounded-3xl border-2 border-black bg-amber-50 text-right flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-300 border-2 border-black flex items-center justify-center shrink-0 text-black mt-0.5">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-xs">
            <strong className="font-black text-black block mb-0.5 text-xs sm:text-sm">
              تنبيه تدقيق ومسؤولية قانونية:
            </strong>
            <span className="text-zinc-800 leading-relaxed text-[11px] sm:text-xs font-semibold">
              تخضع كافة البيانات للمطابقة الرسمية مع كشوفات الجامعات وسجلات الأحوال المدنية. أي تضليل أو عدم دقة في البيانات المُدخلة يستوجب الاستبعاد الفوري والنهائي للطلب دون استثناء.
            </span>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-[2.5px] border-black p-6 sm:p-10 text-black">
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
            <div className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-black mb-1.5">
                    الاسم الرباعي كاملاً <span className="text-zinc-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="أدخل اسمك الرباعي كما هو مدون في الهوية الشخصية"
                    className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-bold text-black mb-1.5">
                      رقم الهاتف للتواصل <span className="text-zinc-500">*</span>
                    </label>
                    <div className="flex gap-2" dir="ltr">
                      <input
                        type="text"
                        readOnly
                        value={formData.phoneCountryCode}
                        className="w-16 h-11 px-2 text-sm rounded-sm border border-zinc-300 bg-zinc-100 text-center font-mono text-black font-semibold"
                      />
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={(e) => updateField('phoneNumber', e.target.value)}
                        placeholder="7XXXXXXXX"
                        className="flex-1 h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black font-mono focus:border-black focus:ring-1 focus:ring-black transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="governorateOrCity" className="block text-xs font-bold text-black mb-1.5">
                      المحافظة في المملكة الأردنية الهاشمية <span className="text-zinc-500">*</span>
                    </label>
                    <select
                      id="governorateOrCity"
                      value={formData.governorateOrCity}
                      onChange={(e) => updateField('governorateOrCity', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black transition-colors"
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
              <div className="p-4 sm:p-5 rounded-sm border border-zinc-300 bg-zinc-50 space-y-3">
                <div>
                  <div className="text-xs font-bold text-black flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-black" />
                    <span>بيانات شهادة الثانوية العامة (التوجيهي)</span>
                    <span className="text-zinc-500">*</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    مطلوبة لجميع المتقدمين لغايات التحقق المكتبي والمفاضلة الأكاديمية الرسمية
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label htmlFor="tawjihiGpa" className="block text-xs font-semibold text-black mb-1">
                      معدل التوجيهي (%) <span className="text-zinc-500">*</span>
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
                      placeholder="85.5"
                      className="w-full h-10 px-3 text-sm rounded-sm border border-zinc-300 bg-white text-black font-mono focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="tawjihiBranch" className="block text-xs font-semibold text-black mb-1">
                      فرع الثانوية العامة <span className="text-zinc-500">*</span>
                    </label>
                    <select
                      id="tawjihiBranch"
                      value={formData.tawjihiBranch}
                      onChange={(e) => updateField('tawjihiBranch', e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
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
                    <label htmlFor="tawjihiYear" className="block text-xs font-semibold text-black mb-1">
                      سنة الحصول على الشهادة <span className="text-zinc-500">*</span>
                    </label>
                    <select
                      id="tawjihiYear"
                      value={formData.tawjihiYear}
                      onChange={(e) => updateField('tawjihiYear', e.target.value)}
                      className="w-full h-10 px-3 text-xs rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black font-mono"
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
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-2">
                    الوضع الجامعي الراهن للمتقدم <span className="text-zinc-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        updateField('hasAttendedUniversity', false);
                        updateField('enrollmentStatus', 'prospective');
                        updateField('academicYearOrSemester', 'مقبل على السنة الأولى');
                      }}
                      className={`p-3.5 rounded-sm border text-right transition-all cursor-pointer ${
                        !formData.hasAttendedUniversity
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-black'
                      }`}
                    >
                      <div className="font-bold text-xs">خريج ثانوية عامة (توجيهي)</div>
                      <div className={`text-[11px] mt-0.5 ${!formData.hasAttendedUniversity ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        مقبل على التسجيل الجامعي ولم يلتحق بالجامعة بعد
                      </div>
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
                      className={`p-3.5 rounded-sm border text-right transition-all cursor-pointer ${
                        formData.hasAttendedUniversity
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-300 bg-white text-zinc-700 hover:border-black'
                      }`}
                    >
                      <div className="font-bold text-xs">طالب جامعي حالياً</div>
                      <div className={`text-[11px] mt-0.5 ${formData.hasAttendedUniversity ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        ملتحق بجامعة / كلية أو معلق قيده بسبب الرسوم
                      </div>
                    </button>
                  </div>
                </div>

                {formData.hasAttendedUniversity ? (
                  /* Enrolled student fields */
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="enrollmentStatus" className="block text-xs font-bold text-black mb-1.5">
                          الحالة الأكاديمية الراهنة <span className="text-zinc-500">*</span>
                        </label>
                        <select
                          id="enrollmentStatus"
                          value={formData.enrollmentStatus}
                          onChange={(e) => updateField('enrollmentStatus', e.target.value)}
                          className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        >
                          <option value="enrolled">منتظم في الدراسة حالياً ومطالب بالرسوم</option>
                          <option value="paused">متوقف أو معلق القيد بسبب تراكم الرسوم</option>
                          <option value="accepted">مقبول حديثاً ومطالب بالسداد للبدء</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="academicYearOrSemester" className="block text-xs font-bold text-black mb-1.5">
                          السنة أو المستوى الدراسي الحالي <span className="text-zinc-500">*</span>
                        </label>
                        <select
                          id="academicYearOrSemester"
                          value={formData.academicYearOrSemester}
                          onChange={(e) => updateField('academicYearOrSemester', e.target.value)}
                          className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black transition-colors"
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
                        <label htmlFor="institutionName" className="block text-xs font-bold text-black mb-1.5">
                          اسم الجامعة أو الكلية المقيد بها <span className="text-zinc-500">*</span>
                        </label>
                        <input
                          id="institutionName"
                          type="text"
                          required
                          value={formData.institutionName}
                          onChange={(e) => updateField('institutionName', e.target.value)}
                          placeholder="الجامعة الأردنية، اليرموك، العلوم والتكنولوجيا..."
                          className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="major" className="block text-xs font-bold text-black mb-1.5">
                          التخصص الأكاديمي الملتحق به <span className="text-zinc-500">*</span>
                        </label>
                        <input
                          id="major"
                          type="text"
                          required
                          value={formData.major}
                          onChange={(e) => updateField('major', e.target.value)}
                          placeholder="الهندسة المدنية، التمريض، المحاسبة..."
                          className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Prospective High School Graduate fields */
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="institutionName" className="block text-xs font-bold text-black mb-1.5">
                          الجامعة أو الكلية المرغوبة / المقبول بها مبدئياً <span className="text-zinc-500">*</span>
                        </label>
                        <input
                          id="institutionName"
                          type="text"
                          required
                          value={formData.institutionName}
                          onChange={(e) => updateField('institutionName', e.target.value)}
                          placeholder="اسم الجامعة الأردنية المستهدفة"
                          className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor="major" className="block text-xs font-bold text-black mb-1.5">
                          التخصص الأكاديمي المطلوب دراسته <span className="text-zinc-500">*</span>
                        </label>
                        <input
                          id="major"
                          type="text"
                          required
                          value={formData.major}
                          onChange={(e) => updateField('major', e.target.value)}
                          placeholder="التخصص الأكاديمي المطلوب"
                          className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black placeholder:text-zinc-400 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Tuition Details Box */}
                <div className="pt-2">
                  <div className="p-5 sm:p-6 rounded-3xl border-2 border-black bg-emerald-50/70 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label htmlFor="periodTuitionFee" className="block text-xs font-black text-black mb-1">
                          {formData.hasAttendedUniversity
                            ? 'الرسوم الجامعية المستحقة للفصل (د.أ)'
                            : 'الرسوم التقديرية للفصل الدراسي الأول (د.أ)'}{' '}
                          <span className="text-emerald-700">*</span>
                        </label>
                        <input
                          id="periodTuitionFee"
                          type="number"
                          min="0"
                          required
                          value={formData.periodTuitionFee}
                          onChange={(e) => updateField('periodTuitionFee', e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="مثال: 850"
                          className="w-full h-11 px-3.5 text-sm rounded-xl border-2 border-black bg-white text-black font-mono focus:ring-2 focus:ring-[#22c55e]"
                        />
                      </div>

                      <div>
                        <label htmlFor="amountAlreadyPaid" className="block text-xs font-black text-black mb-1">
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
                          className="w-full h-11 px-3.5 text-sm rounded-xl border-2 border-black bg-white text-black font-mono focus:ring-2 focus:ring-[#22c55e]"
                        />
                      </div>
                    </div>

                    <div className="pt-3.5 border-t-2 border-black/10 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-black font-black">المبلغ المتبقي المطلوب كفالته:</span>
                      <span className="font-mono font-black text-black text-base bg-[#facc15] px-4 py-1.5 rounded-xl border-2 border-black">
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
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="householdSize" className="block text-xs font-bold text-black mb-1.5">
                      عدد أفراد الأسرة المقيمين معاً <span className="text-zinc-500">*</span>
                    </label>
                    <input
                      id="householdSize"
                      type="number"
                      min="1"
                      required
                      value={formData.householdSize}
                      onChange={(e) => updateField('householdSize', Number(e.target.value))}
                      className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black font-mono focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="actualBreadwinner" className="block text-xs font-bold text-black mb-1.5">
                      من يعيل الأسرة فعلياً؟ <span className="text-zinc-500">*</span>
                    </label>
                    <select
                      id="actualBreadwinner"
                      value={formData.actualBreadwinner}
                      onChange={(e) => updateField('actualBreadwinner', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
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
                    <label htmlFor="fatherStatus" className="block text-xs font-bold text-black mb-1.5">
                      حالة الأب <span className="text-zinc-500">*</span>
                    </label>
                    <select
                      id="fatherStatus"
                      value={formData.fatherStatus}
                      onChange={(e) => updateField('fatherStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
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
                    <label htmlFor="motherStatus" className="block text-xs font-bold text-black mb-1.5">
                      حالة الأم <span className="text-zinc-500">*</span>
                    </label>
                    <select
                      id="motherStatus"
                      value={formData.motherStatus}
                      onChange={(e) => updateField('motherStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
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
                    <div className="flex items-center justify-between p-3.5 rounded-sm border border-zinc-300 bg-zinc-50">
                      <div>
                        <div className="text-xs font-bold text-black">دخل الأب الشهري (د.أ)</div>
                        <div className="text-[11px] text-zinc-500">الراتب أو العائد الصافي الشهري</div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={formData.fatherIncomeAmount}
                        onChange={(e) => updateField('fatherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-32 h-9 px-3 text-xs rounded-sm border border-zinc-300 bg-white text-black font-mono focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  )}

                  {!['deceased', 'unavailable'].includes(formData.motherStatus) && (
                    <div className="flex items-center justify-between p-3.5 rounded-sm border border-zinc-300 bg-zinc-50">
                      <div>
                        <div className="text-xs font-bold text-black">دخل الأم الشهري (د.أ)</div>
                        <div className="text-[11px] text-zinc-500">الراتب أو العائد الصافي الشهري</div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={formData.motherIncomeAmount}
                        onChange={(e) => updateField('motherIncomeAmount', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="0"
                        className="w-32 h-9 px-3 text-xs rounded-sm border border-zinc-300 bg-white text-black font-mono focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                  )}

                  {/* Pensions or aid */}
                  <div className="flex items-center justify-between p-3.5 rounded-sm border border-zinc-300 bg-zinc-50">
                    <div>
                      <div className="text-xs font-bold text-black">معاشات تقاعدية / تأمينات (د.أ)</div>
                      <div className="text-[11px] text-zinc-500">معاش التقاعد أو الدعم البديل إن وجد</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={formData.pensionsAmount}
                      onChange={(e) => updateField('pensionsAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-32 h-9 px-3 text-xs rounded-sm border border-zinc-300 bg-white text-black font-mono focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-sm border border-zinc-300 bg-zinc-50">
                    <div>
                      <div className="text-xs font-bold text-black">مساعدات نقدية منتظمة (د.أ)</div>
                      <div className="text-[11px] text-zinc-500">المعونة الوطنية أو دعم الجمعيات المستمر</div>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={formData.regularAidAmount}
                      onChange={(e) => updateField('regularAidAmount', e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-32 h-9 px-3 text-xs rounded-sm border border-zinc-300 bg-white text-black font-mono focus:border-black focus:ring-1 focus:ring-black"
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
                    <label htmlFor="housingStatus" className="block text-xs font-bold text-black mb-1.5">
                      حالة سكن الأسرة <span className="text-zinc-500">*</span>
                    </label>
                    <select
                      id="housingStatus"
                      value={formData.housingStatus}
                      onChange={(e) => updateField('housingStatus', e.target.value)}
                      className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black"
                    >
                      <option value="rented">إيجار</option>
                      <option value="owned">ملك</option>
                      <option value="living_with_relatives">إقامة مع الأقارب</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  {formData.housingStatus === 'rented' && (
                    <div>
                      <label htmlFor="monthlyRent" className="block text-xs font-bold text-black mb-1.5">
                        الإيجار الشهري التقريبي (د.أ) <span className="text-zinc-500">*</span>
                      </label>
                      <input
                        id="monthlyRent"
                        type="number"
                        min="0"
                        value={formData.monthlyRent}
                        onChange={(e) => updateField('monthlyRent', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="مثال: 180"
                        className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black font-mono"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="recurringNecessaryMedicalExpenses" className="block text-xs font-bold text-black mb-1.5">
                    مصاريف علاجية شهرية متكررة لأمراض مزمنة غير مغطاة (د.أ) إن وجدت
                  </label>
                  <input
                    id="recurringNecessaryMedicalExpenses"
                    type="number"
                    min="0"
                    value={formData.recurringNecessaryMedicalExpenses}
                    onChange={(e) => updateField('recurringNecessaryMedicalExpenses', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full h-11 px-3.5 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="additionalContext" className="block text-xs font-bold text-black mb-1.5">
                    ملاحظات أو ظروف خاصة تود إحاطة اللجنة بها (اختياري)
                  </label>
                  <textarea
                    id="additionalContext"
                    value={formData.additionalContext}
                    onChange={(e) => updateField('additionalContext', e.target.value)}
                    rows={2}
                    placeholder="بيان أي ظروف استثنائية أو التزامات..."
                    className="w-full p-3 text-sm rounded-sm border border-zinc-300 bg-white text-black focus:border-black focus:ring-1 focus:ring-black resize-none"
                  />
                </div>

                {/* Declarations (Mandatory) */}
                <div className="pt-2">
                  <div className="p-4 sm:p-5 rounded-sm border border-zinc-300 bg-zinc-50 space-y-3">
                    <label className="flex items-start gap-2.5 text-xs text-black cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.infoAccuracyAcknowledged}
                        onChange={(e) => updateField('infoAccuracyAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded-sm border-zinc-400 accent-black text-black shrink-0"
                      />
                      <span>أقر بصحة ودقة كافة المعلومات والبيانات المدخلة في هذا الطلب حسب علمي ومسؤوليتي.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-black cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.dataUseAcknowledged}
                        onChange={(e) => updateField('dataUseAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded-sm border-zinc-400 accent-black text-black shrink-0"
                      />
                      <span>أوافق على استخدام هذه البيانات من قبل لجنة المبادرة لغايات التدقيق والمفاضلة بسرية تامة.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-black cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.willingToProvideDocsAcknowledged}
                        onChange={(e) => updateField('willingToProvideDocsAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded-sm border-zinc-400 accent-black text-black shrink-0"
                      />
                      <span>أتعهد بتقديم كافة المستندات الثبوتية الرسمية عند طلب اللجنة للتحقق المكتبي.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-black cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.noGuaranteeAcknowledged}
                        onChange={(e) => updateField('noGuaranteeAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded-sm border-zinc-400 accent-black text-black shrink-0"
                      />
                      <span>أعلم أن تقديم الطلب خطوة للمفاضلة ولا يعني القبول التلقائي ويخضع لقرار اللجنة النهائي.</span>
                    </label>

                    <label className="flex items-start gap-2.5 text-xs text-black bg-white p-3 rounded-sm border border-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.disqualificationAcknowledged}
                        onChange={(e) => updateField('disqualificationAcknowledged', e.target.checked)}
                        className="mt-0.5 rounded-sm border-black accent-black text-black shrink-0"
                      />
                      <span className="font-bold leading-relaxed">
                        أقر بأنني على علم تام ومطلق بأن إدخال أي معلومات غير صحيحة أو مضللة سيؤدي للاستبعاد الفوري والنهائي للطلب في مرحلة التدقيق ومطابقة الوثائق الرسمية دون أي استثناء.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-zinc-200 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="py-3 px-6 rounded-2xl border-2 border-zinc-300 hover:border-black text-black bg-white hover:bg-zinc-50 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                <span>الخطوة السابقة</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-8 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs sm:text-sm font-black flex items-center gap-2 transition-all border-2 border-black active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <span>متابعة</span>
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-9 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-zinc-300 text-white text-xs sm:text-sm font-black flex items-center gap-2.5 transition-all border-2 border-black active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جارٍ تأكيد الطلب...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" />
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
