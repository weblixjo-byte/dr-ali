import { MongoClient, Db, Collection } from 'mongodb';
import {
  ApplicationDocument,
  InitiativeSettings,
  ScoringCriteria,
  AdminUser,
  AuditLog,
  ApplicationCorrection
} from '@/types';
import { DEFAULT_CRITERIA } from './scoring';

import dns from 'dns';

// Fix for local development / Windows DNS resolvers that block SRV records
if (process.env.NODE_ENV === 'development') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Ignore
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB_NAME || 'scholarship_db';

let clientPromise: Promise<MongoClient>;

export function getMongoClientPromise(): Promise<MongoClient> {
  const currentUri = process.env.MONGODB_URI?.trim() || uri;
  if (!currentUri) {
    throw new Error('لم يتم ضبط متغير البيئة MONGODB_URI في إعدادات Vercel. يرجى إضافته في Environment Variables.');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(currentUri, {
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 15000,
      });
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In serverless / production environments
    if (!global._mongoClientPromise) {
      const client = new MongoClient(currentUri, {
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 15000,
      });
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(DB_NAME);
}

export async function getApplicationsCollection(): Promise<Collection<ApplicationDocument>> {
  const db = await getDb();
  return db.collection<ApplicationDocument>('applications');
}

export async function getSettingsCollection(): Promise<Collection<InitiativeSettings>> {
  const db = await getDb();
  return db.collection<InitiativeSettings>('settings');
}

export async function getCriteriaCollection(): Promise<Collection<ScoringCriteria>> {
  const db = await getDb();
  return db.collection<ScoringCriteria>('criteria');
}

export async function getAdminsCollection(): Promise<Collection<AdminUser>> {
  const db = await getDb();
  return db.collection<AdminUser>('admins');
}

export async function getAuditLogsCollection(): Promise<Collection<AuditLog>> {
  const db = await getDb();
  return db.collection<AuditLog>('audit_logs');
}

export async function getCorrectionsCollection(): Promise<Collection<ApplicationCorrection>> {
  const db = await getDb();
  return db.collection<ApplicationCorrection>('corrections');
}

let indexesInitialized = false;

export async function ensureDatabaseIndexes(): Promise<void> {
  if (indexesInitialized) return;
  try {
    const db = await getDb();

    // 1. Applications Indexes
    const apps = db.collection('applications');
    await apps.createIndex({ referenceNumber: 1 }, { unique: true });
    await apps.createIndex({ idempotencyKey: 1 }, { unique: true });
    await apps.createIndex({ status: 1 });
    await apps.createIndex({ verificationStatus: 1 });
    await apps.createIndex({ 'score.total': -1 });
    await apps.createIndex({ cycleId: 1, status: 1, 'score.total': -1 });
    await apps.createIndex({ createdAt: -1 });

    // 2. Admins Indexes
    const admins = db.collection('admins');
    await admins.createIndex({ username: 1 }, { unique: true });

    // 3. Settings Indexes
    const settings = db.collection('settings');
    await settings.createIndex({ key: 1 }, { unique: true });

    // 4. Criteria Indexes
    const criteria = db.collection('criteria');
    await criteria.createIndex({ version: 1 }, { unique: true });

    // 5. Audit Logs Indexes
    const auditLogs = db.collection('audit_logs');
    await auditLogs.createIndex({ createdAt: -1 });
    await auditLogs.createIndex({ targetId: 1 });

    // 6. Corrections Indexes
    const corrections = db.collection('corrections');
    await corrections.createIndex({ applicationId: 1 });
    await corrections.createIndex({ createdAt: -1 });

    // Initialize default criteria if not present
    const existingCriteria = await criteria.findOne({ version: 1 });
    if (!existingCriteria) {
      await criteria.insertOne(DEFAULT_CRITERIA as any);
    }

    // Initialize default initiative settings if not present
    const existingSettings = await settings.findOne({ key: 'initiative_config' });
    if (!existingSettings) {
      const defaultSettings: InitiativeSettings = {
        key: 'initiative_config',
        title: 'مبادرة من حقك تتعلم',
        targetBeneficiariesCount: 6,
        isSubmissionOpen: true,
        submissionStartDate: '2026-02-01',
        submissionEndDate: '2026-03-31',
        resultsAnnouncementDate: '2026-04-15',
        scholarshipCoverageDescription:
          'تغطية الرسوم الدراسية المتبقية غير المغطاة للفترة الأكاديمية الحالية حتى السقف المعتمد.',
        valueOrCapDescription: 'تغطية الرسوم الدراسية المعتمدة للفصل الدراسي لكل طالب مستحق وفق قرار اللجنة.',
        targetGroupDescription:
          'الطلاب والطالبات المنتظمون في الجامعات والكليات المعتمدة الذين يواجهون صعوبات مالية حقيقية تهدد استمرار دراستهم.',
        includedInstitutionsDescription:
          'الجامعات الرسمية والخاصة وكليات المجتمع المعتمدة داخل المملكة الأردنية الهاشمية.',
        contactEmail: 'info@scholarship-initiative.org',
        contactPhone: '+96265000000',
        privacyPolicySummary:
          'تُستخدم البيانات المدخلة حصرًا لأغراض التدقيق والمفاضلة الاقتصادية بواسطة لجنة المنح، ولا يتم مشاركتها أو نشرها للعامة.',
        updatedAt: new Date(),
        updatedBy: 'النظام'
      };
      await settings.insertOne(defaultSettings as any);
    }

    indexesInitialized = true;
  } catch (err) {
    console.error('Error ensuring database indexes or initial config:', err);
    // Don't crash immediately if DB is temporarily unreachable during build
  }
}
