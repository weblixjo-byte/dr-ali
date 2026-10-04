import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'scholarship_db';

if (!MONGODB_URI) {
  console.error('❌ خطأ: يرجى تحديد متغير البيئة MONGODB_URI قبل تشغيل السكربت.');
  process.exit(1);
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

async function main() {
  console.log('=== أداة إنشاء وتعيين مسؤول الإدارة للمنح الدراسية ===\n');

  const username = (await prompt('اسم المستخدم للمسؤول (Username): ')).toLowerCase();
  if (!username) {
    console.error('❌ اسم المستخدم مطلوب.');
    process.exit(1);
  }

  const displayName = (await prompt('الاسم الظاهر للمسؤول (Display Name): ')) || 'مسؤول النظام';

  const password = await prompt('كلمة المرور (Password - 8 أحرف على الأقل): ');
  if (!password || password.length < 8) {
    console.error('❌ يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.');
    process.exit(1);
  }

  console.log('\n⏳ جارٍ الاتصال بقاعدة البيانات وحفظ الحساب المشفر...');

  const client = new MongoClient(MONGODB_URI!);
  await client.connect();

  try {
    const db = client.db(DB_NAME);
    const adminsCol = db.collection('admins');

    // Create index
    await adminsCol.createIndex({ username: 1 }, { unique: true });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Upsert admin
    await adminsCol.updateOne(
      { username },
      {
        $set: {
          username,
          displayName,
          passwordHash,
          role: 'super_admin',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`\n✅ تم إنشاء/تحديث حساب المسؤول بنجاح!`);
    console.log(`- اسم المستخدم: ${username}`);
    console.log(`- الاسم الظاهر: ${displayName}`);
    console.log(`- الصلاحية: super_admin`);
    console.log(`- تم تشفير كلمة المرور بواسطة Bcrypt بأمان.\n`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error('❌ فشلت العملية:', err);
  process.exit(1);
});
