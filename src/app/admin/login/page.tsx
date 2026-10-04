'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, AlertCircle, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-12 h-12 rounded bg-slate-900 text-white flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="text-center text-xl sm:text-2xl font-bold text-slate-900">
          بوابة إدارة مبادرة المنح الدراسية
        </h2>
        <p className="mt-1 text-center text-xs text-gray-600">
          تسجيل دخول أعضاء لجنة التدقيق والمراجعة
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xs border border-gray-200 rounded sm:px-8">
          {error && (
            <div className="mb-5 p-3 rounded border border-rose-200 bg-rose-50 text-rose-900 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-800 mb-1">
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-slate-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-800 mb-1">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>جارٍ التحقق...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تسجيل الدخول للنظام</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <Link href="/" className="hover:text-slate-900 flex items-center gap-1 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للموقع العام</span>
            </Link>
            <span className="text-[11px] text-gray-400">جلسة مشفرة محمية</span>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-gray-500">
          * لا يوجد تسجيل عام لحسابات الإدارة. تُنشأ الحسابات حصراً عبر سكربت الخادم الداخلي المعتمد.
        </div>
      </div>
    </div>
  );
}
