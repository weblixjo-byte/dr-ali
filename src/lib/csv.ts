import { ApplicationDocument } from '@/types';

/**
 * Sanitize a cell to prevent CSV formula injection (DDE / Command Execution in Excel)
 * When a field starts with =, +, -, @, \t, or \r, prepend an apostrophe (')
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value).trim();

  // CSV Formula Injection protection
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function generateApplicationsCsv(applications: ApplicationDocument[]): string {
  const headers = [
    'رقم الطلب',
    'الاسم الكامل',
    'رمز الدولة',
    'رقم الهاتف',
    'البريد الإلكتروني',
    'المدينة أو المحافظة',
    'المؤسسة التعليمية',
    'التخصص',
    'المرحلة الدراسية',
    'الحالة الدراسية',
    'رسوم الفترة',
    'المدفوع',
    'الدعم الخارجي',
    'الرسوم غير المغطاة',
    'أفراد الأسرة',
    'عدد المعالين',
    'إجمالي دخل الأسرة',
    'دخل الفرد الشهري',
    'حالة السكن',
    'الإيجار الشهري',
    'المصاريف الطبية الضرورية',
    'حالة الأب',
    'حالة الأم',
    'المعيل الفعلي',
    'درجة الحاجة الكلية',
    'نقاط دخل الفرد',
    'نقاط الرسوم',
    'نقاط المصاريف',
    'نقاط الإعالة',
    'حالة الطلب',
    'حالة التحقق',
    'حالة القرار',
    'تاريخ التقديم',
  ];

  const rows = applications.map((app) => {
    const calc = app.score.calculatedValues;
    return [
      sanitizeCsvCell(app.referenceNumber),
      sanitizeCsvCell(app.fullName),
      sanitizeCsvCell(app.phoneCountryCode),
      sanitizeCsvCell(app.phoneNumber),
      sanitizeCsvCell(app.email || 'غير مسجل'),
      sanitizeCsvCell(app.governorateOrCity),
      sanitizeCsvCell(app.institutionName),
      sanitizeCsvCell(app.major),
      sanitizeCsvCell(app.studyLevel),
      sanitizeCsvCell(app.enrollmentStatus),
      sanitizeCsvCell(app.periodTuitionFee),
      sanitizeCsvCell(app.amountAlreadyPaid),
      sanitizeCsvCell(app.confirmedExternalSupport),
      sanitizeCsvCell(app.uncoveredTuitionAmount),
      sanitizeCsvCell(app.householdSize),
      sanitizeCsvCell(app.dependentsCount),
      sanitizeCsvCell(calc.totalHouseholdIncome),
      sanitizeCsvCell(calc.perCapitaIncome),
      sanitizeCsvCell(app.housingStatus),
      sanitizeCsvCell(app.monthlyRent ?? 0),
      sanitizeCsvCell(app.recurringNecessaryMedicalExpenses ?? 0),
      sanitizeCsvCell(app.fatherStatus),
      sanitizeCsvCell(app.motherStatus),
      sanitizeCsvCell(app.actualBreadwinner),
      sanitizeCsvCell(app.score.total),
      sanitizeCsvCell(app.score.perCapitaScore),
      sanitizeCsvCell(app.score.uncoveredTuitionScore),
      sanitizeCsvCell(app.score.expenseBurdenScore),
      sanitizeCsvCell(app.score.breadwinnerVulnerabilityScore),
      sanitizeCsvCell(app.status),
      sanitizeCsvCell(app.verificationStatus),
      sanitizeCsvCell(app.decisionStatus),
      sanitizeCsvCell(new Date(app.createdAt).toISOString()),
    ].join(',');
  });

  // \uFEFF is UTF-8 Byte Order Mark (BOM) ensuring Arabic renders perfectly in Excel
  return `\uFEFF${headers.map(sanitizeCsvCell).join(',')}\r\n${rows.join('\r\n')}`;
}
