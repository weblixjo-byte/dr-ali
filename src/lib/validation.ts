import { z } from 'zod';

const incomeItemSchema = z
  .object({
    amount: z.number().min(0).nullable(),
    frequency: z.enum(['fixed', 'variable', 'seasonal']).optional(),
    isNetAvailable: z.boolean().optional(),
    notes: z.string().max(300).optional(),
    isUnknown: z.boolean().optional(),
  })
  .nullable();

const expenseObligationSchema = z.object({
  type: z.string().min(1).max(100),
  monthlyAmount: z.number().min(0).max(100000),
  explanation: z.string().min(1).max(300),
});

export const publicApplicationSubmissionSchema = z.object({
  idempotencyKey: z.string().min(8).max(128),
  website_url_hp: z.string().max(0).optional().or(z.literal('')), // Honeypot field (must be empty)
  submissionTimestamp: z.number().optional(), // Anti-speed bot check

  // 1. Personal & Contact
  fullName: z
    .string()
    .trim()
    .min(5, 'يجب إدخال الاسم الرباعي كاملاً (5 أحرف على الأقل)')
    .max(120, 'الاسم طويل جداً'),
  phoneCountryCode: z.string().trim().regex(/^\+\d{1,4}$/, 'رمز الدولة غير صالح'),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, 'يرجى إدخال رقم هاتف صالح مكون من أرقام فقط'),
  email: z.string().trim().email('صيغة البريد الإلكتروني غير صحيحة').max(100).optional().or(z.literal('')),
  governorateOrCity: z.string().trim().min(2, 'يرجى إدخال المدينة أو المحافظة').max(100),
  preferredContactMethod: z.enum(['phone', 'whatsapp', 'email'], {
    error: 'يرجى اختيار وسيلة التواصل المفضلة',
  }),

  // 2. Academic & Study
  institutionName: z.string().trim().min(2, 'يرجى تحديد المؤسسة التعليمية').max(150),
  studyLevel: z.string().trim().min(2, 'يرجى تحديد المرحلة الدراسية').max(100),
  major: z.string().trim().min(2, 'يرجى إدخال التخصص الدراسي').max(150),
  academicYearOrSemester: z.string().trim().min(2, 'يرجى تحديد السنة أو الفصل الدراسي').max(100),
  enrollmentStatus: z.enum(['enrolled', 'accepted', 'paused'], {
    error: 'يرجى تحديد الحالة الدراسية',
  }),
  periodTuitionFee: z.number().min(0, 'الرسوم يجب أن تكون صفراً أو أكثر').max(500000),
  amountAlreadyPaid: z.number().min(0, 'المبلغ المدفوع يجب أن يكون صفراً أو أكثر').max(500000),
  confirmedExternalSupport: z
    .number()
    .min(0, 'الدعم الخارجي يجب أن يكون صفراً أو أكثر')
    .max(500000)
    .default(0),
  isPaymentDeadlineNear: z.boolean().default(false),
  atRiskOfSuspension: z.boolean().default(false),
  otherScholarshipsOrDiscounts: z.enum(['none', 'partial', 'full']),
  educationNotes: z.string().max(500).optional(),

  // 3. Family & Household
  householdSize: z.number().int().min(1, 'عدد أفراد الأسرة يجب أن يكون 1 على الأقل').max(40),
  dependentsCount: z.number().int().min(0).max(40),
  earnersCount: z.number().int().min(0).max(20),
  otherStudyingFamilyMembersCount: z.number().int().min(0).max(20),
  actualBreadwinner: z.enum(
    ['father', 'mother', 'student', 'brother_sister', 'relative', 'none_shared'],
    { error: 'يرجى تحديد المعيل الفعلي للأسرة' }
  ),
  fatherStatus: z.enum(
    ['working', 'unemployed', 'retired', 'deceased', 'unavailable', 'not_applicable', 'other']
  ),
  motherStatus: z.enum(
    ['working', 'unemployed', 'retired', 'deceased', 'unavailable', 'not_applicable', 'other']
  ),
  alternativeSupportAvailable: z.enum(['yes', 'no', 'partial']),
  recentBreadwinnerLoss: z.boolean().default(false),
  recentBreadwinnerLossDate: z.string().max(50).optional(),
  recentBreadwinnerLossImpact: z.string().max(500).optional(),
  familyNotes: z.string().max(500).optional(),

  // 4. Income Structure
  income: z.object({
    fatherIncome: incomeItemSchema,
    motherIncome: incomeItemSchema,
    studentIncome: incomeItemSchema,
    otherFamilyContributions: incomeItemSchema,
    pensions: incomeItemSchema,
    regularCashAid: incomeItemSchema,
    irregularAidNotes: z.string().max(300).optional(),
    irregularAidAnnualEstimate: z.number().min(0).nullable().optional(),
    otherIncomeNotes: z.string().max(300).optional(),
    otherIncomeMonthly: z.number().min(0).nullable().optional(),
  }),
  hasSeasonalIncome: z.boolean().default(false),
  seasonalIncomeCalculationMethod: z.string().max(300).optional(),

  // 5. Expenses & Obligations
  housingStatus: z.enum(['owned', 'rented', 'living_with_relatives', 'other']),
  monthlyRent: z.number().min(0).max(50000).nullable(),
  recurringNecessaryMedicalExpenses: z.number().min(0).max(50000).nullable(),
  necessaryCareObligations: z.number().min(0).max(50000).nullable(),
  otherFamilyEducationExpenses: z.number().min(0).max(50000).nullable(),
  basicTransportExpenses: z.number().min(0).max(50000).nullable(),
  otherObligations: z.array(expenseObligationSchema).max(5).default([]),

  // 6. Special Circumstances
  recentJobLossOrIncomeDrop: z.boolean().default(false),
  recentJobLossDetails: z.string().max(400).optional(),
  deathOrAbsenceOfBreadwinnerImpact: z.boolean().default(false),
  deathOrAbsenceImpactDetails: z.string().max(400).optional(),
  healthOrCaregivingBurdenImpact: z.boolean().default(false),
  healthOrCaregivingDetails: z.string().max(400).optional(),
  additionalContext: z.string().max(500).optional(),

  // 7. Declarations
  infoAccuracyAcknowledged: z.literal(true, {
    error: 'يجب الإقرار بصحة كافة البيانات المدخلة',
  }),
  dataUseAcknowledged: z.literal(true, {
    error: 'يجب الموافقة على استخدام البيانات لأغراض دراسة الطلب',
  }),
  willingToProvideDocsAcknowledged: z.literal(true, {
    error: 'يجب الموافقة على الاستعداد لتقديم الوثائق الداعمة عند الطلب',
  }),
  noGuaranteeAcknowledged: z.literal(true, {
    error: 'يجب الإقرار بأن التقديم لا يضمن القبول التلقائي',
  }),
});

