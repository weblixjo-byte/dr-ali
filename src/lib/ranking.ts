import { ApplicationDocument } from '@/types';

export interface RankedApplication {
  rank: number;
  application: ApplicationDocument;
  isTied: boolean;
  tieReason?: string;
  isRank6TieCritical?: boolean; // Critical tie at the cutoff of 6 beneficiaries
}

export interface RankingResult {
  rankedList: RankedApplication[];
  totalEligible: number;
  criticalTieAtCutoff: boolean;
  top6Candidates: RankedApplication[];
}

/**
 * Compare two applications deterministically using declared committee tie-breakers:
 * 1. Primary: Higher total score (descending)
 * 2. 1st Tie-breaker: Lower per-capita monthly income (ascending)
 * 3. 2nd Tie-breaker: Higher uncovered tuition amount (descending)
 * 4. 3rd Tie-breaker: Higher household size (descending)
 * Note: Submission timestamp or ID is NOT a merit tie-breaker.
 */
export function compareApplicationsForRanking(
  a: ApplicationDocument,
  b: ApplicationDocument
): { diff: number; isSubstantiveTie: boolean } {
  // 1. Total score
  const scoreA = a.verifiedScore?.total ?? a.score.total;
  const scoreB = b.verifiedScore?.total ?? b.score.total;
  if (Math.abs(scoreA - scoreB) > 0.01) {
    return { diff: scoreB - scoreA, isSubstantiveTie: false };
  }

  // 2. Per-capita income (lower income = higher need)
  const pcA = a.verifiedScore?.calculatedValues.perCapitaIncome ?? a.score.calculatedValues.perCapitaIncome;
  const pcB = b.verifiedScore?.calculatedValues.perCapitaIncome ?? b.score.calculatedValues.perCapitaIncome;
  if (Math.abs(pcA - pcB) > 1) {
    return { diff: pcA - pcB, isSubstantiveTie: false };
  }

  // 3. Uncovered tuition amount (higher uncovered tuition = higher need)
  const uncA = a.uncoveredTuitionAmount || 0;
  const uncB = b.uncoveredTuitionAmount || 0;
  if (Math.abs(uncA - uncB) > 1) {
    return { diff: uncB - uncA, isSubstantiveTie: false };
  }

  // 4. Household size (higher size = higher need)
  const hhA = a.householdSize || 1;
  const hhB = b.householdSize || 1;
  if (hhA !== hhB) {
    return { diff: hhB - hhA, isSubstantiveTie: false };
  }

  // All substantive economic criteria are identical -> true substantive tie!
  return { diff: 0, isSubstantiveTie: true };
}

export function rankApplications(applications: ApplicationDocument[]): RankingResult {
  // Sort applications with deterministic tie-breaking
  const sorted = [...applications].sort((a, b) => {
    const { diff, isSubstantiveTie } = compareApplicationsForRanking(a, b);
    if (!isSubstantiveTie && diff !== 0) {
      return diff;
    }
    // Stable presentation order by referenceNumber (strictly for display, not merit)
    return a.referenceNumber.localeCompare(b.referenceNumber);
  });

  const rankedList: RankedApplication[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const prev = i > 0 ? sorted[i - 1] : null;
    const next = i < sorted.length - 1 ? sorted[i + 1] : null;

    const tiedWithPrev = prev ? compareApplicationsForRanking(current, prev).isSubstantiveTie : false;
    const tiedWithNext = next ? compareApplicationsForRanking(current, next).isSubstantiveTie : false;
    const isTied = tiedWithPrev || tiedWithNext;

    if (i > 0 && !tiedWithPrev) {
      currentRank = i + 1;
    }

    rankedList.push({
      rank: currentRank,
      application: current,
      isTied,
      tieReason: isTied ? 'تطابق في الدرجة الكلية ومعايير المفاضلة الاقتصادية المعلنة' : undefined,
      isRank6TieCritical: false
    });
  }

  // Check critical cutoff at 6 beneficiaries
  let criticalTieAtCutoff = false;
  if (rankedList.length >= 6) {
    const candidateAt6 = rankedList[5];
    const candidateAt7 = rankedList.length > 6 ? rankedList[6] : null;

    if (candidateAt7 && candidateAt6.rank === candidateAt7.rank) {
      criticalTieAtCutoff = true;
      // Mark candidates around cutoff
      for (const item of rankedList) {
        if (item.rank === candidateAt6.rank) {
          item.isRank6TieCritical = true;
        }
      }
    }
  }

  const top6Candidates = rankedList.slice(0, 6);

  return {
    rankedList,
    totalEligible: rankedList.length,
    criticalTieAtCutoff,
    top6Candidates
  };
}
