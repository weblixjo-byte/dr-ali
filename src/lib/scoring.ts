import {
  ApplicationDocument,
  ScoringCriteria,
  ScoreBreakdown,
  IncomeBreakdown
} from '@/types';

export const DEFAULT_CRITERIA: ScoringCriteria = {
  version: 1,
  approvedAt: '2026-01-15T00:00:00.000Z',
  approvedBy: 'لجنة المنح الدراسية',
  reasonForVersion: 'الاعتماد الأولي لمنظومة معايير المفاضلة الاقتصادية للعام الدراسي 2026',
  maxScore: 100,
  weights: {
    perCapitaIncome: 55,
    uncoveredTuition: 20,
    expenseBurden: 15,
    breadwinnerVulnerability: 10
  },
  monthlyPerCapitaBenchmark: 300, // مرجع دخل شهري للفرد قابل للضبط حسب العملة والبلد (د.أ للأردن)
  currencyCode: 'د.أ',
  expenseBurdenCapRatio: 0.75
};

export type ScorableApplicationInput = Pick<
  ApplicationDocument,
  | 'householdSize'
  | 'income'
  | 'hasSeasonalIncome'
  | 'periodTuitionFee'
  | 'amountAlreadyPaid'
  | 'confirmedExternalSupport'
  | 'uncoveredTuitionAmount'
  | 'housingStatus'
  | 'monthlyRent'
  | 'recurringNecessaryMedicalExpenses'
  | 'necessaryCareObligations'
  | 'otherFamilyEducationExpenses'
  | 'basicTransportExpenses'
  | 'actualBreadwinner'
  | 'fatherStatus'
  | 'motherStatus'
  | 'alternativeSupportAvailable'
  | 'recentBreadwinnerLoss'
  | 'recentBreadwinnerLossImpact'
>;

