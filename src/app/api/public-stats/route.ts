import { NextResponse } from 'next/server';
import {
  getApplicationsCollection,
  getSettingsCollection,
  getCriteriaCollection,
  ensureDatabaseIndexes
} from '@/lib/db';
import { DEFAULT_CRITERIA } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureDatabaseIndexes();

    const [appsCol, settingsCol, criteriaCol] = await Promise.all([
      getApplicationsCollection(),
      getSettingsCollection(),
      getCriteriaCollection(),
    ]);

    const [totalReceived, reviewedCount, acceptedCount, settings, activeCriteria] = await Promise.all([
      appsCol.countDocuments(),
      appsCol.countDocuments({ status: { $ne: 'new' } }),
      appsCol.countDocuments({ status: 'accepted' }),
      settingsCol.findOne({ key: 'initiative_config' }),
      criteriaCol.findOne({}) || DEFAULT_CRITERIA,
    ]);

    // Calculate total approved support if any accepted candidates
    let totalApprovedSupport = 0;
    if (acceptedCount > 0) {
      const acceptedDocs = await appsCol
        .find({ status: 'accepted' }, { projection: { uncoveredTuitionAmount: 1 } })
        .toArray();
      totalApprovedSupport = acceptedDocs.reduce((acc, curr) => acc + (curr.uncoveredTuitionAmount || 0), 0);
    }

    const isSubmissionOpen = settings ? settings.isSubmissionOpen : true;
    const isResultsFinalized = acceptedCount >= 6 || (!isSubmissionOpen && acceptedCount > 0);

    return NextResponse.json(
      {
        totalReceived,
        reviewedCount,
        availableScholarships: 6,
        isSubmissionOpen,
        submissionStartDate: settings?.submissionStartDate || '2026-02-01',
        submissionEndDate: settings?.submissionEndDate || '2026-03-31',
        resultsAnnouncementDate: settings?.resultsAnnouncementDate || '2026-04-15',
        criteriaVersion: activeCriteria?.version || 1,
        criteriaApprovedAt: activeCriteria?.approvedAt || '2026-01-15',
        currencyCode: activeCriteria?.currencyCode || 'ر.س',
        isResultsFinalized,
        approvedBeneficiariesCount: acceptedCount,
        totalApprovedSupport: isResultsFinalized ? totalApprovedSupport : null,
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
        totalReceived: 0,
        reviewedCount: 0,
        availableScholarships: 6,
        isSubmissionOpen: false,
        criteriaVersion: 1,
        criteriaApprovedAt: '2026-01-15',
        currencyCode: 'ر.س',
        isResultsFinalized: false,
        approvedBeneficiariesCount: 0,
        totalApprovedSupport: null,
      },
      { status: 200 }
    );
  }
}
