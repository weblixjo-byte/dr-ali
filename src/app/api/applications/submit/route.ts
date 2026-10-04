import { NextRequest, NextResponse } from 'next/server';
import {
  getApplicationsCollection,
  getSettingsCollection,
  getCriteriaCollection,
  ensureDatabaseIndexes
} from '@/lib/db';
import { publicApplicationSubmissionSchema } from '@/lib/validation';
import { calculateApplicationScore, DEFAULT_CRITERIA } from '@/lib/scoring';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateReferenceNumber } from '@/lib/security';
import { ApplicationDocument } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rate = checkRateLimit(ip, 15, 10 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز الحد الأقصى للمحاولات مؤقتاً. يرجى الانتظار والمحاولة لاحقاً.' },
        { status: 429 }
      );
    }

    // 2. Parse Body safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'البيانات المرسلة غير صالحة.' }, { status: 400 });
    }

    // 3. Honeypot Bot Detection
    if (body.website_url_hp && body.website_url_hp.length > 0) {
      // Silently reject bots without revealing
      return NextResponse.json(
        { success: true, referenceNumber: 'APP-BOT-DISCARDED' },
        { status: 200 }
      );
    }

    // 4. Anti-speed Bot Check (form must take >= 4 seconds to fill)
    if (body.submissionTimestamp && typeof body.submissionTimestamp === 'number') {
      const elapsed = Date.now() - body.submissionTimestamp;
      if (elapsed < 3500) {
        return NextResponse.json(
          { error: 'يرجى مراجعة وتعبئة البيانات بعناية قبل الضغط على زر الإرسال.' },
          { status: 400 }
        );
      }
    }

    // 5. Schema Validation
    const validation = publicApplicationSubmissionSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'البيانات المدخلة غير مكتملة أو غير صالحة.';
      return NextResponse.json({ error: firstError, details: validation.error.issues }, { status: 400 });
    }

    const validData = validation.data;

    // 6. Ensure DB Indexes & check Initiative Status
    await ensureDatabaseIndexes();
    const settingsCol = await getSettingsCollection();
    const settings = await settingsCol.findOne({ key: 'initiative_config' });

    if (settings && !settings.isSubmissionOpen) {
      return NextResponse.json(
        { error: 'التقديم مغلق حالياً أو انتهت فترة استقبال الطلبات المعتمدة للمبادرة.' },
        { status: 403 }
      );
    }

    // 7. Idempotency Check (prevent duplicate on double-click / network retry)
    const appsCol = await getApplicationsCollection();
    const existing = await appsCol.findOne({ idempotencyKey: validData.idempotencyKey });
    if (existing) {
      return NextResponse.json({
        success: true,
        referenceNumber: existing.referenceNumber,
        createdAt: existing.createdAt,
        message: 'تم استلام طلبك مسبقاً وهو قيد المراجعة.',
      });
    }

    // 8. Fetch Active Scoring Criteria
    const criteriaCol = await getCriteriaCollection();
    const activeCriteria = (await criteriaCol.findOne({})) || DEFAULT_CRITERIA;

    // 9. Compute derived uncovered amount accurately
    const uncoveredTuitionAmount = Math.max(
      0,
      validData.periodTuitionFee - validData.amountAlreadyPaid - validData.confirmedExternalSupport
    );

    // 10. Calculate Deterministic Score
    const score = calculateApplicationScore(
      {
        ...validData,
        uncoveredTuitionAmount,
      },
      activeCriteria
    );

    // 11. Prepare Database Document
    const referenceNumber = generateReferenceNumber();
    const now = new Date();

    const applicationDoc: ApplicationDocument = {
      referenceNumber,
      cycleId: '2026-FALL',
      idempotencyKey: validData.idempotencyKey,

      // 1. Personal & Contact
      fullName: validData.fullName,
      phoneCountryCode: validData.phoneCountryCode,
      phoneNumber: validData.phoneNumber,
      email: validData.email || undefined,
      governorateOrCity: validData.governorateOrCity,
      preferredContactMethod: validData.preferredContactMethod,

      // 2. Study
      institutionName: validData.institutionName,
      studyLevel: validData.studyLevel,
      major: validData.major,
      academicYearOrSemester: validData.academicYearOrSemester,
      enrollmentStatus: validData.enrollmentStatus,
      periodTuitionFee: validData.periodTuitionFee,
      amountAlreadyPaid: validData.amountAlreadyPaid,
      confirmedExternalSupport: validData.confirmedExternalSupport,
      uncoveredTuitionAmount,
      isPaymentDeadlineNear: validData.isPaymentDeadlineNear,
      atRiskOfSuspension: validData.atRiskOfSuspension,
      otherScholarshipsOrDiscounts: validData.otherScholarshipsOrDiscounts,
      educationNotes: validData.educationNotes,

      // 3. Family
      householdSize: validData.householdSize,
      dependentsCount: validData.dependentsCount,
      earnersCount: validData.earnersCount,
      otherStudyingFamilyMembersCount: validData.otherStudyingFamilyMembersCount,
      actualBreadwinner: validData.actualBreadwinner,
      fatherStatus: validData.fatherStatus,
      motherStatus: validData.motherStatus,
      alternativeSupportAvailable: validData.alternativeSupportAvailable,
      recentBreadwinnerLoss: validData.recentBreadwinnerLoss,
      recentBreadwinnerLossDate: validData.recentBreadwinnerLossDate,
      recentBreadwinnerLossImpact: validData.recentBreadwinnerLossImpact,
      familyNotes: validData.familyNotes,

      // 4. Income
      income: validData.income,
      hasSeasonalIncome: validData.hasSeasonalIncome,
      seasonalIncomeCalculationMethod: validData.seasonalIncomeCalculationMethod,

      // 5. Expenses
      housingStatus: validData.housingStatus,
      monthlyRent: validData.monthlyRent,
      recurringNecessaryMedicalExpenses: validData.recurringNecessaryMedicalExpenses,
      necessaryCareObligations: validData.necessaryCareObligations,
      otherFamilyEducationExpenses: validData.otherFamilyEducationExpenses,
      basicTransportExpenses: validData.basicTransportExpenses,
      otherObligations: validData.otherObligations,

      // 6. Circumstances
      recentJobLossOrIncomeDrop: validData.recentJobLossOrIncomeDrop,
      recentJobLossDetails: validData.recentJobLossDetails,
      deathOrAbsenceOfBreadwinnerImpact: validData.deathOrAbsenceOfBreadwinnerImpact,
      deathOrAbsenceImpactDetails: validData.deathOrAbsenceImpactDetails,
      healthOrCaregivingBurdenImpact: validData.healthOrCaregivingBurdenImpact,
      healthOrCaregivingDetails: validData.healthOrCaregivingDetails,
      additionalContext: validData.additionalContext,

      // 7. Declarations
      infoAccuracyAcknowledged: validData.infoAccuracyAcknowledged,
      dataUseAcknowledged: validData.dataUseAcknowledged,
      willingToProvideDocsAcknowledged: validData.willingToProvideDocsAcknowledged,
      noGuaranteeAcknowledged: validData.noGuaranteeAcknowledged,

      // 8. Workflow status
      status: score.calculatedValues.hasIncompleteDataWarning ? 'needs_completion' : 'new',
      verificationStatus: 'unverified',
      eligibilityStatus: 'pending',
      decisionStatus: 'pending',

      score,

      verificationChecklist: {
        tuitionFeeChecked: { verified: false },
        familyIncomeChecked: { verified: false },
        householdSizeChecked: { verified: false },
        breadwinnerStatusChecked: { verified: false },
        expensesChecked: { verified: false },
      },

      createdAt: now,
      updatedAt: now,
    };

    const insertResult = await appsCol.insertOne(applicationDoc as any);
    if (!insertResult.acknowledged) {
      return NextResponse.json(
        { error: 'حدث خطأ أثناء حفظ الطلب في قاعدة البيانات. يرجى إعادة المحاولة.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceNumber,
      createdAt: now,
      message: 'تم استلام طلبك بنجاح وحفظه في سجلات المبادرة.',
    });
  } catch (error) {
    // Note: Do NOT log sensitive PII or applicant financial data to stdout
    console.error('Error during application submission:', (error as Error).message);
    return NextResponse.json(
      {
        error:
          'تعذر حفظ الطلب نتيجة عطل مؤقت في الاتصال بقاعدة البيانات. لم يتم تسجيل بياناتك؛ يرجى إعادة المحاولة لاحقاً.',
      },
      { status: 500 }
    );
  }
}
