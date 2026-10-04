import { NextRequest, NextResponse } from 'next/server';
import { getAdminsCollection, getAuditLogsCollection, ensureDatabaseIndexes } from '@/lib/db';
import { verifyPassword, signAdminSession, COOKIE_NAME } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rate = checkRateLimit(`login_${ip}`, 5, 5 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز عدد محاولات الدخول المسموح بها. يرجى الانتظار 5 دقائق.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return NextResponse.json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور.' }, { status: 400 });
    }

    const username = String(body.username).trim().toLowerCase();
    const password = String(body.password);

    await ensureDatabaseIndexes();
    const adminsCol = await getAdminsCollection();
    const admin = await adminsCol.findOne({ username });

    if (!admin) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, { status: 401 });
    }

    // Update last login
    await adminsCol.updateOne({ _id: admin._id }, { $set: { lastLoginAt: new Date() } });

    // Sign session JWT
    const token = await signAdminSession({
      userId: admin._id!.toString(),
      username: admin.username,
      displayName: admin.displayName,
      role: admin.role,
    });

    // Audit log
    const auditCol = await getAuditLogsCollection();
    await auditCol.insertOne({
      actor: admin.username,
      action: 'LOGIN',
      targetType: 'auth',
      details: { ip, userAgent: req.headers.get('user-agent') || '' },
      createdAt: new Date(),
    });

    const response = NextResponse.json({
      success: true,
      user: {
        username: admin.username,
        displayName: admin.displayName,
        role: admin.role,
      },
    });

    // Set HttpOnly Secure Cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error) {
    const rawMsg = (error as Error).message || '';
    console.error('Error during admin login:', rawMsg);

    let friendlyError = 'تعذر التحقق من تسجيل الدخول.';
    if (rawMsg.includes('MONGODB_URI')) {
      friendlyError = 'لم يتم ضبط متغير MONGODB_URI في إعدادات Vercel. يرجى إضافته في Environment Variables ثم إعادة النشر (Redeploy).';
    } else if (rawMsg.includes('ServerSelection') || rawMsg.includes('ETIMEDOUT') || rawMsg.includes('ECONNREFUSED') || rawMsg.includes('querySrv')) {
      friendlyError = 'قاعدة بيانات MongoDB Atlas حظرت الاتصال: يرجى الدخول إلى MongoDB Atlas > Network Access وإضافة 0.0.0.0/0 (السماح بالاتصال من أي مكان).';
    } else if (rawMsg.includes('Authentication') || rawMsg.includes('bad auth')) {
      friendlyError = 'اسم المستخدم أو كلمة المرور لقاعدة بيانات MongoDB غير صحيحة داخل الرابط.';
    } else {
      friendlyError = `خطأ في اتصال قاعدة البيانات: ${rawMsg}`;
    }

    return NextResponse.json(
      { error: friendlyError, detail: rawMsg },
      { status: 500 }
    );
  }
}
