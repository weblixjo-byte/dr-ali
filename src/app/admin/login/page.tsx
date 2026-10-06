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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded bg-black text-white flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-center text-xl sm:text-2xl font-bold text-black tracking-tight">
          بوابة إدارة مبادرة المنح الدراسية
        </h2>
        <p className="mt-1 text-center text-xs text-zinc-500 font-normal">
          تسجيل دخول أعضاء لجنة التدقيق والمراجعة الرسمية
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 border border-zinc-200 rounded sm:px-8">
          {error && (
            <div className="mb-5 p-3 rounded border border-black bg-zinc-100 text-black text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-black mb-1">
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
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded focus:border-black text-black bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-black mb-1">
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
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded focus:border-black text-black bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
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

          <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
            <Link href="/" className="hover:text-black flex items-center gap-1 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للموقع العام</span>
            </Link>
            <span className="text-[11px] text-zinc-400 font-mono">جلسة مشفرة محمية</span>
          </div>
        </div>

        <div className="mt-4 text-center text-[11px] text-zinc-400">
          * لا يوجد تسجيل عام لحسابات الإدارة. تُنشأ الحسابات حصراً عبر سكربت الخادم الداخلي المعتمد.
        </div>
      </div>
    </div>
  );
}
