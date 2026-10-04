import crypto from 'crypto';

/**
 * Generate human-friendly reference number: e.g. APP-2026-X8K9M2
 */
export function generateReferenceNumber(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    randomPart += chars[bytes[i] % chars.length];
  }
  const year = new Date().getFullYear();
  return `APP-${year}-${randomPart}`;
}

/**
 * Strip sensitive PII / financial details for receipt printing
 */
export function formatReceiptData(app: {
  referenceNumber: string;
  fullName: string;
  institutionName: string;
  major: string;
  createdAt: string | Date;
  status: string;
}) {
  return {
    referenceNumber: app.referenceNumber,
    fullName: app.fullName,
    institutionName: app.institutionName,
    major: app.major,
    submissionDate: new Date(app.createdAt).toLocaleDateString('ar-JO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    statusArabic: 'قيد المراجعة والتدقيق المكتبي',
  };
}
