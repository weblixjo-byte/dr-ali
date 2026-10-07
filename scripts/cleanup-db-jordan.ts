import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://mfaraj981_db_user:q3VOvNqlUYlMF7Op@dr-ali.rv8wxll.mongodb.net/?retryWrites=true&w=majority";
const dbName = "scholarship_db";

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  console.log("Connected successfully!");

  const db = client.db(dbName);

  // 1. Check & Update Criteria collection
  const criteriaCol = db.collection('criteria');
  const allCriteria = await criteriaCol.find({}).toArray();
  console.log("Current criteria in DB:", JSON.stringify(allCriteria, null, 2));

  // Update all criteria to Jordan (currencyCode: 'د.أ', monthlyPerCapitaBenchmark: 300)
  const criteriaUpdateResult = await criteriaCol.updateMany(
    {},
    {
      $set: {
        currencyCode: 'د.أ',
        monthlyPerCapitaBenchmark: 300,
        updatedAt: new Date(),
      }
    }
  );
  console.log(`Updated ${criteriaUpdateResult.modifiedCount} criteria records to JOD (د.أ) and 300 benchmark.`);

  // 2. Check & Update Settings collection
  const settingsCol = db.collection('settings');
  const allSettings = await settingsCol.find({}).toArray();
  console.log("Current settings in DB:", JSON.stringify(allSettings, null, 2));

  const settingsUpdateResult = await settingsCol.updateMany(
    {},
    {
      $set: {
        valueOrCapDescription: 'تغطية الرسوم الدراسية المعتمدة للفصل الدراسي لكل طالب مستحق وفق قرار اللجنة.',
        targetGroupDescription: 'الطلاب والطالبات المنتظمون في الجامعات والكليات المعتمدة داخل المملكة الأردنية الهاشمية أو المقبلون عليها الذين يواجهون صعوبات مالية.',
        includedInstitutionsDescription: 'الجامعات الرسمية والخاصة وكليات المجتمع المعتمدة داخل المملكة الأردنية الهاشمية.',
        contactPhone: '',
        contactEmail: '',
        updatedAt: new Date(),
      }
    }
  );
  console.log(`Updated ${settingsUpdateResult.modifiedCount} settings records to Jordan.`);

  // 3. Check Applications collection
  const appsCol = db.collection('applications');
  const saudiApps = await appsCol.find({
    $or: [
      { phoneCountryCode: '+966' },
      { governorateOrCity: /الرياض|جدة|مكة|الدمام/ },
      { "score.calculatedValues.currencyCode": 'ر.س' }
    ]
  }).toArray();
  console.log(`Found ${saudiApps.length} applications with Saudi references.`);
  
  if (saudiApps.length > 0) {
    // Delete or update test applications
    const delResult = await appsCol.deleteMany({
      $or: [
        { phoneCountryCode: '+966' },
        { governorateOrCity: /الرياض|جدة|مكة|الدمام/ }
      ]
    });
    console.log(`Deleted ${delResult.deletedCount} test applications with Saudi references.`);
  }

  // Also check if any applications have score explanation mentioning ر.س or 1200
  const allApps = await appsCol.find({}).toArray();
  console.log(`Total remaining applications in DB: ${allApps.length}`);

  await client.close();
  console.log("Database cleanup completed successfully!");
}

main().catch(err => {
  console.error("Error during DB cleanup:", err);
  process.exit(1);
});
