'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  LogOut,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Settings as SettingsIcon,
  ListOrdered,
  Users,
  Eye,
  Check,
  X,
  Clock,
  Printer,
  Edit3,
  HelpCircle,
  Shield,
  History,
} from 'lucide-react';
import { ApplicationDocument, ScoringCriteria, InitiativeSettings, AuditLog } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'applications' | 'merit' | 'settings' | 'audit'>('applications');
  const [meritSubTab, setMeritSubTab] = useState<'declared' | 'verified'>('verified');

  // User State
  const [adminUser, setAdminUser] = useState<{ username: string; displayName: string; role: string } | null>(null);

  // Applications & Pagination
  const [applications, setApplications] = useState<ApplicationDocument[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [kpis, setKpis] = useState({
    totalCount: 0,
    newCount: 0,
    inReviewCount: 0,
    needsCompletionCount: 0,
    verifiedEligibleCount: 0,
    acceptedCount: 0,
    waitlistCount: 0,
  });

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Merit Ranking State
  const [rankingData, setRankingData] = useState<{
    rankedList: { rank: number; application: ApplicationDocument; isTied: boolean; tieReason?: string; isRank6TieCritical?: boolean }[];
    totalEligible: number;
    criticalTieAtCutoff: boolean;
    top6Candidates: { rank: number; application: ApplicationDocument }[];
  } | null>(null);

  // Selected Application for Detail Modal
  const [selectedApp, setSelectedApp] = useState<ApplicationDocument | null>(null);
  const [appCorrections, setAppCorrections] = useState<unknown[]>([]);
  const [appAuditLogs, setAppAuditLogs] = useState<unknown[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Status Update & Action Modal
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [skippedReason, setSkippedReason] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Correction Modal State
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionField, setCorrectionField] = useState('householdSize');
  const [correctionNewValue, setCorrectionNewValue] = useState<string>('');
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  // Settings & Criteria State
  const [settings, setSettings] = useState<InitiativeSettings | null>(null);
  const [criteria, setCriteria] = useState<ScoringCriteria | null>(null);
  const [criteriaReason, setCriteriaReason] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Audit Logs State
  const [systemAuditLogs, setSystemAuditLogs] = useState<AuditLog[]>([]);

  // 1. Check Auth & Load Current User
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data.authenticated) {
          setAdminUser(data.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  // 2. Fetch Applications with Server Pagination & Filters
  const fetchApplications = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
      });
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (verificationFilter) params.append('verificationStatus', verificationFilter);

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setApplications(data.applications || []);
      setPagination(data.pagination || { page: 1, limit: 50, total: 0, totalPages: 1 });
      if (data.kpis) setKpis(data.kpis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, verificationFilter]);

  // 3. Fetch Merit Ranking Lists
  const fetchMeritRanking = useCallback(async (mode: 'declared' | 'verified') => {
    try {
      const modeParam = mode === 'verified' ? 'merit_verified' : 'merit_declared';
      const res = await fetch(`/api/admin/applications?mode=${modeParam}`);
      if (!res.ok) throw new Error('Failed to fetch ranking');
      const data = await res.json();
      setRankingData(data.ranking);
      if (data.kpis) setKpis(data.kpis);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 4. Fetch Settings & Criteria
  const fetchSettingsAndCriteria = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        setCriteria(data.criteria);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // 5. Fetch System Audit Logs
  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setSystemAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications(pagination.page);
    } else if (activeTab === 'merit') {
      fetchMeritRanking(meritSubTab);
    } else if (activeTab === 'settings') {
      fetchSettingsAndCriteria();
    } else if (activeTab === 'audit') {
      fetchAuditLogs();
    }
  }, [activeTab, meritSubTab, pagination.page, fetchApplications, fetchMeritRanking, fetchSettingsAndCriteria, fetchAuditLogs]);

  // Open Application Detail Modal
  const openApplicationDetail = async (id: string) => {
    setDetailLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      if (!res.ok) throw new Error('Failed to load application');
      const data = await res.json();
      setSelectedApp(data.application);
      setAppCorrections(data.corrections || []);
      setAppAuditLogs(data.auditLogs || []);
      setStatusToUpdate(data.application.status);
      setReviewerNotes(data.application.reviewerNotes || '');
      setSkippedReason(data.application.skippedReason || '');
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Status Change Submit
  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdatingStatus(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.referenceNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusToUpdate,
          reviewerNotes,
          skippedReason: statusToUpdate === 'accepted' ? skippedReason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل تحديث الحالة.');
      }

      setSelectedApp(data.application);
      // Refresh list
      fetchApplications(pagination.page);
    } catch (err: unknown) {
      setActionError((err as Error).message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Toggle Verification Checklist Item
  const handleToggleChecklist = async (key: string, currentVal: boolean) => {
    if (!selectedApp) return;
    try {
      const updatedChecklist = {
        ...selectedApp.verificationChecklist,
        [key]: {
          verified: !currentVal,
          verifiedAt: new Date().toISOString(),
          verifiedBy: adminUser?.username,
        },
      };

      const res = await fetch(`/api/admin/applications/${selectedApp.referenceNumber}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedApp.status,
          verificationChecklist: updatedChecklist,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedApp(data.application);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Data Correction
  const handleSaveCorrection = async () => {
    if (!selectedApp || !correctionReason.trim()) return;
    setSubmittingCorrection(true);
    setActionError(null);

    let parsedVal: unknown = correctionNewValue;
    if (!isNaN(Number(correctionNewValue))) {
      parsedVal = Number(correctionNewValue);
    }

    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.referenceNumber}/correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldName: correctionField,
          newValue: parsedVal,
          reason: correctionReason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل تسجيل التصحيح.');

      setShowCorrectionModal(false);
      setCorrectionReason('');
      setCorrectionNewValue('');
      // Reload detail
      openApplicationDetail(selectedApp.referenceNumber);
    } catch (err: unknown) {
      setActionError((err as Error).message);
    } finally {
      setSubmittingCorrection(false);
    }
  };

  // Toggle Submission Open / Closed
  const handleToggleSubmission = async (newVal: boolean) => {
    if (!settings) return;
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          isSubmissionOpen: newVal,
        }),
      });
      if (res.ok) {
        setSettings({ ...settings, isSubmissionOpen: newVal });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base leading-tight block">لوحة إدارة المنح الدراسية</span>
              <span className="text-[11px] text-slate-400">نظام التدقيق والمفاضلة لـ 6 مقاعد معتمدة</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {adminUser && (
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-200">{adminUser.displayName}</div>
                <div className="text-[10px] text-slate-400 font-mono">@{adminUser.username}</div>
              </div>
            )}

            <a
              href="/api/admin/export"
              className="py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="تصدير ملف Excel نظيف ومحمي"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">تصدير CSV</span>
            </a>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-medium flex items-center gap-1.5 border border-rose-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Sub-nav Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 border-t border-slate-800/80 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'border-white text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>الطلبات والمراجعة ({kpis.totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('merit')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'merit'
                ? 'border-white text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>قوائم المفاضلة والاعتماد ({kpis.acceptedCount}/6)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-white text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>الإعدادات والمعايير</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'border-white text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سجل تدقيق الإجراءات</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mb-6 text-xs">
          <div className="p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-500 block">إجمالي الطلبات</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">{kpis.totalCount}</span>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-500 block">جديدة</span>
            <span className="text-xl font-bold text-blue-800 mt-0.5 block">{kpis.newCount}</span>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-500 block">تحت المراجعة</span>
            <span className="text-xl font-bold text-amber-800 mt-0.5 block">{kpis.inReviewCount}</span>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-500 block">تحتاج استكمالاً</span>
            <span className="text-xl font-bold text-rose-800 mt-0.5 block">{kpis.needsCompletionCount}</span>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-500 block">مؤهلة ومتحقق منها</span>
            <span className="text-xl font-bold text-indigo-800 mt-0.5 block">{kpis.verifiedEligibleCount}</span>
          </div>
          <div className="p-3 bg-white rounded border border-emerald-300 bg-emerald-50/50">
            <span className="text-emerald-800 font-semibold block">المقبولون المعتمدون</span>
            <span className="text-xl font-bold text-emerald-900 mt-0.5 block">{kpis.acceptedCount} / 6</span>
          </div>
          <div className="p-3 bg-white rounded border border-gray-200">
            <span className="text-gray-500 block">قائمة الانتظار</span>
            <span className="text-xl font-bold text-gray-700 mt-0.5 block">{kpis.waitlistCount}</span>
          </div>
        </div>

        {/* TAB 1: APPLICATIONS TABLE */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
            {/* Search and Filters Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/60 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث برقم الطلب، اسم الطالب، المؤسسة، أو التخصص..."
                  className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded bg-white text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-1.5 border border-gray-300 rounded bg-white text-xs"
                  >
                    <option value="">كافة حالات الطلب</option>
                    <option value="new">جديد</option>
                    <option value="in_review">تحت المراجعة</option>
                    <option value="needs_completion">يحتاج استكمالاً</option>
                    <option value="verified_eligible">مؤهل ومتحقق منه</option>
                    <option value="accepted">مقبول</option>
                    <option value="waitlist">قائمة انتظار</option>
                    <option value="ineligible">غير مؤهل</option>
                    <option value="withdrawn">منسحب</option>
                  </select>
                </div>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="p-1.5 border border-gray-300 rounded bg-white text-xs"
                >
                  <option value="">كافة حالات التحقق</option>
                  <option value="unverified">غير متحقق</option>
                  <option value="partially_verified">تحقق جزئي</option>
                  <option value="fully_verified">متحقق منه كلياً</option>
                </select>

                <button
                  onClick={() => fetchApplications(1)}
                  className="py-1.5 px-3 rounded bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  تطبيق الفلترة
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-3 w-12 text-center">#</th>
                    <th className="py-3 px-3">رقم الطلب</th>
                    <th className="py-3 px-3">اسم المتقدم</th>
                    <th className="py-3 px-3">المؤسسة والتخصص</th>
                    <th className="py-3 px-3">دخل الفرد</th>
                    <th className="py-3 px-3">الأسرة</th>
                    <th className="py-3 px-3">الرسوم المعلقة</th>
                    <th className="py-3 px-3 font-bold">درجة الحاجة</th>
                    <th className="py-3 px-3">التحقق</th>
                    <th className="py-3 px-3">الحالة</th>
                    <th className="py-3 px-3">تاريخ التقديم</th>
                    <th className="py-3 px-3 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-gray-500">
                        جارٍ تحميل بيانات الطلبات...
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-gray-500">
                        لا توجد طلبات تطابق معايير البحث والفلترة.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app, index) => {
                      const displayScore = app.verifiedScore?.total ?? app.score.total;
                      const pc = app.verifiedScore?.calculatedValues.perCapitaIncome ?? app.score.calculatedValues.perCapitaIncome;
                      const rowNum = (pagination.page - 1) * pagination.limit + index + 1;

                      return (
                        <tr key={app.referenceNumber} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center text-gray-500 font-mono">{rowNum}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{app.referenceNumber}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{app.fullName}</td>
                          <td className="py-2.5 px-3 text-gray-700">
                            <div>{app.institutionName}</div>
                            <div className="text-[11px] text-gray-500">{app.major}</div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-800">{pc} د.أ</td>
                          <td className="py-2.5 px-3 font-mono text-gray-700">{app.householdSize}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-800">
                            {app.uncoveredTuitionAmount.toLocaleString('ar-JO')} د.أ
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {displayScore} / 100
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                app.verificationStatus === 'fully_verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.verificationStatus === 'partially_verified'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {app.verificationStatus === 'fully_verified'
                                ? 'متحقق منه'
                                : app.verificationStatus === 'partially_verified'
                                ? 'تحقق جزئي'
                                : 'غير متحقق'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                app.status === 'accepted'
                                  ? 'bg-emerald-600 text-white'
                                  : app.status === 'verified_eligible'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : app.status === 'in_review'
                                  ? 'bg-amber-100 text-amber-800'
                                  : app.status === 'needs_completion'
                                  ? 'bg-rose-100 text-rose-800'
                                  : app.status === 'waitlist'
                                  ? 'bg-gray-200 text-gray-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {app.status === 'accepted'
                                ? 'مقبول'
                                : app.status === 'verified_eligible'
                                ? 'مؤهل ومتحقق'
                                : app.status === 'in_review'
                                ? 'تحت المراجعة'
                                : app.status === 'needs_completion'
                                ? 'يحتاج استكمالاً'
                                : app.status === 'waitlist'
                                ? 'قائمة انتظار'
                                : 'جديد'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-gray-500">
                            {new Date(app.createdAt).toISOString().slice(0, 10)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => openApplicationDetail(app.referenceNumber)}
                              className="py-1 px-2.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors cursor-pointer"
                            >
                              مراجعة
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between text-xs text-gray-600">
              <div>
                إجمالي النتائج: {pagination.total} طلب | الصفحة {pagination.page} من {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className="py-1 px-3 border border-gray-300 rounded bg-white disabled:opacity-50 hover:bg-gray-50 cursor-pointer"
                >
                  السابقة
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className="py-1 px-3 border border-gray-300 rounded bg-white disabled:opacity-50 hover:bg-gray-50 cursor-pointer"
                >
                  التالية
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MERIT RANKING & APPROVAL WORKFLOW */}
        {activeTab === 'merit' && (
          <div className="space-y-6">
            {/* Sub-tabs: Declared vs Verified */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMeritSubTab('verified')}
                  className={`py-2 px-4 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    meritSubTab === 'verified'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-gray-300 text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  ترتيب الطلبات المؤهلة والمتحقق منها (قائمة الاعتماد)
                </button>
                <button
                  onClick={() => setMeritSubTab('declared')}
                  className={`py-2 px-4 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    meritSubTab === 'declared'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-gray-300 text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  الترتيب المبدئي بحسب البيانات المصرح بها
                </button>
              </div>

              <div className="text-xs font-semibold text-slate-800 bg-white px-3 py-1.5 rounded border border-gray-200">
                المقاعد المعتمدة: {kpis.acceptedCount} من 6
              </div>
            </div>

            {/* Critical Cutoff Tie Alert Banner */}
            {rankingData?.criticalTieAtCutoff && (
              <div className="p-4 rounded border border-rose-300 bg-rose-50 text-rose-950 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-1">
                    تنبيه تعادل حرج عند المركز السادس:
                  </strong>
                  يوجد تعادل موضوعي تام في الدرجة الكلية ومعايير المفاضلة الاقتصادية المعلنة بين المتقدم عند المركز السادس ومنافسين يلونَه.
                  وفقاً للائحة، <strong>لا يجوز حسم التعادل تلقائياً بأسبقية الإرسال</strong>؛ بل يتطلب الأمر اجتماع اللجنة وإجراء حسم يدوي موثق في سجل الملاحظات.
                </div>
              </div>
            )}

            {/* Quota Under-enrollment Alert */}
            {meritSubTab === 'verified' && rankingData && rankingData.totalEligible < 6 && (
              <div className="p-3.5 rounded border border-amber-300 bg-amber-50 text-amber-950 text-xs flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>ملاحظة هامة للجنة:</strong> عدد الطلبات المؤهلة والمتحقق منها حالياً ({rankingData.totalEligible}) أقل من سقف الـ 6 منح.
                  يُحظر قبول طلبات غير مؤهلة أو غير مكتملة التحقق لمجرد إكمال العدد.
                </div>
              </div>
            )}

            {/* Merit Ranking Table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {meritSubTab === 'verified'
                      ? 'قائمة المفاضلة للطلبات المؤهلة والمتحقق منها'
                      : 'قائمة الترتيب المبدئي العام'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    أعلى 6 طلبات في هذه القائمة هم المرشحون المعتمدون لمقاعد المنحة الستة.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-3 w-14 text-center">المرتبة</th>
                      <th className="py-3 px-3">رقم الطلب</th>
                      <th className="py-3 px-3">اسم المتقدم</th>
                      <th className="py-3 px-3">المؤسسة التعليمية</th>
                      <th className="py-3 px-3">دخل الفرد</th>
                      <th className="py-3 px-3">الرسوم غير المغطاة</th>
                      <th className="py-3 px-3">درجة الأولوية</th>
                      <th className="py-3 px-3">حالة التعادل</th>
                      <th className="py-3 px-3">القرار الحالي</th>
                      <th className="py-3 px-3 text-center">إجراء الاعتماد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {!rankingData || rankingData.rankedList.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-gray-500">
                          لا توجد طلبات مؤهلة مدرجة في هذه القائمة بعد.
                        </td>
                      </tr>
                    ) : (
                      rankingData.rankedList.map((item) => {
                        const isTop6 = item.rank <= 6;
                        const isAccepted = item.application.status === 'accepted';
                        const scoreVal = item.application.verifiedScore?.total ?? item.application.score.total;
                        const pc = item.application.verifiedScore?.calculatedValues.perCapitaIncome ?? item.application.score.calculatedValues.perCapitaIncome;

                        return (
                          <tr
                            key={item.application.referenceNumber}
                            className={`transition-colors ${
                              isTop6 ? 'bg-slate-50/70 font-medium' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                  isTop6
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {item.rank}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              {item.application.referenceNumber}
                            </td>
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              {item.application.fullName}
                            </td>
                            <td className="py-3 px-3 text-gray-700">
                              {item.application.institutionName} - {item.application.major}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-800">{pc} د.أ</td>
                            <td className="py-3 px-3 font-mono text-slate-800">
                              {item.application.uncoveredTuitionAmount.toLocaleString('ar-JO')} د.أ
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              {scoreVal} / 100
                            </td>
                            <td className="py-3 px-3">
                              {item.isRank6TieCritical ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  تعادل حرج عند المركز 6
                                </span>
                              ) : item.isTied ? (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                                  تعادل موضوعي
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  isAccepted
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {isAccepted ? 'مقبول ومعتمد' : 'مرشح للمراجعة'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => openApplicationDetail(item.application.referenceNumber)}
                                className="py-1 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
                              >
                                مراجعة واعتماد
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS & CRITERIA MANAGER */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6">
            {/* Submission Open/Close Toggle */}
            <div className="p-5 bg-white rounded border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">حالة استقبال الطلبات</h3>
                  <p className="text-xs text-gray-500">
                    عند إغلاق التقديم، يتوقف استقبال الطلبات الجديدة ويبدأ التدقيق وحصر القوائم النهائية.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-800">
                    {settings.isSubmissionOpen ? 'التقديم مفتوح حالياً' : 'التقديم مغلق للمراجعة'}
                  </span>
                  <button
                    onClick={() => handleToggleSubmission(!settings.isSubmissionOpen)}
                    disabled={savingSettings}
                    className={`py-2 px-4 rounded text-xs font-bold transition-colors cursor-pointer ${
                      settings.isSubmissionOpen
                        ? 'bg-rose-700 hover:bg-rose-800 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {settings.isSubmissionOpen ? 'إغلاق التقديم الآن' : 'فتح التقديم الآن'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-gray-200">
              <h3 className="font-bold text-sm text-slate-900">سجل تدقيق العمليات والإجراءات</h3>
              <p className="text-xs text-gray-500">
                توثيق كامل للقرارات الإدارية، تحديثات الحالات، تسجيل الدخول، والتصحيحات.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">الوقت والتاريخ</th>
                    <th className="py-2.5 px-3">المسؤول (Actor)</th>
                    <th className="py-2.5 px-3">نوع الإجراء</th>
                    <th className="py-2.5 px-3">الهدف المعني</th>
                    <th className="py-2.5 px-3">تفاصيل الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {systemAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500 font-sans">
                        لا توجد سجلات تدقيق حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    systemAuditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-500">
                          {new Date(log.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900 font-sans">{log.actor}</td>
                        <td className="py-2 px-3">
                          <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-700">{log.targetId || '-'}</td>
                        <td className="py-2 px-3 text-gray-600 font-sans text-[11px]">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* DETAIL MODAL / DRAWER FOR SELECTED APPLICATION */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-300 max-w-4xl w-full max-h-[92vh] flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{selectedApp.fullName}</h3>
                  <span className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-gray-200 text-slate-800">
                    {selectedApp.referenceNumber}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selectedApp.institutionName} - {selectedApp.major} ({selectedApp.studyLevel})
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCorrectionModal(true)}
                  className="py-1 px-2.5 rounded bg-white border border-gray-300 text-slate-800 text-xs font-medium hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                  title="تسجيل تصحيح رسمي للبيانات"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>تصحيح معلومة</span>
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded text-gray-500 hover:text-slate-900 hover:bg-gray-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6 text-xs flex-1">
              {actionError && (
                <div className="p-3 rounded border border-rose-200 bg-rose-50 text-rose-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* 1. Score Breakdown & Rationale */}
              <div className="p-4 rounded border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                  <div className="font-bold text-sm text-slate-900">
                    تفصيل درجة الحاجة الاقتصادية: {selectedApp.verifiedScore?.total ?? selectedApp.score.total} / 100
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">
                    النسخة {selectedApp.score.criteriaVersion} من المعايير
                  </span>
                </div>

                {/* 4 Score Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="p-2 bg-white rounded border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">نقاط دخل الفرد (55)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedApp.verifiedScore?.perCapitaScore ?? selectedApp.score.perCapitaScore}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">نقاط الرسوم (20)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedApp.verifiedScore?.uncoveredTuitionScore ?? selectedApp.score.uncoveredTuitionScore}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">نقاط المصاريف (15)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedApp.verifiedScore?.expenseBurdenScore ?? selectedApp.score.expenseBurdenScore}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">نقاط الإعالة (10)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedApp.verifiedScore?.breadwinnerVulnerabilityScore ?? selectedApp.score.breadwinnerVulnerabilityScore}
                    </span>
                  </div>
                </div>

                {/* Arabic Explanations */}
                <div className="space-y-1 bg-white p-3 rounded border border-gray-200 text-gray-700 leading-relaxed text-[11px]">
                  <strong className="text-slate-900 block mb-1">أسباب احتساب الدرجة باللغة العربية:</strong>
                  {(selectedApp.verifiedScore?.explanationArabic ?? selectedApp.score.explanationArabic).map((exp, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-400">•</span>
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Applicant Full Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Academic & Financial */}
                <div className="p-3.5 rounded border border-gray-200 bg-white">
                  <h4 className="font-bold text-slate-900 text-xs mb-2 pb-1 border-b border-gray-100">
                    البيانات الأكاديمية والرسوم
                  </h4>
                  <dl className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">الثانوية العامة (التوجيهي):</dt>
                      <dd className="font-bold text-slate-900 font-mono">
                        {selectedApp.tawjihiGpa ? `${selectedApp.tawjihiGpa}% (${selectedApp.tawjihiBranch} - ${selectedApp.tawjihiYear})` : 'غير مسجل'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">الوضع الأكاديمي:</dt>
                      <dd className="font-medium text-slate-800">
                        {selectedApp.hasAttendedUniversity ? 'طالب جامعي' : 'خريج توجيهي (مقبل على الجامعة)'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">الحالة الدراسية:</dt>
                      <dd className="font-medium text-slate-800">
                        {selectedApp.enrollmentStatus === 'enrolled'
                          ? 'منتظم في الدراسة'
                          : selectedApp.enrollmentStatus === 'paused'
                          ? 'معلق القيد بسبب الرسوم'
                          : selectedApp.enrollmentStatus === 'accepted'
                          ? 'مقبول حديثاً ومطالب بالسداد'
                          : selectedApp.enrollmentStatus === 'prospective'
                          ? 'مقبل على التسجيل الجامعي'
                          : selectedApp.enrollmentStatus}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">رسوم الفترة الكاملة:</dt>
                      <dd className="font-mono text-slate-800">{selectedApp.periodTuitionFee} د.أ</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">المبلغ المدفوع / المتوفر:</dt>
                      <dd className="font-mono text-slate-800">{selectedApp.amountAlreadyPaid} د.أ</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">دعم خارجي مؤكد:</dt>
                      <dd className="font-mono text-slate-800">{selectedApp.confirmedExternalSupport} د.أ</dd>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-100 font-bold">
                      <dt className="text-slate-900">المبلغ المتبقي المطلوب:</dt>
                      <dd className="font-mono text-slate-900">{selectedApp.uncoveredTuitionAmount} د.أ</dd>
                    </div>
                  </dl>
                </div>

                {/* Family & Income */}
                <div className="p-3.5 rounded border border-gray-200 bg-white">
                  <h4 className="font-bold text-slate-900 text-xs mb-2 pb-1 border-b border-gray-100">
                    الأسرة ومصادر الدخل
                  </h4>
                  <dl className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">أفراد الأسرة:</dt>
                      <dd className="font-mono text-slate-800">{selectedApp.householdSize} أفراد</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">المعيل الفعلي:</dt>
                      <dd className="font-medium text-slate-800">{selectedApp.actualBreadwinner}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">حالة الأب / الأم:</dt>
                      <dd className="font-medium text-slate-800">
                        {selectedApp.fatherStatus} / {selectedApp.motherStatus}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">إجمالي دخل الأسرة:</dt>
                      <dd className="font-mono text-slate-800">
                        {selectedApp.score.calculatedValues.totalHouseholdIncome} د.أ
                      </dd>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-100 font-bold">
                      <dt className="text-slate-900">دخل الفرد الشهري:</dt>
                      <dd className="font-mono text-slate-900">
                        {selectedApp.score.calculatedValues.perCapitaIncome} د.أ
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Expenses & Circumstances */}
                <div className="p-3.5 rounded border border-gray-200 bg-white">
                  <h4 className="font-bold text-slate-900 text-xs mb-2 pb-1 border-b border-gray-100">
                    السكن والمصاريف المؤهلة
                  </h4>
                  <dl className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">حالة السكن:</dt>
                      <dd className="font-medium text-slate-800">{selectedApp.housingStatus}</dd>
                    </div>
                    {selectedApp.housingStatus === 'rented' && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">الإيجار الشهري:</dt>
                        <dd className="font-mono text-slate-800">{selectedApp.monthlyRent || 0} د.أ</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-gray-500">مصاريف علاجية مزمنة:</dt>
                      <dd className="font-mono text-slate-800">
                        {selectedApp.recurringNecessaryMedicalExpenses || 0} د.أ
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">الهاتف والمدينة:</dt>
                      <dd className="font-mono text-slate-800">
                        {selectedApp.phoneNumber} ({selectedApp.governorateOrCity})
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* 3. Verification Checklist for Committee */}
              <div className="p-4 rounded border border-gray-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 text-xs mb-2">
                  قائمة تحقق وثائق الطالب (التدقيق المكتبي للجنة)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedApp.verificationChecklist?.tuitionFeeChecked?.verified}
                      onChange={() =>
                        handleToggleChecklist(
                          'tuitionFeeChecked',
                          !!selectedApp.verificationChecklist?.tuitionFeeChecked?.verified
                        )
                      }
                      className="rounded border-gray-300 text-slate-900"
                    />
                    <span>مطابقة كشف الرسوم الجامعية</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedApp.verificationChecklist?.familyIncomeChecked?.verified}
                      onChange={() =>
                        handleToggleChecklist(
                          'familyIncomeChecked',
                          !!selectedApp.verificationChecklist?.familyIncomeChecked?.verified
                        )
                      }
                      className="rounded border-gray-300 text-slate-900"
                    />
                    <span>التحقق من إثباتات الدخل/المعاش</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!selectedApp.verificationChecklist?.householdSizeChecked?.verified}
                      onChange={() =>
                        handleToggleChecklist(
                          'householdSizeChecked',
                          !!selectedApp.verificationChecklist?.householdSizeChecked?.verified
                        )
                      }
                      className="rounded border-gray-300 text-slate-900"
                    />
                    <span>التحقق من سجل الأسرة</span>
                  </label>
                </div>
              </div>

              {/* 4. Action & Decision Update Section */}
              <div className="p-4 rounded border border-slate-300 bg-white">
                <h4 className="font-bold text-slate-900 text-xs mb-3">اتخاذ القرار وتحديث الحالة</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      حالة العمل الحالية للطلب:
                    </label>
                    <select
                      value={statusToUpdate}
                      onChange={(e) => setStatusToUpdate(e.target.value)}
                      className="w-full p-2 text-xs border border-gray-300 rounded bg-white font-medium"
                    >
                      <option value="new">جديد</option>
                      <option value="in_review">تحت المراجعة</option>
                      <option value="needs_completion">يحتاج استكمالاً</option>
                      <option value="verified_eligible">مؤهل ومتحقق منه</option>
                      <option value="accepted">مقبول ومعتمد (كأحد المستفيدين الـ 6)</option>
                      <option value="waitlist">قائمة انتظار</option>
                      <option value="ineligible">غير مؤهل</option>
                      <option value="withdrawn">منسحب</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      ملاحظات اللجنة والمراجع:
                    </label>
                    <input
                      type="text"
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder="تدوين ملاحظات داخلية للجنة..."
                      className="w-full p-2 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Mandatory Skip Reason if Accepting out of sequence */}
                {statusToUpdate === 'accepted' && (
                  <div className="p-3 bg-amber-50 rounded border border-amber-200 mb-3 space-y-1.5">
                    <label className="block font-semibold text-amber-950 text-[11px]">
                      سبب التجاوز والاعتماد (إلزامي إذا تم تجاوز مرشح أعلى درجة):
                    </label>
                    <input
                      type="text"
                      value={skippedReason}
                      onChange={(e) => setSkippedReason(e.target.value)}
                      placeholder="بيان مبررات قرار اللجنة المعتمد في محضر الاجتماع..."
                      className="w-full p-2 text-xs border border-amber-300 rounded bg-white"
                    />
                    <span className="text-[10px] text-amber-800 block">
                      * وفق اللائحة، لا يتم تغيير الدرجة الأصلية سراً، بل يُسجل سبب تجاوز أي مرشح في محضر تدقيق رسمي.
                    </span>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="py-2 px-5 rounded bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {updatingStatus ? 'جارٍ الحفظ...' : 'حفظ القرار وتحديث الحالة'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <span>تاريخ الإنشاء: {new Date(selectedApp.createdAt).toLocaleString('ar-JO')}</span>
              <button
                onClick={() => setSelectedApp(null)}
                className="py-1 px-3 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORRECTION RECORDING MODAL */}
      {showCorrectionModal && selectedApp && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-300 max-w-md w-full p-5 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="font-bold text-sm text-slate-900">تسجيل تصحيح بيانات الطلب</h4>
              <button onClick={() => setShowCorrectionModal(false)}>
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-1">الحقل المراد تصحيحه:</label>
              <select
                value={correctionField}
                onChange={(e) => setCorrectionField(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              >
                <option value="householdSize">عدد أفراد الأسرة</option>
                <option value="periodTuitionFee">رسوم الفترة الدراسية</option>
                <option value="amountAlreadyPaid">المبلغ المدفوع</option>
                <option value="confirmedExternalSupport">الدعم الخارجي</option>
                <option value="monthlyRent">الإيجار الشهري</option>
                <option value="recurringNecessaryMedicalExpenses">المصاريف العلاجية</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">القيمة المصححة الجديدة:</label>
              <input
                type="text"
                value={correctionNewValue}
                onChange={(e) => setCorrectionNewValue(e.target.value)}
                placeholder="أدخل القيمة الجديدة المدققة"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">سبب التصحيح والمستند الثبوتي (إلزامي):</label>
              <textarea
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                placeholder="توضيح سبب التعديل ورقم الوثيقة الثبوتية المقدمة..."
                rows={3}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="py-1.5 px-3 border border-gray-300 rounded bg-white text-gray-700"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveCorrection}
                disabled={submittingCorrection || !correctionReason.trim()}
                className="py-1.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white rounded font-semibold"
              >
                {submittingCorrection ? 'جارٍ الحفظ...' : 'تسجيل وإعادة احتساب الدرجة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
