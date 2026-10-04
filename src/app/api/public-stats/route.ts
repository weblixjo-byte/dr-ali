import { NextResponse } from 'next/server';
import { getSettingsCollection, ensureDatabaseIndexes } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureDatabaseIndexes();
    const settingsCol = await getSettingsCollection();
    const settings = await settingsCol.findOne({ key: 'initiative_config' });

    return NextResponse.json(
      {
        isSubmissionOpen: settings ? settings.isSubmissionOpen : true,
        submissionStartDate: settings?.submissionStartDate || '',
        submissionEndDate: settings?.submissionEndDate || '',
        resultsAnnouncementDate: settings?.resultsAnnouncementDate || '',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching public stats:', (error as Error).message);
    return NextResponse.json(
      {
        isSubmissionOpen: true,
        submissionStartDate: '',
        submissionEndDate: '',
        resultsAnnouncementDate: '',
      },
      { status: 200 }
    );
  }
}
