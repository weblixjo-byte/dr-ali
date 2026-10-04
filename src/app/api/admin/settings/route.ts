import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';
import {
  getSettingsCollection,
  getCriteriaCollection,
  getAuditLogsCollection,
  ensureDatabaseIndexes
} from '@/lib/db';
import { updateInitiativeSettingsSchema } from '@/lib/validation';
import { DEFAULT_CRITERIA } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح لك بالوصول.' }, { status: 401 });
  }

  try {
    await ensureDatabaseIndexes();
    const [settingsCol, criteriaCol] = await Promise.all([
      getSettingsCollection(),
      getCriteriaCollection(),
    ]);

    const settings = await settingsCol.findOne({ key: 'initiative_config' });
    const criteria = (await criteriaCol.findOne({})) || DEFAULT_CRITERIA;

    return NextResponse.json({ settings, criteria });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'تعذر جلب إعدادات المبادرة.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح لك بالوصول.' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const validation = updateInitiativeSettingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'بيانات الإعدادات غير صالحة.' },
        { status: 400 }
      );
    }

    await ensureDatabaseIndexes();
    const settingsCol = await getSettingsCollection();
    const now = new Date();

    await settingsCol.updateOne(
      { key: 'initiative_config' },
      {
        $set: {
          ...validation.data,
          targetBeneficiariesCount: 6, // Immutable rule: target is always 6
          updatedAt: now,
          updatedBy: session.username,
        },
      },
      { upsert: true }
    );

    const auditCol = await getAuditLogsCollection();
    await auditCol.insertOne({
      actor: session.username,
      action: 'UPDATE_INITIATIVE_SETTINGS',
      targetType: 'settings',
      details: validation.data,
      createdAt: now,
    });

    return NextResponse.json({ success: true, message: 'تم حفظ إعدادات المبادرة بنجاح.' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'تعذر حفظ الإعدادات.' }, { status: 500 });
  }
}
