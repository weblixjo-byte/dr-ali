import { ObjectId } from 'mongodb';

export type EmploymentStatus =
  | 'working'
  | 'unemployed'
  | 'retired'
  | 'deceased'
  | 'unavailable'
  | 'not_applicable'
  | 'other';

export type IncomeFrequency = 'fixed' | 'variable' | 'seasonal';

export type HousingStatus = 'owned' | 'rented' | 'living_with_relatives' | 'other';

export type PreferredContact = 'phone' | 'whatsapp' | 'email';

export type EnrollmentStatus = 'enrolled' | 'accepted' | 'paused';

export type ScholarshipCoverage = 'none' | 'partial' | 'full';

export type ActualBreadwinner =
  | 'father'
  | 'mother'
  | 'student'
  | 'brother_sister'
  | 'relative'
  | 'none_shared';

export type ApplicationWorkflowStatus =
  | 'new'
  | 'in_review'
  | 'needs_completion'
  | 'verified_eligible'
  | 'ineligible'
  | 'waitlist'
  | 'accepted'
  | 'withdrawn';

export type VerificationState =
  | 'unverified'
  | 'partially_verified'
  | 'fully_verified'
  | 'rejected_documents';

export type EligibilityState = 'eligible' | 'ineligible' | 'pending';

export type DecisionState = 'pending' | 'accepted' | 'waitlist' | 'rejected';

export interface IncomeItem {
  amount: number | null; // null represents N/A or unknown, not 0
  frequency?: IncomeFrequency;
  isNetAvailable?: boolean;
  notes?: string;
  isUnknown?: boolean;
}

export interface IncomeBreakdown {
  fatherIncome: IncomeItem | null;
  motherIncome: IncomeItem | null;
  studentIncome: IncomeItem | null;
  otherFamilyContributions: IncomeItem | null;
  pensions: IncomeItem | null;
  regularCashAid: IncomeItem | null;
  irregularAidNotes?: string;
  irregularAidAnnualEstimate?: number | null;
  otherIncomeNotes?: string;
  otherIncomeMonthly?: number | null;
}

export interface ExpenseObligation {
  type: string;
  monthlyAmount: number;
  explanation: string;
}

export interface VerificationChecklistItem {
  verified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface ScoreBreakdown {
  total: number;
  perCapitaScore: number;
  uncoveredTuitionScore: number;
  expenseBurdenScore: number;
  breadwinnerVulnerabilityScore: number;
  criteriaVersion: number;
  calculatedValues: {
    totalHouseholdIncome: number;
    householdSize: number;
    perCapitaIncome: number;
    monthlyBenchmark: number;
    periodTuition: number;
    uncoveredTuition: number;
    uncoveredRatio: number;
    eligibleMonthlyExpenses: number;
    expenseBurdenRatio: number;
    vulnerabilityFlags: string[];
    hasIncompleteDataWarning: boolean;
  };
  explanationArabic: string[];
}

export interface ApplicationDocument {
  _id?: ObjectId;
  referenceNumber: string;
  cycleId: string;
  idempotencyKey: string;

  // 1. Personal & Contact
  fullName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email?: string;
  governorateOrCity: string;
  preferredContactMethod: PreferredContact;

  // 2. Academic & Study
  institutionName: string;
  studyLevel: string;
  major: string;
  academicYearOrSemester: string;
  enrollmentStatus: EnrollmentStatus;
  periodTuitionFee: number;
  amountAlreadyPaid: number;
  confirmedExternalSupport: number;
  uncoveredTuitionAmount: number;
  isPaymentDeadlineNear: boolean;
  atRiskOfSuspension: boolean;
  otherScholarshipsOrDiscounts: ScholarshipCoverage;
  educationNotes?: string;

