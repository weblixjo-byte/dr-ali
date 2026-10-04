import { NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { getApplicationsCollection, ensureDatabaseIndexes } from '@/lib/db';
import { generateApplicationsCsv } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح لك بالوصول.' }, { status: 401 });
  }

  try {
    await ensureDatabaseIndexes();
    const appsCol = await getApplicationsCollection();

    const applications = await appsCol
      .find({})
      .sort({ 'score.total': -1, createdAt: -1 })
      .toArray();

    const csvContent = generateApplicationsCsv(applications);
    const filename = `scholarship_applications_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    });
  } catch (error) {
    console.error('Error exporting applications to CSV:', error);
    return NextResponse.json({ error: 'تعذر تصدير البيانات إلى CSV.' }, { status: 500 });
  }
}
