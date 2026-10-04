import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'scholarship_db';

if (!MONGODB_URI) {
  console.error('❌ خطأ: يرجى تحديد متغير البيئة MONGODB_URI.');
  process.exit(1);
}

const COLLECTIONS = ['applications', 'settings', 'criteria', 'admins', 'audit_logs', 'corrections'];

async function backup(targetDir?: string) {
  const dir = targetDir || path.join(process.cwd(), 'backups', `backup-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log(`⏳ جارٍ بدء النسخ الاحتياطي إلى: ${dir}`);
  const client = new MongoClient(MONGODB_URI!);
  await client.connect();

  try {
    const db = client.db(DB_NAME);
    const summary: Record<string, number> = {};

    for (const colName of COLLECTIONS) {
      const col = db.collection(colName);
      const docs = await col.find({}).toArray();
      const filePath = path.join(dir, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');
      summary[colName] = docs.length;
      console.log(`- تم حفظ ${docs.length} وثيقة من مجموعة ${colName}`);
    }

    fs.writeFileSync(path.join(dir, 'metadata.json'), JSON.stringify({
      timestamp: new Date().toISOString(),
      database: DB_NAME,
      summary,
    }, null, 2));

    console.log(`\n✅ اكتمل النسخ الاحتياطي بنجاح!`);
    console.log(`المجلد: ${dir}`);
  } finally {
    await client.close();
  }
}

async function restore(backupDir: string) {
  if (!fs.existsSync(backupDir)) {
    console.error(`❌ مجلد النسخة الاحتياطية غير موجود: ${backupDir}`);
    process.exit(1);
  }

  console.log(`⚠️ تحذير: جارٍ استعادة البيانات من ${backupDir} إلى قاعدة البيانات ${DB_NAME}...`);
  const client = new MongoClient(MONGODB_URI!);
  await client.connect();

  try {
    const db = client.db(DB_NAME);

    for (const colName of COLLECTIONS) {
      const filePath = path.join(backupDir, `${colName}.json`);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const docs = JSON.parse(raw);
        if (Array.isArray(docs) && docs.length > 0) {
          const col = db.collection(colName);
          await col.deleteMany({});
          await col.insertMany(docs);
          console.log(`- تم استعادة ${docs.length} وثيقة في مجموعة ${colName}`);
        } else {
          console.log(`- مجموعة ${colName} فارغة في النسخة الاحتياطية.`);
        }
      }
    }

    console.log(`\n✅ تمت استعادة قاعدة البيانات بنجاح!`);
  } finally {
    await client.close();
  }
}

async function main() {
  const mode = process.argv[2] || 'backup';
  const param = process.argv[3];

  if (mode === 'backup') {
    await backup(param);
  } else if (mode === 'restore') {
    if (!param) {
      console.error('❌ يرجى تحديد مسار مجلد النسخة الاحتياطية: npm run restore <مسار_المجلد>');
      process.exit(1);
    }
    await restore(param);
  } else {
    console.log('الاستخدام:');
    console.log('  npm run backup');
    console.log('  npm run restore <مسار_مجلد_النسخة>');
  }
}

main().catch((err) => {
  console.error('❌ حدث خطأ:', err);
  process.exit(1);
});
