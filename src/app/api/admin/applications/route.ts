import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';
import { getApplicationsCollection, ensureDatabaseIndexes } from '@/lib/db';
import { rankApplications } from '@/lib/ranking';
import { Filter } from 'mongodb';
import { ApplicationDocument } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.' }, { status: 401 });
  }

  try {
    await ensureDatabaseIndexes();
    const appsCol = await getApplicationsCollection();

    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || '';
    const verificationStatus = searchParams.get('verificationStatus')?.trim() || '';
    const listMode = searchParams.get('mode') || 'all'; // 'all' | 'merit_declared' | 'merit_verified'

    // KPI Counters
    const [
      totalCount,
      newCount,
      inReviewCount,
      needsCompletionCount,
      verifiedEligibleCount,
      acceptedCount,
      waitlistCount,
    ] = await Promise.all([
      appsCol.countDocuments(),
      appsCol.countDocuments({ status: 'new' }),
      appsCol.countDocuments({ status: 'in_review' }),
      appsCol.countDocuments({ status: 'needs_completion' }),
      appsCol.countDocuments({ status: 'verified_eligible' }),
      appsCol.countDocuments({ status: 'accepted' }),
      appsCol.countDocuments({ status: 'waitlist' }),
    ]);

    // If requested Merit Comparison Lists
    if (listMode === 'merit_declared' || listMode === 'merit_verified') {
      const filter: Filter<ApplicationDocument> =
        listMode === 'merit_verified'
          ? { status: { $in: ['verified_eligible', 'accepted', 'waitlist'] } }
          : { status: { $nin: ['ineligible', 'withdrawn', 'needs_completion'] } };

      const allEligible = await appsCol.find(filter).toArray();
      const ranking = rankApplications(allEligible);

      return NextResponse.json(
        {
          ranking,
          kpis: {
            totalCount,
            newCount,
            inReviewCount,
            needsCompletionCount,
            verifiedEligibleCount,
            acceptedCount,
            waitlistCount,
          },
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
          },
        }
      );
    }

    // Standard paginated table filter
    const query: Filter<ApplicationDocument> = {};

    if (status) {
      query.status = status as ApplicationDocument['status'];
    }

    if (verificationStatus) {
      query.verificationStatus = verificationStatus as ApplicationDocument['verificationStatus'];
    }

    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { institutionName: { $regex: search, $options: 'i' } },
        { major: { $regex: search, $options: 'i' } },
      ];
    }

    const totalFiltered = await appsCol.countDocuments(query);
    const skip = (page - 1) * limit;

    const applications = await appsCol
      .find(query)
      .sort({ 'score.total': -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        applications,
        pagination: {
          page,
          limit,
          total: totalFiltered,
          totalPages: Math.ceil(totalFiltered / limit) || 1,
        },
        kpis: {
          totalCount,
          newCount,
          inReviewCount,
          needsCompletionCount,
          verifiedEligibleCount,
          acceptedCount,
          waitlistCount,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching admin applications:', error);
    return NextResponse.json({ error: 'تعذر جلب بيانات الطلبات من قاعدة البيانات.' }, { status: 500 });
  }
}