  // 3. Family & Household
  householdSize: number;
  dependentsCount: number;
  earnersCount: number;
  otherStudyingFamilyMembersCount: number;
  actualBreadwinner: ActualBreadwinner;
  fatherStatus: EmploymentStatus;
  motherStatus: EmploymentStatus;
  alternativeSupportAvailable: 'yes' | 'no' | 'partial';
  recentBreadwinnerLoss: boolean;
  recentBreadwinnerLossDate?: string;
  recentBreadwinnerLossImpact?: string;
  familyNotes?: string;

  // 4. Income Structure
  income: IncomeBreakdown;
  hasSeasonalIncome: boolean;
  seasonalIncomeCalculationMethod?: string;

  // 5. Expenses & Obligations
  housingStatus: HousingStatus;
  monthlyRent: number | null;
  recurringNecessaryMedicalExpenses: number | null;
  necessaryCareObligations: number | null;
  otherFamilyEducationExpenses: number | null;
  basicTransportExpenses: number | null;
  otherObligations: ExpenseObligation[];

  // 6. Special Circumstances
  recentJobLossOrIncomeDrop: boolean;
  recentJobLossDetails?: string;
  deathOrAbsenceOfBreadwinnerImpact: boolean;
  deathOrAbsenceImpactDetails?: string;
  healthOrCaregivingBurdenImpact: boolean;
  healthOrCaregivingDetails?: string;
  additionalContext?: string;

  // 7. Declarations
  infoAccuracyAcknowledged: boolean;
  dataUseAcknowledged: boolean;
  willingToProvideDocsAcknowledged: boolean;
  noGuaranteeAcknowledged: boolean;

  // 8. Workflow & Audit
  status: ApplicationWorkflowStatus;
  verificationStatus: VerificationState;
  eligibilityStatus: EligibilityState;
  decisionStatus: DecisionState;

  score: ScoreBreakdown;
  verifiedScore?: ScoreBreakdown;

  verificationChecklist: {
    tuitionFeeChecked?: VerificationChecklistItem;
    familyIncomeChecked?: VerificationChecklistItem;
    householdSizeChecked?: VerificationChecklistItem;
    breadwinnerStatusChecked?: VerificationChecklistItem;
    expensesChecked?: VerificationChecklistItem;
  };

  manualTieBreakNotes?: string;
  skippedReason?: string;
  reviewerNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface ScoringCriteria {
  version: number;
  approvedAt: string;
  approvedBy: string;
  reasonForVersion?: string;
  maxScore: number;
  weights: {
    perCapitaIncome: number;          // Default 55
    uncoveredTuition: number;         // Default 20
    expenseBurden: number;            // Default 15
    breadwinnerVulnerability: number; // Default 10
  };
  monthlyPerCapitaBenchmark: number;  // Configurable per country / currency
  currencyCode: string;              // e.g., 'SAR', 'JOD', 'USD'
  expenseBurdenCapRatio: number;      // e.g., 0.8
}

export interface InitiativeSettings {
  key: 'initiative_config';
  title: string;
  targetBeneficiariesCount: number; // 6
  isSubmissionOpen: boolean;
  submissionStartDate: string;
  submissionEndDate: string;
  resultsAnnouncementDate: string;
  scholarshipCoverageDescription: string;
  valueOrCapDescription: string;
  targetGroupDescription: string;
  includedInstitutionsDescription: string;
  contactEmail: string;
  contactPhone: string;
  privacyPolicySummary: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface AdminUser {
  _id?: ObjectId;
  username: string;
  passwordHash: string;
  displayName: string;
  role: 'super_admin' | 'reviewer';
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuditLog {
  _id?: ObjectId;
  actor: string;
  action: string;
  targetType: 'application' | 'settings' | 'criteria' | 'auth';
  targetId?: string;
  details: Record<string, unknown>;
  createdAt: Date;
}

export interface ApplicationCorrection {
  _id?: ObjectId;
  applicationId: ObjectId;
  referenceNumber: string;
  fieldName: string;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  correctedBy: string;
  createdAt: Date;
}
