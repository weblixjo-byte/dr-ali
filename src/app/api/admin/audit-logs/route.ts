import { NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { getAuditLogsCollection, ensureDatabaseIndexes } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح لك بالوصول.' }, { status: 401 });
  }

  try {
    await ensureDatabaseIndexes();
    const auditCol = await getAuditLogsCollection();

    const logs = await auditCol.find({}).sort({ createdAt: -1 }).limit(100).toArray();

    return NextResponse.json(
      { logs },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'تعذر جلب سجل التدقيق.' }, { status: 500 });
  }
}
