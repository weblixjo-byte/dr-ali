import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';
import {
  getCriteriaCollection,
  getApplicationsCollection,
  getAuditLogsCollection,
  ensureDatabaseIndexes
} from '@/lib/db';
import { updateCriteriaSchema } from '@/lib/validation';
import { calculateApplicationScore, DEFAULT_CRITERIA } from '@/lib/scoring';
import { ScoringCriteria } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح لك بالوصول.' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const validation = updateCriteriaSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'بيانات المعايير غير صالحة.' },
        { status: 400 }
      );
    }

    const {
      reasonForVersion,
      weights,
      monthlyPerCapitaBenchmark,
      currencyCode,
      expenseBurdenCapRatio,
    } = validation.data;

    // Check that total weights sum to 100
    const totalWeights =
      weights.perCapitaIncome +
      weights.uncoveredTuition +
      weights.expenseBurden +
      weights.breadwinnerVulnerability;

    if (Math.abs(totalWeights - 100) > 0.01) {
      return NextResponse.json(
        { error: `مجموع أوزان المعايير يجب أن يساوي 100 نقطة بالضبط (المجموع الحالي: ${totalWeights}).` },
        { status: 400 }
      );
    }

    await ensureDatabaseIndexes();
    const criteriaCol = await getCriteriaCollection();
    const appsCol = await getApplicationsCollection();

    // Get current latest version
    const latest = (await criteriaCol.find().sort({ version: -1 }).limit(1).toArray())[0] || DEFAULT_CRITERIA;
    const newVersion = (latest.version || 1) + 1;
    const now = new Date();

    const newCriteria: ScoringCriteria = {
      version: newVersion,
      approvedAt: now.toISOString(),
      approvedBy: session.username,
      reasonForVersion,
      maxScore: 100,
      weights,
      monthlyPerCapitaBenchmark,
      currencyCode,
      expenseBurdenCapRatio,
    };

    await criteriaCol.insertOne(newCriteria as any);

    // Re-evaluate existing active applications that are not finalized/accepted
    // Rule: "بعد اعتماد النتائج، لا يغير طلب جديد أو تعديل ترتيب المستفيدين المعتمدين تلقائيًا"
    const applicationsToReevaluate = await appsCol
      .find({ status: { $ne: 'accepted' } })
      .toArray();

    let reevaluatedCount = 0;
    for (const app of applicationsToReevaluate) {
      const newScore = calculateApplicationScore(app, newCriteria);
      let newVerifiedScore = undefined;
      if (app.verifiedScore) {
        newVerifiedScore = calculateApplicationScore(app, newCriteria);
      }

      await appsCol.updateOne(
        { _id: app._id },
        {
          $set: {
            score: newScore,
            ...(newVerifiedScore ? { verifiedScore: newVerifiedScore } : {}),
            updatedAt: now,
          },
        }
      );
      reevaluatedCount++;
    }

    // Audit Log
    const auditCol = await getAuditLogsCollection();
    await auditCol.insertOne({
      actor: session.username,
      action: 'UPDATE_SCORING_CRITERIA',
      targetType: 'criteria',
      details: {
        newVersion,
        reasonForVersion,
        weights,
        monthlyPerCapitaBenchmark,
        reevaluatedCount,
      },
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      message: `تم اعتماد النسخة رقم ${newVersion} من المعايير وإعادة احتساب درجات ${reevaluatedCount} طلب بنجاح.`,
      newVersion,
    });
  } catch (error) {
    console.error('Error updating scoring criteria:', error);
    return NextResponse.json({ error: 'تعذر حفظ المعايير الجديدة.' }, { status: 500 });
  }
}
