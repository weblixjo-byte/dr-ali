import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';
import {
  getApplicationsCollection,
  getAuditLogsCollection,
  getCorrectionsCollection,
  ensureDatabaseIndexes
} from '@/lib/db';
import { adminStatusUpdateSchema } from '@/lib/validation';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
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

    const application = await appsCol.findOne(query);
    if (!application) {
      return NextResponse.json({ error: 'الطلب غير موجود.' }, { status: 404 });
    }

    // Fetch related corrections and audit logs
    const [correctionsCol, auditCol] = await Promise.all([
      getCorrectionsCollection(),
      getAuditLogsCollection(),
    ]);

    const [corrections, auditLogs] = await Promise.all([
      correctionsCol.find({ applicationId: application._id }).sort({ createdAt: -1 }).toArray(),
      auditCol.find({ targetId: application.referenceNumber }).sort({ createdAt: -1 }).toArray(),
    ]);

    return NextResponse.json({
      application,
      corrections,
      auditLogs,
    });
  } catch (error) {
    console.error('Error fetching application detail:', error);
    return NextResponse.json({ error: 'تعذر جلب تفاصيل الطلب.' }, { status: 500 });
  }
}

export async function PATCH(
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

    const existingApp = await appsCol.findOne(query);
    if (!existingApp) {
      return NextResponse.json({ error: 'الطلب غير موجود.' }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'البيانات المرسلة غير صالحة.' }, { status: 400 });
    }

    const validation = adminStatusUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'بيانات التحديث غير صالحة.' },
        { status: 400 }
      );
    }

    const {
      status,
      verificationStatus,
      eligibilityStatus,
      decisionStatus,
      reviewerNotes,
      skippedReason,
      manualTieBreakNotes,
    } = validation.data;

    // Strict Quota Rule Enforcement: Target is 6 beneficiaries. Max 6 accepted.
    if (status === 'accepted' && existingApp.status !== 'accepted') {
      const currentAcceptedCount = await appsCol.countDocuments({
        status: 'accepted',
        _id: { $ne: existingApp._id },
      });

      if (currentAcceptedCount >= 6) {
        return NextResponse.json(
          {
            error:
              'لا يمكن قبول أكثر من 6 مستفيدين في المبادرة وفق اللائحة المعتمدة. تم الوصول للحد الأقصى للمقاعد المتاحة (6/6).',
          },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updateFields: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    if (verificationStatus) updateFields.verificationStatus = verificationStatus;
    if (eligibilityStatus) updateFields.eligibilityStatus = eligibilityStatus;
    if (decisionStatus) updateFields.decisionStatus = decisionStatus;
    if (reviewerNotes !== undefined) updateFields.reviewerNotes = reviewerNotes;
    if (skippedReason !== undefined) updateFields.skippedReason = skippedReason;
    if (manualTieBreakNotes !== undefined) updateFields.manualTieBreakNotes = manualTieBreakNotes;

    // Support updating verification checklist
    if (body.verificationChecklist && typeof body.verificationChecklist === 'object') {
      updateFields.verificationChecklist = {
        ...existingApp.verificationChecklist,
        ...body.verificationChecklist,
      };
    }

    const updateResult = await appsCol.updateOne({ _id: existingApp._id }, { $set: updateFields });

    if (!updateResult.acknowledged) {
      return NextResponse.json({ error: 'فشل حفظ التحديث في قاعدة البيانات.' }, { status: 500 });
    }

    // Audit Log
    const auditCol = await getAuditLogsCollection();
    await auditCol.insertOne({
      actor: session.username,
      action: 'UPDATE_APPLICATION_STATUS',
      targetType: 'application',
      targetId: existingApp.referenceNumber,
      details: {
        previousStatus: existingApp.status,
        newStatus: status,
        verificationStatus,
        skippedReason: skippedReason || null,
        manualTieBreakNotes: manualTieBreakNotes || null,
      },
      createdAt: new Date(),
    });

    const updatedApp = await appsCol.findOne({ _id: existingApp._id });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطلب وسجل التدقيق بنجاح.',
      application: updatedApp,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة التحديث.' }, { status: 500 });
  }
}
