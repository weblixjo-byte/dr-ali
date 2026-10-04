import { NextResponse } from 'next/server';
import { getAdminSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      username: session.username,
      displayName: session.displayName,
      role: session.role,
    },
  });
}
