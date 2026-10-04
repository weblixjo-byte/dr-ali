import { redirect } from 'next/navigation';
import { getAdminSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminRootPage() {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    redirect('/admin/login');
  } else {
    redirect('/admin/dashboard');
  }
}