export function calculateApplicationScore(
  app: ScorableApplicationInput,
  criteria: ScoringCriteria = DEFAULT_CRITERIA
): ScoreBreakdown {
  const explanationArabic: string[] = [];
  const vulnerabilityFlags: string[] = [];
  let hasIncompleteDataWarning = false;

  // 1. Calculate Household Monthly Income
  // Ensuring student income is added ONCE only
  let totalHouseholdIncome = 0;
  let hasUnknownIncomeSources = false;

  const sumIncomeItem = (item: IncomeBreakdown[keyof IncomeBreakdown]) => {
    if (!item || typeof item !== 'object') return 0;
    if ('isUnknown' in item && item.isUnknown) {
      hasUnknownIncomeSources = true;
      return 0;
    }
    if ('amount' in item && item.amount !== null && !isNaN(item.amount)) {
      return Math.max(0, item.amount);
    }
    return 0;
  };

  const fatherIncomeAmt = sumIncomeItem(app.income.fatherIncome);
  const motherIncomeAmt = sumIncomeItem(app.income.motherIncome);
  const studentIncomeAmt = sumIncomeItem(app.income.studentIncome);
  const otherFamilyAmt = sumIncomeItem(app.income.otherFamilyContributions);
  const pensionsAmt = sumIncomeItem(app.income.pensions);
  const regularAidAmt = sumIncomeItem(app.income.regularCashAid);
  const otherMonthlyAmt = (app.income.otherIncomeMonthly && app.income.otherIncomeMonthly > 0)
    ? app.income.otherIncomeMonthly
    : 0;

  totalHouseholdIncome =
    fatherIncomeAmt +
    motherIncomeAmt +
    studentIncomeAmt +
    otherFamilyAmt +
    pensionsAmt +
    regularAidAmt +
    otherMonthlyAmt;

  const safeHouseholdSize = Math.max(1, app.householdSize || 1);
  const perCapitaIncome = Math.round((totalHouseholdIncome / safeHouseholdSize) * 100) / 100;

  // A. Component 1: Per-Capita Income (Weight: 55)
  let perCapitaScore = 0;
  const benchmark = Math.max(1, criteria.monthlyPerCapitaBenchmark);

  if (hasUnknownIncomeSources) {
    hasIncompleteDataWarning = true;
    perCapitaScore = 0;
    explanationArabic.push(
      `معيار دخل الفرد (0 / ${criteria.weights.perCapitaIncome}): توجد بيانات دخل غير مكتملة أو غير محددة؛ لا تُمنح نقاط الحاجة القصوى افتراضياً حتى استكمال المراجعة.`
    );
  } else if (perCapitaIncome >= benchmark) {
    perCapitaScore = 0;
    explanationArabic.push(
      `معيار دخل الفرد (0 / ${criteria.weights.perCapitaIncome}): دخل الفرد الشهري (${perCapitaIncome} ${criteria.currencyCode}) يتجاوز سقف الحاجة المعتمد (${benchmark} ${criteria.currencyCode}).`
    );
  } else {
    // Linear scale between 0 and benchmark
    // If perCapitaIncome is 0, full points
    const ratio = Math.max(0, Math.min(1, 1 - (perCapitaIncome / benchmark)));
    perCapitaScore = Math.round(criteria.weights.perCapitaIncome * ratio * 100) / 100;
    explanationArabic.push(
      `معيار دخل الفرد (${perCapitaScore} / ${criteria.weights.perCapitaIncome}): متوسط دخل الفرد (${perCapitaIncome} ${criteria.currencyCode}) لأسرة من ${safeHouseholdSize} أفراد، بإجمالي دخل متاح ${totalHouseholdIncome} ${criteria.currencyCode}.`
    );
  }

  // B. Component 2: Uncovered Tuition Fee Ratio (Weight: 20)
  let uncoveredTuitionScore = 0;
  const periodTuition = Math.max(0, app.periodTuitionFee || 0);
  const paid = Math.max(0, app.amountAlreadyPaid || 0);
  const support = Math.max(0, app.confirmedExternalSupport || 0);
  const uncoveredTuition = Math.max(0, periodTuition - paid - support);

  let uncoveredRatio = 0;
  if (periodTuition <= 0) {
    uncoveredTuitionScore = 0;
    explanationArabic.push(
      `معيار الرسوم الدراسية (0 / ${criteria.weights.uncoveredTuition}): لا توجد رسوم مستحقة معلنة للفترة الحالية.`
    );
  } else {
    uncoveredRatio = Math.max(0, Math.min(1, uncoveredTuition / periodTuition));
    uncoveredTuitionScore = Math.round(criteria.weights.uncoveredTuition * uncoveredRatio * 100) / 100;
    const uncoveredPercent = Math.round(uncoveredRatio * 100);
    explanationArabic.push(
      `معيار الرسوم الدراسية (${uncoveredTuitionScore} / ${criteria.weights.uncoveredTuition}): نسبة الرسوم غير المغطاة ${uncoveredPercent}% (متبقٍ ${uncoveredTuition} ${criteria.currencyCode} من إجمالي ${periodTuition} ${criteria.currencyCode}).`
    );
  }

  // C. Component 3: Eligible Essential Expenses Burden (Weight: 15)
  // Not deducted from income to prevent double-counting.
  let eligibleMonthlyExpenses = 0;
  if (app.housingStatus === 'rented' && app.monthlyRent && app.monthlyRent > 0) {
    eligibleMonthlyExpenses += app.monthlyRent;
  }
  if (app.recurringNecessaryMedicalExpenses && app.recurringNecessaryMedicalExpenses > 0) {
    eligibleMonthlyExpenses += app.recurringNecessaryMedicalExpenses;
  }
  if (app.necessaryCareObligations && app.necessaryCareObligations > 0) {
    eligibleMonthlyExpenses += app.necessaryCareObligations;
  }
  if (app.otherFamilyEducationExpenses && app.otherFamilyEducationExpenses > 0) {
    eligibleMonthlyExpenses += app.otherFamilyEducationExpenses;
  }
  if (app.basicTransportExpenses && app.basicTransportExpenses > 0) {
    eligibleMonthlyExpenses += app.basicTransportExpenses;
  }

  let expenseBurdenScore = 0;
  let expenseBurdenRatio = 0;

  if (totalHouseholdIncome === 0) {
    // Explicit rule for zero income
    if (eligibleMonthlyExpenses > 0) {
      expenseBurdenScore = criteria.weights.expenseBurden;
      expenseBurdenRatio = 1;
      explanationArabic.push(
        `معيار عبء المصاريف الأساسية (${expenseBurdenScore} / ${criteria.weights.expenseBurden}): انعدام الدخل مع وجود التزامات ضرورية مؤهلة بقيمة ${eligibleMonthlyExpenses} ${criteria.currencyCode}.`
      );
    } else {
      expenseBurdenScore = Math.round((criteria.weights.expenseBurden / 3) * 100) / 100;
      explanationArabic.push(
        `معيار عبء المصاريف الأساسية (${expenseBurdenScore} / ${criteria.weights.expenseBurden}): انعدام الدخل الشهري المعلن بدون التزامات إيجار أو رعاية مسجلة.`
      );
    }
  } else {
    expenseBurdenRatio = Math.min(1, eligibleMonthlyExpenses / totalHouseholdIncome);
    const cappedRatio = Math.min(1, expenseBurdenRatio / criteria.expenseBurdenCapRatio);
    expenseBurdenScore = Math.round(criteria.weights.expenseBurden * cappedRatio * 100) / 100;
    const burdenPercent = Math.round(expenseBurdenRatio * 100);
    explanationArabic.push(
      `معيار عبء المصاريف الأساسية (${expenseBurdenScore} / ${criteria.weights.expenseBurden}): تمثل المصاريف الضرورية المؤهلة (${eligibleMonthlyExpenses} ${criteria.currencyCode}) ما نسبته ${burdenPercent}% من إجمالي دخل الأسرة.`
    );
  }

  // D. Component 4: Breadwinner Vulnerability (Weight: 10)
  let breadwinnerScore = 0;
  const isFatherAbsentOrDeceased = ['deceased', 'unavailable'].includes(app.fatherStatus);
  const isMotherAbsentOrDeceased = ['deceased', 'unavailable'].includes(app.motherStatus);
  const isFatherUnemployed = app.fatherStatus === 'unemployed';
  const hasAlternativeSupport = app.alternativeSupportAvailable === 'yes';
  const hasPartialSupport = app.alternativeSupportAvailable === 'partial';
  const substantialPensions = pensionsAmt >= (benchmark * 0.7);

  if (isFatherAbsentOrDeceased && isMotherAbsentOrDeceased) {
    vulnerabilityFlags.push('غياب كلا الوالدين');
    if (!hasAlternativeSupport && !substantialPensions) {
      breadwinnerScore = 10;
    } else {
      breadwinnerScore = 6;
    }
  } else if (isFatherAbsentOrDeceased) {
    vulnerabilityFlags.push('وفاة أو غياب الأب');
    if (substantialPensions || hasAlternativeSupport) {
      // Deceased father does NOT automatically grant 10 points if substantial replacement income exists
      breadwinnerScore = 4;
      vulnerabilityFlags.push('يتوفر دعم بديل أو معاش تقاعدي');
    } else if (hasPartialSupport) {
      breadwinnerScore = 7;
    } else {
      breadwinnerScore = 10;
    }
  } else if (app.actualBreadwinner === 'student') {
    vulnerabilityFlags.push('الطالب هو المعيل الفعلي للأسرة');
    breadwinnerScore = Math.max(breadwinnerScore, 8);
  } else if (isFatherUnemployed && (!app.income.motherIncome || app.motherStatus !== 'working')) {
    vulnerabilityFlags.push('تعطل رب الأسرة عن العمل وعدم وجود دخل ثابت');
    breadwinnerScore = Math.max(breadwinnerScore, 6);
  } else if (app.recentBreadwinnerLoss) {
    vulnerabilityFlags.push('فقدان حديث لمصدر الإعالة');
    breadwinnerScore = Math.max(breadwinnerScore, 5);
  } else {
    breadwinnerScore = 0;
  }

  // Cap at weight maximum
  breadwinnerScore = Math.min(criteria.weights.breadwinnerVulnerability, breadwinnerScore);

  if (breadwinnerScore > 0) {
    explanationArabic.push(
      `معيار هشاشة مصدر الإعالة (${breadwinnerScore} / ${criteria.weights.breadwinnerVulnerability}): ${vulnerabilityFlags.join('، ')}.`
    );
  } else {
    explanationArabic.push(
      `معيار هشاشة مصدر الإعالة (0 / ${criteria.weights.breadwinnerVulnerability}): وجود معيل مستقر أو عدم تسجيل ظروف هشاشة استثنائية.`
    );
  }

  // Total Score (0 - 100)
  const total = Math.round(
    (perCapitaScore + uncoveredTuitionScore + expenseBurdenScore + breadwinnerScore) * 100
  ) / 100;

  return {
    total,
    perCapitaScore,
    uncoveredTuitionScore,
    expenseBurdenScore,
    breadwinnerVulnerabilityScore: breadwinnerScore,
    criteriaVersion: criteria.version,
    calculatedValues: {
      totalHouseholdIncome,
      householdSize: safeHouseholdSize,
      perCapitaIncome,
      monthlyBenchmark: benchmark,
      periodTuition,
      uncoveredTuition,
      uncoveredRatio,
      eligibleMonthlyExpenses,
      expenseBurdenRatio,
      vulnerabilityFlags,
      hasIncompleteDataWarning
    },
    explanationArabic
  };
}