export type PublicApplicationSubmissionInput = z.infer<typeof publicApplicationSubmissionSchema>;

export const adminStatusUpdateSchema = z.object({
  status: z.enum([
    'new',
    'in_review',
    'needs_completion',
    'verified_eligible',
    'ineligible',
    'waitlist',
    'accepted',
    'withdrawn',
  ]),
  verificationStatus: z
    .enum(['unverified', 'partially_verified', 'fully_verified', 'rejected_documents'])
    .optional(),
  eligibilityStatus: z.enum(['eligible', 'ineligible', 'pending']).optional(),
  decisionStatus: z.enum(['pending', 'accepted', 'waitlist', 'rejected']).optional(),
  reviewerNotes: z.string().max(1000).optional(),
  skippedReason: z.string().max(500).optional(),
  manualTieBreakNotes: z.string().max(500).optional(),
});

export const adminCorrectionSchema = z.object({
  fieldName: z.string().min(1).max(100),
  newValue: z.unknown(),
  reason: z.string().trim().min(5, 'يجب تدوين سبب التعديل بوضوح').max(500),
});

export const updateCriteriaSchema = z.object({
  reasonForVersion: z.string().trim().min(5, 'يجب تقديم سبب معتمد لإصدار نسخة جديدة من المعايير').max(400),
  weights: z.object({
    perCapitaIncome: z.number().min(0).max(100),
    uncoveredTuition: z.number().min(0).max(100),
    expenseBurden: z.number().min(0).max(100),
    breadwinnerVulnerability: z.number().min(0).max(100),
  }),
  monthlyPerCapitaBenchmark: z.number().min(100).max(50000),
  currencyCode: z.string().trim().min(1).max(10),
  expenseBurdenCapRatio: z.number().min(0.1).max(1.0),
});

export const updateInitiativeSettingsSchema = z.object({
  title: z.string().trim().min(3).max(200),
  isSubmissionOpen: z.boolean(),
  submissionStartDate: z.string().min(8).max(20),
  submissionEndDate: z.string().min(8).max(20),
  resultsAnnouncementDate: z.string().min(8).max(20),
  scholarshipCoverageDescription: z.string().min(5).max(1000),
  valueOrCapDescription: z.string().min(5).max(500),
  targetGroupDescription: z.string().min(5).max(1000),
  includedInstitutionsDescription: z.string().min(5).max(1000),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7).max(25),
  privacyPolicySummary: z.string().min(10).max(2000),
});
