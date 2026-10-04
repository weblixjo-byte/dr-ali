import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';
import {
  getApplicationsCollection,
  getCorrectionsCollection,
  getAuditLogsCollection,
  getCriteriaCollection,
  ensureDatabaseIndexes
} from '@/lib/db';
import { adminCorrectionSchema } from '@/lib/validation';
import { calculateApplicationScore, DEFAULT_CRITERIA } from '@/lib/scoring';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح لك بالوصول.' }, { status: 401 });
  }

  try {
    await ensureDatabaseIndexes();
    const { id } = await context.params;
    const appsCol = await getApplicationsCollection();

    let query: Record<string, unknown> = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { referenceNumber: id };
    }

    const app = await appsCol.findOne(query);
    if (!app) {
      return NextResponse.json({ error: 'الطلب غير موجود.' }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    const validation = adminCorrectionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'بيانات التصحيح غير صالحة.' },
        { status: 400 }
      );
    }

    const { fieldName, newValue, reason } = validation.data;
    // Get previous value safely
    const previousValue = (app as unknown as Record<string, unknown>)[fieldName];

    // Record the correction in `corrections` collection
    const correctionsCol = await getCorrectionsCollection();
    const now = new Date();

    await correctionsCol.insertOne({
      applicationId: app._id!,
      referenceNumber: app.referenceNumber,
      fieldName,
      previousValue,
      newValue,
      reason,
      correctedBy: session.username,
      createdAt: now,
    });

    // Apply the correction to the application document
    const updatedAppData = {
      ...app,
      [fieldName]: newValue,
      updatedAt: now,
    };

    // Recalculate verified score if relevant field changed
    const criteriaCol = await getCriteriaCollection();
    const activeCriteria = (await criteriaCol.findOne({})) || DEFAULT_CRITERIA;
    const newVerifiedScore = calculateApplicationScore(updatedAppData, activeCriteria);

    updatedAppData.verifiedScore = newVerifiedScore;

    await appsCol.updateOne(
      { _id: app._id },
      {
        $set: {
          [fieldName]: newValue,
          verifiedScore: newVerifiedScore,
          updatedAt: now,
        },
      }
    );

    // Audit log
    const auditCol = await getAuditLogsCollection();
    await auditCol.insertOne({
      actor: session.username,
      action: 'CORRECT_APPLICATION_DATA',
      targetType: 'application',
      targetId: app.referenceNumber,
      details: {
        fieldName,
        previousValue,
        newValue,
        reason,
        newVerifiedScoreTotal: newVerifiedScore.total,
      },
      createdAt: now,
    });

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل التصحيح وتحديث درجة التحقق بنجاح.',
      verifiedScore: newVerifiedScore,
    });
  } catch (error) {
    console.error('Error applying correction:', error);
    return NextResponse.json({ error: 'تعذر حفظ تصحيح البيانات.' }, { status: 500 });
  }
}
