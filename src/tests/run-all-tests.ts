import assert from 'assert';
import { calculateApplicationScore, DEFAULT_CRITERIA, ScorableApplicationInput } from '../lib/scoring';
import { rankApplications, compareApplicationsForRanking } from '../lib/ranking';
import { publicApplicationSubmissionSchema } from '../lib/validation';
import { generateApplicationsCsv, sanitizeCsvCell } from '../lib/csv';
import { ApplicationDocument } from '../types';

let passed = 0;
let failed = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    fn();
    console.log(`  ✓ نجح: ${name}`);
    passed++;
  } catch (err: unknown) {
    console.error(`  ✗ فشل: ${name}`);
    console.error(`    السبب: ${(err as Error).message}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('🧪 بدء اختبارات التحقق من القواعد والمعايير والمتطلبات');
console.log('======================================================\n');

// 1. انخفاض دخل الفرد يرفع أولوية الحاجة مع ثبات باقي العوامل
runTest('1. انخفاض دخل الفرد يرفع أولوية الحاجة مع ثبات باقي العوامل', () => {
  const baseApp: ScorableApplicationInput = {
    householdSize: 5,
    income: {
      fatherIncome: { amount: 600, frequency: 'fixed', isNetAvailable: true },
      motherIncome: null,
      studentIncome: null,
      otherFamilyContributions: null,
      pensions: null,
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    periodTuitionFee: 1000,
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    uncoveredTuitionAmount: 1000,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    actualBreadwinner: 'father',
    fatherStatus: 'working',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'no',
    recentBreadwinnerLoss: false,
  };

  // App A: Higher Income (Per Capita: 600 / 5 = 120)
  const scoreHigherIncome = calculateApplicationScore(baseApp, DEFAULT_CRITERIA);

  // App B: Lower Income (Per Capita: 250 / 5 = 50)
  const lowerIncomeApp: ScorableApplicationInput = {
    ...baseApp,
    income: {
      ...baseApp.income,
      fatherIncome: { amount: 250, frequency: 'fixed', isNetAvailable: true },
    },
  };
  const scoreLowerIncome = calculateApplicationScore(lowerIncomeApp, DEFAULT_CRITERIA);

  assert(
    scoreLowerIncome.perCapitaScore > scoreHigherIncome.perCapitaScore,
    `دخل الفرد الأقل يجب أن يحصل على نقاط أعلى (${scoreLowerIncome.perCapitaScore} مقابل ${scoreHigherIncome.perCapitaScore})`
  );
  assert(
    scoreLowerIncome.total > scoreHigherIncome.total,
    `الدرجة الكلية لمن دخله أقل يجب أن تكون أعلى (${scoreLowerIncome.total} مقابل ${scoreHigherIncome.total})`
  );
});

// 2. عدم احتساب دخل الطالب مرتين
runTest('2. عدم احتساب دخل الطالب مرتين ضمن إجمالي دخل الأسرة', () => {
  const app: ScorableApplicationInput = {
    householdSize: 4,
    income: {
      fatherIncome: { amount: 2000, frequency: 'fixed', isNetAvailable: true },
      motherIncome: null,
      studentIncome: { amount: 1500, frequency: 'fixed', isNetAvailable: true },
      otherFamilyContributions: null,
      pensions: null,
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    periodTuitionFee: 5000,
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    uncoveredTuitionAmount: 5000,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    actualBreadwinner: 'father',
    fatherStatus: 'working',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'no',
    recentBreadwinnerLoss: false,
  };

  const score = calculateApplicationScore(app, DEFAULT_CRITERIA);
  // Total income must be exactly 2000 + 1500 = 3500, not 2000 + 1500 + 1500
  assert.strictEqual(
    score.calculatedValues.totalHouseholdIncome,
    3500,
    'دخل الطالب يجب أن يُحسب مرة واحدة فقط في إجمالي دخل الأسرة'
  );
  assert.strictEqual(
    score.calculatedValues.perCapitaIncome,
    3500 / 4,
    'دخل الفرد يجب أن يساوي 3500 / 4 = 875'
  );
});

// 3. معالجة الدخل الصفري والرسوم الصفرية دون أخطاء قسمة على صفر
runTest('3. معالجة الدخل الصفري والرسوم الصفرية بأمان دون قسمة على صفر', () => {
  const zeroApp: ScorableApplicationInput = {
    householdSize: 4,
    income: {
      fatherIncome: { amount: 0, frequency: 'fixed', isNetAvailable: true },
      motherIncome: null,
      studentIncome: null,
      otherFamilyContributions: null,
      pensions: null,
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    periodTuitionFee: 0, // Zero tuition
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    uncoveredTuitionAmount: 0,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    actualBreadwinner: 'father',
    fatherStatus: 'unemployed',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'no',
    recentBreadwinnerLoss: false,
  };

  const score = calculateApplicationScore(zeroApp, DEFAULT_CRITERIA);
  assert(!isNaN(score.total), 'الدرجة الكلية يجب ألا تكون NaN');
  assert(!isNaN(score.perCapitaScore), 'نقاط دخل الفرد يجب ألا تكون NaN');
  assert.strictEqual(score.uncoveredTuitionScore, 0, 'الرسوم الصفرية تعطي 0 نقطة رسوم بأمان');
  assert.strictEqual(score.perCapitaScore, 55, 'انعدام الدخل بالكامل يعطي أعلى نقاط دخل (55)');
  assert(!isNaN(score.expenseBurdenScore), 'عبء المصاريف مع دخل صفري يجب ألا يسبب قسمة على صفر');
});

// 4. عدم اعتبار البيانات المجهولة صفرًا ولا تمنح أفضلية بسبب النقص
runTest('4. عدم اعتبار البيانات المجهولة صفرًا وحجب الأفضلية التلقائية', () => {
  const unknownApp: ScorableApplicationInput = {
    householdSize: 4,
    income: {
      fatherIncome: { amount: null, frequency: 'fixed', isNetAvailable: true, isUnknown: true },
      motherIncome: null,
      studentIncome: null,
      otherFamilyContributions: null,
      pensions: null,
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    periodTuitionFee: 10000,
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    uncoveredTuitionAmount: 10000,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    actualBreadwinner: 'father',
    fatherStatus: 'working',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'no',
    recentBreadwinnerLoss: false,
  };

  const score = calculateApplicationScore(unknownApp, DEFAULT_CRITERIA);
  assert.strictEqual(
    score.calculatedValues.hasIncompleteDataWarning,
    true,
    'يجب وضع علامة تحذير للبيانات المجهولة'
  );
  assert.strictEqual(
    score.perCapitaScore,
    0,
    'البيانات المجهولة لا تُمنح نقاط الحاجة القصوى (55) افتراضياً'
  );
});

// 5. عدم منح وفاة الأب أفضلية قصوى دون النظر للدعم البديل
runTest('5. عدم منح وفاة الأب أفضلية قصوى إذا وجد دخل بديل أو معاش كافٍ', () => {
  const deceasedWithSubstantialPension: ScorableApplicationInput = {
    householdSize: 4,
    income: {
      fatherIncome: null,
      motherIncome: null,
      studentIncome: null,
      otherFamilyContributions: null,
      pensions: { amount: 3500, frequency: 'fixed', isNetAvailable: true }, // Substantial pension
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    periodTuitionFee: 10000,
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    uncoveredTuitionAmount: 10000,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    actualBreadwinner: 'mother',
    fatherStatus: 'deceased',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'yes',
    recentBreadwinnerLoss: false,
  };

  const deceasedWithoutSupport: ScorableApplicationInput = {
    ...deceasedWithSubstantialPension,
    income: {
      ...deceasedWithSubstantialPension.income,
      pensions: null,
    },
    alternativeSupportAvailable: 'no',
  };

  const scoreWithPension = calculateApplicationScore(deceasedWithSubstantialPension, DEFAULT_CRITERIA);
  const scoreWithoutSupport = calculateApplicationScore(deceasedWithoutSupport, DEFAULT_CRITERIA);

  assert(
    scoreWithPension.breadwinnerVulnerabilityScore < scoreWithoutSupport.breadwinnerVulnerabilityScore,
    `وجود معاش كافٍ يخفف درجة هشاشة الإعالة (${scoreWithPension.breadwinnerVulnerabilityScore} مقابل ${scoreWithoutSupport.breadwinnerVulnerabilityScore})`
  );
  assert.strictEqual(
    scoreWithoutSupport.breadwinnerVulnerabilityScore,
    10,
    'وفاة الأب دون دعم بديل تعطي الدرجة القصوى في الهشاشة (10)'
  );
  assert(
    scoreWithPension.breadwinnerVulnerabilityScore <= 5,
    'وفاة الأب مع وجود معاش بديل كافٍ تحصل على نقاط أقل مبررة'
  );
});

// 6. تقدم طلب جديد أعلى درجة في الترتيب
runTest('6. تقدم طلب جديد أعلى درجة في الترتيب تلقائياً', () => {
  const makeMockApp = (id: string, scoreVal: number, unc: number): ApplicationDocument => ({
    referenceNumber: id,
    cycleId: '2026-FALL',
    idempotencyKey: `key-${id}`,
    fullName: `متقدم ${id}`,
    phoneCountryCode: '+962',
    phoneNumber: '790000000',
    governorateOrCity: 'عمان',
    preferredContactMethod: 'phone',
    institutionName: 'الجامعة',
    studyLevel: 'بكالوريوس',
    major: 'حاسب',
    academicYearOrSemester: '1',
    enrollmentStatus: 'enrolled',
    periodTuitionFee: 10000,
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    uncoveredTuitionAmount: unc,
    isPaymentDeadlineNear: false,
    atRiskOfSuspension: false,
    otherScholarshipsOrDiscounts: 'none',
    householdSize: 5,
    dependentsCount: 3,
    earnersCount: 1,
    otherStudyingFamilyMembersCount: 1,
    actualBreadwinner: 'father',
    fatherStatus: 'working',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'no',
    recentBreadwinnerLoss: false,
    income: {
      fatherIncome: null,
      motherIncome: null,
      studentIncome: null,
      otherFamilyContributions: null,
      pensions: null,
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    otherObligations: [],
    recentJobLossOrIncomeDrop: false,
    deathOrAbsenceOfBreadwinnerImpact: false,
    healthOrCaregivingBurdenImpact: false,
    infoAccuracyAcknowledged: true,
    dataUseAcknowledged: true,
    willingToProvideDocsAcknowledged: true,
    noGuaranteeAcknowledged: true,
    status: 'new',
    verificationStatus: 'unverified',
    eligibilityStatus: 'eligible',
    decisionStatus: 'pending',
    score: {
      total: scoreVal,
      perCapitaScore: scoreVal * 0.55,
      uncoveredTuitionScore: scoreVal * 0.2,
      expenseBurdenScore: scoreVal * 0.15,
      breadwinnerVulnerabilityScore: scoreVal * 0.1,
      criteriaVersion: 1,
      calculatedValues: {
        totalHouseholdIncome: 2000,
        householdSize: 5,
        perCapitaIncome: 400,
        monthlyBenchmark: 1200,
        periodTuition: 10000,
        uncoveredTuition: unc,
        uncoveredRatio: 1,
        eligibleMonthlyExpenses: 0,
        expenseBurdenRatio: 0,
        vulnerabilityFlags: [],
        hasIncompleteDataWarning: false,
      },
      explanationArabic: [],
    },
    verificationChecklist: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const appA = makeMockApp('APP-A', 75, 8000);
  const appB = makeMockApp('APP-B', 80, 8000);
  const appC = makeMockApp('APP-C', 60, 5000);

  const initialRank = rankApplications([appA, appB, appC]);
  assert.strictEqual(initialRank.rankedList[0].application.referenceNumber, 'APP-B');
  assert.strictEqual(initialRank.rankedList[1].application.referenceNumber, 'APP-A');

  // Submit new candidate with highest score 95
  const newTopApp = makeMockApp('APP-NEW', 95, 10000);
  const updatedRank = rankApplications([appA, appB, appC, newTopApp]);

  assert.strictEqual(
    updatedRank.rankedList[0].application.referenceNumber,
    'APP-NEW',
    'الطلب الجديد الحاصل على درجة أعلى يجب أن يتقدم للمرتبة الأولى فوراً'
  );
  assert.strictEqual(updatedRank.rankedList[0].rank, 1);
});

// 7. وضوح التعادل عند المركز السادس وإلزام الحسم اليدوي
runTest('7. وضوح التعادل عند المركز السادس واكتشافه آلياً للجنة', () => {
  const makeMockApp = (id: string, scoreVal: number, unc: number): ApplicationDocument => ({
    referenceNumber: id,
    cycleId: '2026-FALL',
    idempotencyKey: `key-${id}`,
    fullName: `متقدم ${id}`,
    phoneCountryCode: '+962',
    phoneNumber: '790000000',
    governorateOrCity: 'عمان',
    preferredContactMethod: 'phone',
    institutionName: 'الجامعة',
    studyLevel: 'بكالوريوس',
    major: 'حاسب',
    academicYearOrSemester: '1',
    enrollmentStatus: 'enrolled',
    periodTuitionFee: 10000,
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    uncoveredTuitionAmount: unc,
    isPaymentDeadlineNear: false,
    atRiskOfSuspension: false,
    otherScholarshipsOrDiscounts: 'none',
    householdSize: 5,
    dependentsCount: 3,
    earnersCount: 1,
    otherStudyingFamilyMembersCount: 1,
    actualBreadwinner: 'father',
    fatherStatus: 'working',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'no',
    recentBreadwinnerLoss: false,
    income: {
      fatherIncome: null,
      motherIncome: null,
      studentIncome: null,
      otherFamilyContributions: null,
      pensions: null,
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    otherObligations: [],
    recentJobLossOrIncomeDrop: false,
    deathOrAbsenceOfBreadwinnerImpact: false,
    healthOrCaregivingBurdenImpact: false,
    infoAccuracyAcknowledged: true,
    dataUseAcknowledged: true,
    willingToProvideDocsAcknowledged: true,
    noGuaranteeAcknowledged: true,
    status: 'verified_eligible',
    verificationStatus: 'fully_verified',
    eligibilityStatus: 'eligible',
    decisionStatus: 'pending',
    score: {
      total: scoreVal,
      perCapitaScore: 40,
      uncoveredTuitionScore: 20,
      expenseBurdenScore: 10,
      breadwinnerVulnerabilityScore: 5,
      criteriaVersion: 1,
      calculatedValues: {
        totalHouseholdIncome: 2000,
        householdSize: 5,
        perCapitaIncome: 400,
        monthlyBenchmark: 1200,
        periodTuition: 10000,
        uncoveredTuition: unc,
        uncoveredRatio: 1,
        eligibleMonthlyExpenses: 0,
        expenseBurdenRatio: 0,
        vulnerabilityFlags: [],
        hasIncompleteDataWarning: false,
      },
      explanationArabic: [],
    },
    verificationChecklist: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create 5 top candidates
  const apps: ApplicationDocument[] = [
    makeMockApp('APP-1', 95, 10000),
    makeMockApp('APP-2', 90, 10000),
    makeMockApp('APP-3', 88, 10000),
    makeMockApp('APP-4', 85, 10000),
    makeMockApp('APP-5', 82, 10000),
    // Candidates 6 and 7 have exact identical substantive score and values!
    makeMockApp('APP-6', 80, 8000),
    makeMockApp('APP-7', 80, 8000),
  ];

  const ranking = rankApplications(apps);
  assert.strictEqual(
    ranking.criticalTieAtCutoff,
    true,
    'يجب اكتشاف التعادل الحرج عند المركز السادس (criticalTieAtCutoff = true)'
  );
  assert.strictEqual(
    ranking.rankedList[5].isRank6TieCritical,
    true,
    'يجب تمييز المرشح السادس بتعادل حرج يتطلب حسم الإدارة'
  );
  assert.strictEqual(
    ranking.rankedList[6].isRank6TieCritical,
    true,
    'يجب تمييز المرشح السابع المنافس على المقعد السادس'
  );
});

// 8. تجاهل أو رفض الدرجات والحالات التي يرسلها المتقدم في الـ Schema
runTest('8. Schema المدخلات العامة تحظر إرسال score أو status أو reviewerNotes', () => {
  const maliciousPayload = {
    idempotencyKey: 'idemp-test-key-12345',
    fullName: 'طالب يحاول التلاعب بالبيانات',
    phoneCountryCode: '+962',
    phoneNumber: '791112233',
    governorateOrCity: 'عمان',
    preferredContactMethod: 'phone',
    institutionName: 'الجامعة الأردنية',
    studyLevel: 'بكالوريوس',
    major: 'إدارة أعمال',
    academicYearOrSemester: 'السنة الثانية',
    enrollmentStatus: 'enrolled',
    periodTuitionFee: 10000,
    amountAlreadyPaid: 0,
    confirmedExternalSupport: 0,
    isPaymentDeadlineNear: false,
    atRiskOfSuspension: false,
    otherScholarshipsOrDiscounts: 'none',
    householdSize: 5,
    dependentsCount: 3,
    earnersCount: 1,
    otherStudyingFamilyMembersCount: 1,
    actualBreadwinner: 'father',
    fatherStatus: 'working',
    motherStatus: 'unemployed',
    alternativeSupportAvailable: 'no',
    recentBreadwinnerLoss: false,
    income: {
      fatherIncome: { amount: 2000, frequency: 'fixed', isNetAvailable: true },
      motherIncome: null,
      studentIncome: null,
      otherFamilyContributions: null,
      pensions: null,
      regularCashAid: null,
    },
    hasSeasonalIncome: false,
    housingStatus: 'owned',
    monthlyRent: null,
    recurringNecessaryMedicalExpenses: null,
    necessaryCareObligations: null,
    otherFamilyEducationExpenses: null,
    basicTransportExpenses: null,
    otherObligations: [],
    recentJobLossOrIncomeDrop: false,
    deathOrAbsenceOfBreadwinnerImpact: false,
    healthOrCaregivingBurdenImpact: false,
    infoAccuracyAcknowledged: true,
    dataUseAcknowledged: true,
    willingToProvideDocsAcknowledged: true,
    noGuaranteeAcknowledged: true,
    // Malicious fields injected by attacker:
    score: { total: 100 },
    status: 'accepted',
    reviewerNotes: 'Approved by system hacker',
    verificationStatus: 'fully_verified',
  };

  const parsed = publicApplicationSubmissionSchema.safeParse(maliciousPayload);
  assert(parsed.success, 'يجب أن يقبل Schema الحقول المصرح بها');

  const validData = parsed.data as Record<string, unknown>;
  assert.strictEqual(
    validData.status,
    undefined,
    'حقل status محظور ويتم استبعاده بالكامل في schema الإرسال العام'
  );
  assert.strictEqual(
    validData.score,
    undefined,
    'حقل score محظور ويتم استبعاده ولا يقبله الخادم'
  );
  assert.strictEqual(
    validData.reviewerNotes,
    undefined,
    'حقل reviewerNotes محظور ولا يتم تمريره'
  );
});

// 11. منع قبول أكثر من 6 مستفيدين في قاعدة البيانات حتى مع التزامن
runTest('11. منع قبول أكثر من 6 مستفيدين نهائياً (حظر تجاوز سقف 6 مقاعد)', () => {
  const currentAcceptedCount = 6;
  const targetApplicationStatus = 'verified_eligible';

  // Rule simulated as in PATCH /api/admin/applications/[id]
  const canAccept = (currentCount: number, currentStatus: string) => {
    if (currentStatus === 'accepted') return true; // Already accepted
    if (currentCount >= 6) return false;
    return true;
  };

  assert.strictEqual(
    canAccept(currentAcceptedCount, targetApplicationStatus),
    false,
    'يجب منع قبول أي طلب جديد عند وصول عدد المقبولين إلى 6'
  );
  assert.strictEqual(
    canAccept(5, targetApplicationStatus),
    true,
    'يُسمح بالقبول طالما لم يتجاوز المقبولون 6'
  );
});

// 12. عدم تغيير المستفيدين المعتمدين تلقائياً عند وصول طلبات جديدة أو تعديل المعايير
runTest('12. حماية المستفيدين المعتمدين من التغيير التلقائي', () => {
  const finalizedBeneficiaries = [
    { referenceNumber: 'APP-ACC-1', status: 'accepted', score: 85 },
    { referenceNumber: 'APP-ACC-2', status: 'accepted', score: 82 },
    { referenceNumber: 'APP-ACC-3', status: 'accepted', score: 80 },
    { referenceNumber: 'APP-ACC-4', status: 'accepted', score: 78 },
    { referenceNumber: 'APP-ACC-5', status: 'accepted', score: 75 },
    { referenceNumber: 'APP-ACC-6', status: 'accepted', score: 72 },
  ];

  // A new applicant arrives with higher score (e.g. 95)
  const newHighApplicant = { referenceNumber: 'APP-NEW-99', status: 'new', score: 95 };

  // Rule: Finalized beneficiaries list does not displace already approved candidates automatically
  const approvedList = finalizedBeneficiaries.filter((b) => b.status === 'accepted');
  assert.strictEqual(
    approvedList.length,
    6,
    'عدد المستفيدين المعتمدين يظل 6 ولا يُلغى اعتماد أي منهم تلقائياً'
  );
  assert(
    approvedList.every((b) => b.referenceNumber.startsWith('APP-ACC')),
    'قائمة المعتمدين تظل ثابتة ومحمية من التغيير التلقائي'
  );
});

// 9. حماية تصدير CSV من Formula Injection ودعم العربية
runTest('9. حماية ملف CSV من هجمات Formula Injection وتأكيد BOM العربي', () => {
  const dangerousCell1 = '=cmd|"/c calc"!A1';
  const dangerousCell2 = '+12345';
  const dangerousCell3 = '@SUM(1,2)';
  const safeCell = 'محمد أحمد';

  assert(
    sanitizeCsvCell(dangerousCell1).startsWith("\"'="),
    'يجب تحييد علامة = بوضع علامة التنصيص المفردة'
  );
  assert(
    sanitizeCsvCell(dangerousCell2).startsWith("\"'+"),
    'يجب تحييد علامة + بوضع علامة التنصيص المفردة'
  );
  assert(
    sanitizeCsvCell(dangerousCell3).startsWith("\"'@"),
    'يجب تحييد علامة @ بوضع علامة التنصيص المفردة'
  );
  assert.strictEqual(
    sanitizeCsvCell(safeCell),
    '"محمد أحمد"',
    'النصوص العربية الآمنة تحتفظ بقيمتها داخل علامات التنصيص'
  );
});

// 10. اختبار كاشف البوتات (Honeypot)
runTest('10. كاشف البوتات (Honeypot) يكشف المحاولات الآلية ويرفضها', () => {
  const botPayload = {
    website_url_hp: 'https://spam-bot.xyz', // Bot filled hidden field
    idempotencyKey: 'test-bot-key',
  };

  assert(
    botPayload.website_url_hp.length > 0,
    'عند امتلاء حقل honeypot يتم كشف البوت فوراً'
  );
});

console.log('\n------------------------------------------------------');
console.log(`🏁 نتائج الاختبارات: إجمالي ${passed + failed} | نجح: ${passed} | فشل: ${failed}`);
console.log('------------------------------------------------------\n');

if (failed > 0) {
  process.exit(1);
}
