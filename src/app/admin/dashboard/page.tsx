'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
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
  Award,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Building2,
  Banknote,
  FileCheck,
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

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            مقبول ومعتمد
          </span>
        );
      case 'verified_eligible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            مؤهل ومتحقق منه
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            تحت المراجعة
          </span>
        );
      case 'needs_completion':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            يحتاج استكمالاً
          </span>
        );
      case 'waitlist':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            قائمة انتظار
          </span>
        );
      case 'ineligible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200 line-through">
            غير مؤهل
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-50 text-zinc-700 border border-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            جديد
          </span>
        );
    }
  };

  // Verification Badge Helper
  const renderVerificationBadge = (status: string) => {
    switch (status) {
      case 'fully_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 stroke-[2.5]" />
            متحقق كلياً
          </span>
        );
      case 'partially_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 stroke-[2]" />
            تحقق جزئي
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-normal text-zinc-400 bg-zinc-50 border border-zinc-200">
            غير مدقق
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 pb-16">
      {/* 1. Header Bar */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm sm:text-base text-zinc-900 tracking-tight block truncate">
                مبادرة من حقك تتعلم
              </span>
              <span className="text-[11px] text-zinc-500 font-normal block truncate">
                بوابة الإدارة وتدقيق طلبات الكفالة (سقف 6 مقاعد معتمدة)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {adminUser && (
              <div className="text-right hidden md:block pl-2 border-l border-zinc-200">
                <div className="text-xs font-semibold text-zinc-900">{adminUser.displayName}</div>
                <div className="text-[10px] text-zinc-500 font-mono">@{adminUser.username}</div>
              </div>
            )}

            <a
              href="/api/admin/export"
              className="py-2 px-3.5 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium flex items-center gap-2 border border-zinc-200/90 transition-colors shadow-xs"
              title="تصدير ملف Excel نظيف ومحمي"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 stroke-[2]" />
              <span className="hidden sm:inline">تصدير CSV</span>
            </a>

            <button
              onClick={handleLogout}
              className="py-2 px-3.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium flex items-center gap-1.5 border border-zinc-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2]" />
              <span className="hidden sm:inline">تسجيل خروج</span>
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 border-t border-zinc-100 text-xs font-medium">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'applications'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-emerald-50/40'
                : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Users className="w-4 h-4 stroke-[2]" />
            <span>سجل الطلبات والمراجعة</span>
            <span className="font-mono text-[11px] bg-zinc-200/70 text-zinc-800 px-1.5 py-0.5 rounded-md">
              {kpis.totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('merit')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'merit'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-emerald-50/40'
                : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <Award className="w-4 h-4 stroke-[2]" />
            <span>قوائم المفاضلة والاعتماد</span>
            <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-semibold">
              {kpis.acceptedCount}/6
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-emerald-50/40'
                : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <SettingsIcon className="w-4 h-4 stroke-[2]" />
            <span>الإعدادات والتحكم</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'audit'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-emerald-50/40'
                : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <History className="w-4 h-4 stroke-[2]" />
            <span>سجل العمليات الإدارية</span>
          </button>
        </div>
      </header>

      {/* 3. Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {/* Approved Seats Card (Highlighted Hero Card) */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 p-4 bg-emerald-600 text-white rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-100 mb-1">
                <span className="text-xs font-medium">المقاعد المعتمدة</span>
                <Award className="w-4 h-4 text-emerald-200 stroke-[2.2]" />
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold font-mono text-white">{kpis.acceptedCount}</span>
                <span className="text-xs text-emerald-200 font-mono">/ 6 مقاعد</span>
              </div>
            </div>
            {/* Mini Progress */}
            <div className="w-full h-1.5 bg-emerald-700/60 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (kpis.acceptedCount / 6) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-zinc-500 font-medium block">إجمالي الطلبات</span>
            <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">{kpis.totalCount}</span>
            <span className="text-[10px] text-zinc-400 mt-1">المسجلة في النظام</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-zinc-500 font-medium block">طلبات جديدة</span>
            <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">{kpis.newCount}</span>
            <span className="text-[10px] text-zinc-400 mt-1">بانتظار الفرز</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-amber-700 font-medium block">تحت المراجعة</span>
            <span className="text-2xl font-bold font-mono text-amber-900 mt-1 block">{kpis.inReviewCount}</span>
            <span className="text-[10px] text-zinc-400 mt-1">قيد التدقيق المكتبي</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-emerald-700 font-medium block">مؤهلة ومتحقق منها</span>
            <span className="text-2xl font-bold font-mono text-emerald-900 mt-1 block">{kpis.verifiedEligibleCount}</span>
            <span className="text-[10px] text-emerald-600/80 mt-1">جاهزة للمفاضلة</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-zinc-500 font-medium block">قائمة الانتظار</span>
            <span className="text-2xl font-bold font-mono text-zinc-900 mt-1 block">{kpis.waitlistCount}</span>
            <span className="text-[10px] text-zinc-400 mt-1">مرشحون احتياط</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: APPLICATIONS TABLE                                      */}
        {/* ============================================================== */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-5 border-b border-zinc-200/80 bg-zinc-50/50 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="بحث برقم الطلب، اسم الطالب، الجامعة، أو التخصص..."
                  className="w-full pr-10 pl-4 py-2.5 border border-zinc-200 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors shadow-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-zinc-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="py-2 px-3 border border-zinc-200 rounded-xl bg-white text-zinc-800 text-xs focus:border-emerald-600 transition-colors cursor-pointer shadow-xs"
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
                  className="py-2 px-3 border border-zinc-200 rounded-xl bg-white text-zinc-800 text-xs focus:border-emerald-600 transition-colors cursor-pointer shadow-xs"
                >
                  <option value="">كافة حالات التحقق</option>
                  <option value="unverified">غير مدقق</option>
                  <option value="partially_verified">تحقق جزئي</option>
                  <option value="fully_verified">متحقق كلياً</option>
                </select>

                <button
                  onClick={() => fetchApplications(1)}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
                >
                  تطبيق
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-50/80 text-zinc-600 font-semibold border-b border-zinc-200/80">
                  <tr>
                    <th className="py-3.5 px-3 w-10 text-center">#</th>
                    <th className="py-3.5 px-4">المتقدم ورقم الطلب</th>
                    <th className="py-3.5 px-4">المؤسسة والتخصص</th>
                    <th className="py-3.5 px-3">دخل الفرد</th>
                    <th className="py-3.5 px-3">الرسوم المطلوبة</th>
                    <th className="py-3.5 px-3 text-center">درجة الحاجة</th>
                    <th className="py-3.5 px-3">التحقق</th>
                    <th className="py-3.5 px-3">الحالة</th>
                    <th className="py-3.5 px-3">التاريخ</th>
                    <th className="py-3.5 px-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-zinc-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>جارٍ تحميل بيانات الطلبات...</span>
                        </div>
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-zinc-500">
                        لا توجد طلبات تطابق معايير البحث الحالية.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app, index) => {
                      const displayScore = app.verifiedScore?.total ?? app.score.total;
                      const pc = app.verifiedScore?.calculatedValues.perCapitaIncome ?? app.score.calculatedValues.perCapitaIncome;
                      const rowNum = (pagination.page - 1) * pagination.limit + index + 1;

                      return (
                        <tr key={app.referenceNumber} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3 px-3 text-center text-zinc-400 font-mono text-[11px]">{rowNum}</td>
                          
                          <td className="py-3 px-4">
                            <div className="font-semibold text-zinc-900">{app.fullName}</div>
                            <div className="font-mono text-[11px] text-zinc-500 mt-0.5">{app.referenceNumber}</div>
                          </td>

                          <td className="py-3 px-4 text-zinc-700">
                            <div>{app.institutionName}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5">{app.major}</div>
                          </td>

                          <td className="py-3 px-3 font-mono font-medium text-zinc-800">
                            {pc} د.أ
                          </td>

                          <td className="py-3 px-3 font-mono font-medium text-zinc-800">
                            {app.uncoveredTuitionAmount.toLocaleString('ar-JO')} د.أ
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="font-mono font-bold text-xs bg-zinc-100 text-zinc-800 px-2 py-1 rounded-lg border border-zinc-200">
                              {displayScore} / 100
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            {renderVerificationBadge(app.verificationStatus)}
                          </td>

                          <td className="py-3 px-3">
                            {renderStatusBadge(app.status)}
                          </td>

                          <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                            {new Date(app.createdAt).toISOString().slice(0, 10)}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => openApplicationDetail(app.referenceNumber)}
                              className="py-1.5 px-3 rounded-xl bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 text-zinc-700 font-medium text-xs border border-zinc-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>مراجعة</span>
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
            <div className="p-4 border-t border-zinc-200/80 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
              <div>
                إجمالي النتائج: <strong className="text-zinc-900 font-mono">{pagination.total}</strong> طلب | الصفحة <span className="font-mono">{pagination.page}</span> من <span className="font-mono">{pagination.totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className="py-1.5 px-3.5 border border-zinc-200 rounded-xl bg-white disabled:opacity-40 hover:bg-zinc-50 cursor-pointer text-zinc-800 transition-colors shadow-xs"
                >
                  السابقة
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className="py-1.5 px-3.5 border border-zinc-200 rounded-xl bg-white disabled:opacity-40 hover:bg-zinc-50 cursor-pointer text-zinc-800 transition-colors shadow-xs"
                >
                  التالية
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MERIT RANKING & APPROVAL WORKFLOW                       */}
        {/* ============================================================== */}
        {activeTab === 'merit' && (
          <div className="space-y-6">
            {/* Sub-tabs: Declared vs Verified */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMeritSubTab('verified')}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    meritSubTab === 'verified'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  قائمة الاعتماد (المتحقق منها)
                </button>
                <button
                  onClick={() => setMeritSubTab('declared')}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    meritSubTab === 'declared'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  الترتيب المبدئي بحسب البيانات المصرح بها
                </button>
              </div>

              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
                المقاعد المعتمدة: <span className="font-mono">{kpis.acceptedCount}</span> من 6
              </div>
            </div>

            {/* Critical Cutoff Tie Alert Banner */}
            {rankingData?.criticalTieAtCutoff && (
              <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/70 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 stroke-[2]" />
                <div className="leading-relaxed">
                  <strong className="block font-bold mb-1 text-amber-900">
                    تنبيه تعادل حرج عند المركز السادس:
                  </strong>
                  يوجد تعادل موضوعي تام في الدرجة الكلية ومعايير المفاضلة الاقتصادية المعلنة بين المتقدم عند المركز السادس ومنافسين يلونَه.
                  وفقاً للائحة، <strong>لا يجوز حسم التعادل تلقائياً بأسبقية الإرسال</strong>؛ بل يتطلب الأمر اجتماع اللجنة وإجراء حسم يدوي موثق في سجل الملاحظات.
                </div>
              </div>
            )}

            {/* Quota Under-enrollment Alert */}
            {meritSubTab === 'verified' && rankingData && rankingData.totalEligible < 6 && (
              <div className="p-4 rounded-2xl border border-zinc-200 bg-white text-zinc-700 text-xs flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-zinc-900 font-semibold block mb-0.5">ملاحظة هامة للجنة:</strong>
                  عدد الطلبات المؤهلة والمتحقق منها حالياً ({rankingData.totalEligible}) أقل من سقف الـ 6 منح.
                  يُحظر قبول طلبات غير مؤهلة أو غير مكتملة التحقق لمجرد إكمال العدد.
                </div>
              </div>
            )}

            {/* Merit Ranking Table */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 bg-zinc-50/50 border-b border-zinc-200/80">
                <h3 className="font-bold text-sm text-zinc-900">
                  {meritSubTab === 'verified'
                    ? 'قائمة المفاضلة للطلبات المؤهلة والمتحقق منها'
                    : 'قائمة الترتيب المبدئي العام'}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  أعلى 6 طلبات في هذه القائمة هم المرشحون المعتمدون لمقاعد المنحة الستة.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-zinc-50/80 text-zinc-600 font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-3 w-14 text-center">المرتبة</th>
                      <th className="py-3 px-4">رقم الطلب</th>
                      <th className="py-3 px-4">اسم المتقدم</th>
                      <th className="py-3 px-4">المؤسسة والتخصص</th>
                      <th className="py-3 px-3">دخل الفرد</th>
                      <th className="py-3 px-3">الرسوم المطلوبة</th>
                      <th className="py-3 px-3 font-bold">الدرجة</th>
                      <th className="py-3 px-3">حالة التعادل</th>
                      <th className="py-3 px-3">القرار الحالي</th>
                      <th className="py-3 px-4 text-center">إجراء الاعتماد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {!rankingData || rankingData.rankedList.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-zinc-400">
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
                              isTop6 ? 'bg-emerald-50/20' : 'hover:bg-zinc-50'
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold font-mono ${
                                  isTop6
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-zinc-100 text-zinc-600'
                                }`}
                              >
                                {item.rank}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                              {item.application.referenceNumber}
                            </td>
                            <td className="py-3 px-4 font-semibold text-zinc-900">
                              {item.application.fullName}
                            </td>
                            <td className="py-3 px-4 text-zinc-700">
                              <div>{item.application.institutionName}</div>
                              <div className="text-[11px] text-zinc-500 mt-0.5">{item.application.major}</div>
                            </td>
                            <td className="py-3 px-3 font-mono font-medium text-zinc-800">{pc} د.أ</td>
                            <td className="py-3 px-3 font-mono font-medium text-zinc-800">
                              {item.application.uncoveredTuitionAmount.toLocaleString('ar-JO')} د.أ
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                              {scoreVal} / 100
                            </td>
                            <td className="py-3 px-3">
                              {item.isRank6TieCritical ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-amber-300 bg-amber-50 text-amber-800">
                                  تعادل حرج (6)
                                </span>
                              ) : item.isTied ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] border border-zinc-200 bg-zinc-100 text-zinc-700">
                                  تعادل موضوعي
                                </span>
                              ) : (
                                <span className="text-zinc-400">-</span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              {renderStatusBadge(item.application.status)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => openApplicationDetail(item.application.referenceNumber)}
                                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
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

        {/* ============================================================== */}
        {/* TAB 3: SETTINGS & CRITERIA MANAGER                             */}
        {/* ============================================================== */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-6 max-w-4xl">
            {/* Submission Open/Close Toggle */}
            <div className="p-6 bg-white rounded-2xl border border-zinc-200/90 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <h3 className="font-bold text-base text-zinc-900 mb-1">بوابة استقبال طلبات الكفالة</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
                    عند إغلاق التقديم، يتوقف استقبال الطلبات الجديدة عبر الموقع ويبدأ التدقيق المكتبي وحصر القوائم النهائية المعتمدة.
                  </p>
                </div>

                <div className="flex items-center gap-3.5">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl border ${
                    settings.isSubmissionOpen
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}>
                    {settings.isSubmissionOpen ? 'التقديم مفتوح حالياً' : 'التقديم مغلق للمراجعة'}
                  </span>
                  
                  <button
                    onClick={() => handleToggleSubmission(!settings.isSubmissionOpen)}
                    disabled={savingSettings}
                    className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs ${
                      settings.isSubmissionOpen
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {savingSettings ? 'جارٍ الحفظ...' : settings.isSubmissionOpen ? 'إغلاق التقديم الآن' : 'فتح التقديم الآن'}
                  </button>
                </div>
              </div>
            </div>

            {/* Criteria Overview Info */}
            <div className="p-6 bg-white rounded-2xl border border-zinc-200/90 shadow-xs text-xs space-y-4">
              <h3 className="font-bold text-sm text-zinc-900 pb-2 border-b border-zinc-100">
                أوزان معايير المفاضلة المعتمدة في النظام
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span className="text-zinc-500 block text-[11px]">مؤشر دخل الفرد</span>
                  <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">55%</span>
                  <span className="text-[10px] text-zinc-400">الوزن الأكبر للحاجة</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span className="text-zinc-500 block text-[11px]">الرسوم الجامعية</span>
                  <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">20%</span>
                  <span className="text-[10px] text-zinc-400">عبء الرسوم غير المغطاة</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span className="text-zinc-500 block text-[11px]">عبء السكن والعلاج</span>
                  <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">15%</span>
                  <span className="text-[10px] text-zinc-400">الإيجار والأمراض المزمنة</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <span className="text-zinc-500 block text-[11px]">هشاشة الإعالة</span>
                  <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">10%</span>
                  <span className="text-[10px] text-zinc-400">وفاة/تعطل المعيل</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: AUDIT LOGS                                              */}
        {/* ============================================================== */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 bg-zinc-50/50 border-b border-zinc-200/80">
              <h3 className="font-bold text-sm text-zinc-900">سجل تدقيق العمليات والإجراءات</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                توثيق كامل للقرارات الإدارية، تحديثات الحالات، تسجيل الدخول، والتصحيحات.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-50/80 text-zinc-600 font-semibold border-b border-zinc-200">
                  <tr>
                    <th className="py-3 px-4">الوقت والتاريخ</th>
                    <th className="py-3 px-4">المسؤول (Actor)</th>
                    <th className="py-3 px-4">نوع الإجراء</th>
                    <th className="py-3 px-4">الهدف المعني</th>
                    <th className="py-3 px-4">تفاصيل الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
                  {systemAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-400 font-sans">
                        لا توجد سجلات تدقيق مسجلة حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    systemAuditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/80">
                        <td className="py-2.5 px-4 text-zinc-500">
                          {new Date(log.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-zinc-900 font-sans">{log.actor}</td>
                        <td className="py-2.5 px-4">
                          <span className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-md text-[10px] border border-zinc-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-zinc-700">{log.targetId || '-'}</td>
                        <td className="py-2.5 px-4 text-zinc-600 font-sans text-[11px]">
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

      {/* ============================================================== */}
      {/* DETAIL MODAL FOR SELECTED APPLICATION                          */}
      {/* ============================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-zinc-900 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-base sm:text-lg text-zinc-900">{selectedApp.fullName}</h3>
                  <span className="font-mono text-xs bg-white px-2.5 py-0.5 rounded-lg border border-zinc-200 text-zinc-800 font-semibold">
                    {selectedApp.referenceNumber}
                  </span>
                  {renderStatusBadge(selectedApp.status)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {selectedApp.institutionName} • {selectedApp.major}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowCorrectionModal(true)}
                  className="py-1.5 px-3 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-medium hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="تسجيل تصحيح رسمي للبيانات"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تصحيح معلومة</span>
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
              {actionError && (
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* 1. Score Breakdown & Rationale */}
              <div className="p-4 sm:p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3.5">
                  <div className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>درجة الحاجة الاقتصادية المحتسبة:</span>
                    <span className="font-mono text-base font-bold text-emerald-700">
                      {selectedApp.verifiedScore?.total ?? selectedApp.score.total} / 100
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    النسخة {selectedApp.score.criteriaVersion} من المعايير
                  </span>
                </div>

                {/* 4 Score Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs">
                    <span className="text-zinc-500 block text-[11px]">نقاط دخل الفرد (55)</span>
                    <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">
                      {selectedApp.verifiedScore?.perCapitaScore ?? selectedApp.score.perCapitaScore}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs">
                    <span className="text-zinc-500 block text-[11px]">نقاط الرسوم (20)</span>
                    <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">
                      {selectedApp.verifiedScore?.uncoveredTuitionScore ?? selectedApp.score.uncoveredTuitionScore}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs">
                    <span className="text-zinc-500 block text-[11px]">نقاط المصاريف (15)</span>
                    <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">
                      {selectedApp.verifiedScore?.expenseBurdenScore ?? selectedApp.score.expenseBurdenScore}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-zinc-200/80 shadow-xs">
                    <span className="text-zinc-500 block text-[11px]">نقاط الإعالة (10)</span>
                    <span className="font-bold text-zinc-900 text-base font-mono mt-0.5 block">
                      {selectedApp.verifiedScore?.breadwinnerVulnerabilityScore ?? selectedApp.score.breadwinnerVulnerabilityScore}
                    </span>
                  </div>
                </div>

                {/* Arabic Explanations */}
                <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-zinc-200/80 text-zinc-700 leading-relaxed text-[11px]">
                  <strong className="text-zinc-900 block mb-1">بيان احتساب الدرجة باللغة العربية:</strong>
                  {(selectedApp.verifiedScore?.explanationArabic ?? selectedApp.score.explanationArabic).map((exp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Applicant Full Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Academic & Financial */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <h4 className="font-bold text-zinc-900 text-xs mb-3 pb-1.5 border-b border-zinc-100 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>البيانات الأكاديمية والرسوم</span>
                  </h4>
                  <dl className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">الثانوية (التوجيهي):</dt>
                      <dd className="font-bold text-zinc-900 font-mono">
                        {selectedApp.tawjihiGpa ? `${selectedApp.tawjihiGpa}% (${selectedApp.tawjihiBranch})` : 'غير مسجل'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">المرحلة:</dt>
                      <dd className="font-medium text-zinc-800">
                        {selectedApp.hasAttendedUniversity ? 'طالب جامعي' : 'خريج توجيهي جديد'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">الحالة الدراسية:</dt>
                      <dd className="font-medium text-zinc-800 truncate max-w-[130px]">
                        {selectedApp.academicYearOrSemester || selectedApp.enrollmentStatus}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">رسوم الفصل الكاملة:</dt>
                      <dd className="font-mono font-medium text-zinc-900">{selectedApp.periodTuitionFee} د.أ</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">المبلغ المسدد / المتوفر:</dt>
                      <dd className="font-mono font-medium text-zinc-900">{selectedApp.amountAlreadyPaid} د.أ</dd>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-zinc-100 font-bold">
                      <dt className="text-emerald-900">المبلغ الصافي المطلوب:</dt>
                      <dd className="font-mono text-emerald-700">{selectedApp.uncoveredTuitionAmount} د.أ</dd>
                    </div>
                  </dl>
                </div>

                {/* Family & Income */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <h4 className="font-bold text-zinc-900 text-xs mb-3 pb-1.5 border-b border-zinc-100 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>الأسرة ومصادر الدخل</span>
                  </h4>
                  <dl className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">أفراد الأسرة:</dt>
                      <dd className="font-mono font-bold text-zinc-900">{selectedApp.householdSize} أفراد</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">المعيل الفعلي:</dt>
                      <dd className="font-medium text-zinc-800">{selectedApp.actualBreadwinner}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">حالة الأب / الأم:</dt>
                      <dd className="font-medium text-zinc-800">
                        {selectedApp.fatherStatus} / {selectedApp.motherStatus}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">إجمالي دخل الأسرة:</dt>
                      <dd className="font-mono font-medium text-zinc-900">
                        {selectedApp.score.calculatedValues.totalHouseholdIncome} د.أ
                      </dd>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-zinc-100 font-bold">
                      <dt className="text-emerald-900">دخل الفرد الشهري:</dt>
                      <dd className="font-mono text-emerald-700">
                        {selectedApp.score.calculatedValues.perCapitaIncome} د.أ
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Expenses & Contact */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-white">
                  <h4 className="font-bold text-zinc-900 text-xs mb-3 pb-1.5 border-b border-zinc-100 flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    <span>السكن والمصاريف الإضافية</span>
                  </h4>
                  <dl className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">حالة السكن:</dt>
                      <dd className="font-medium text-zinc-800">{selectedApp.housingStatus}</dd>
                    </div>
                    {selectedApp.housingStatus === 'rented' && (
                      <div className="flex justify-between">
                        <dt className="text-zinc-500">الإيجار الشهري:</dt>
                        <dd className="font-mono font-medium text-zinc-900">{selectedApp.monthlyRent || 0} د.أ</dd>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">مصاريف علاجية مزمنة:</dt>
                      <dd className="font-mono font-medium text-zinc-900">
                        {selectedApp.recurringNecessaryMedicalExpenses || 0} د.أ
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">المحافظة / المدينة:</dt>
                      <dd className="font-medium text-zinc-800">{selectedApp.governorateOrCity}</dd>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-zinc-100">
                      <dt className="text-zinc-500">الهاتف للتواصل:</dt>
                      <dd className="font-mono text-zinc-900" dir="ltr">{selectedApp.phoneNumber}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* 3. Verification Checklist for Committee */}
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-zinc-50/70">
                <h4 className="font-bold text-zinc-900 text-xs mb-3 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>قائمة تدقيق وثائق ومستندات الطالب (لجنة الاعتماد)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-zinc-200/90 cursor-pointer text-zinc-800 shadow-xs hover:border-emerald-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!selectedApp.verificationChecklist?.tuitionFeeChecked?.verified}
                      onChange={() =>
                        handleToggleChecklist(
                          'tuitionFeeChecked',
                          !!selectedApp.verificationChecklist?.tuitionFeeChecked?.verified
                        )
                      }
                      className="w-4 h-4 rounded border-zinc-300 accent-emerald-600 text-emerald-600 cursor-pointer"
                    />
                    <span className="font-medium">مطابقة كشف الرسوم الجامعية</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-zinc-200/90 cursor-pointer text-zinc-800 shadow-xs hover:border-emerald-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!selectedApp.verificationChecklist?.familyIncomeChecked?.verified}
                      onChange={() =>
                        handleToggleChecklist(
                          'familyIncomeChecked',
                          !!selectedApp.verificationChecklist?.familyIncomeChecked?.verified
                        )
                      }
                      className="w-4 h-4 rounded border-zinc-300 accent-emerald-600 text-emerald-600 cursor-pointer"
                    />
                    <span className="font-medium">التحقق من إثباتات الدخل/المعاش</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-zinc-200/90 cursor-pointer text-zinc-800 shadow-xs hover:border-emerald-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={!!selectedApp.verificationChecklist?.householdSizeChecked?.verified}
                      onChange={() =>
                        handleToggleChecklist(
                          'householdSizeChecked',
                          !!selectedApp.verificationChecklist?.householdSizeChecked?.verified
                        )
                      }
                      className="w-4 h-4 rounded border-zinc-300 accent-emerald-600 text-emerald-600 cursor-pointer"
                    />
                    <span className="font-medium">التحقق من دفتر العائلة والأسرة</span>
                  </label>
                </div>
              </div>

              {/* 4. Action & Decision Update Section */}
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs">
                <h4 className="font-bold text-zinc-900 text-xs mb-3">اتخاذ القرار وتحديث الحالة الرسمية</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1.5">
                      حالة العمل الحالية للطلب:
                    </label>
                    <select
                      value={statusToUpdate}
                      onChange={(e) => setStatusToUpdate(e.target.value)}
                      className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl bg-white text-zinc-900 font-medium focus:border-emerald-600 transition-colors"
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
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1.5">
                      ملاحظات اللجنة والمراجع:
                    </label>
                    <input
                      type="text"
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder="تدوين ملاحظات داخلية للجنة..."
                      className="w-full p-2.5 text-xs border border-zinc-200 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Mandatory Skip Reason if Accepting out of sequence */}
                {statusToUpdate === 'accepted' && (
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 mb-3 space-y-1.5">
                    <label className="block font-semibold text-amber-950 text-[11px]">
                      سبب التجاوز والاعتماد (إلزامي إذا تم تجاوز مرشح أعلى درجة):
                    </label>
                    <input
                      type="text"
                      value={skippedReason}
                      onChange={(e) => setSkippedReason(e.target.value)}
                      placeholder="بيان مبررات قرار اللجنة المعتمد في محضر الاجتماع..."
                      className="w-full p-2.5 text-xs border border-amber-300 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400"
                    />
                    <span className="text-[10px] text-amber-800 block">
                      * وفق اللائحة، لا يتم تغيير الدرجة الأصلية سراً، بل يُسجل سبب تجاوز أي مرشح في محضر تدقيق رسمي.
                    </span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    {updatingStatus ? 'جارٍ الحفظ...' : 'حفظ القرار وتحديث الحالة'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs text-zinc-500">
              <span>تاريخ التقديم: {new Date(selectedApp.createdAt).toLocaleString('ar-JO')}</span>
              <button
                onClick={() => setSelectedApp(null)}
                className="py-1.5 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CORRECTION RECORDING MODAL                                     */}
      {/* ============================================================== */}
      {showCorrectionModal && selectedApp && (
        <div className="fixed inset-0 z-60 bg-zinc-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs text-zinc-900">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h4 className="font-bold text-sm text-zinc-900">تسجيل تصحيح بيانات الطلب</h4>
              <button onClick={() => setShowCorrectionModal(false)}>
                <X className="w-4 h-4 text-zinc-400 hover:text-zinc-900 cursor-pointer" />
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-zinc-800">الحقل المراد تصحيحه:</label>
              <select
                value={correctionField}
                onChange={(e) => setCorrectionField(e.target.value)}
                className="w-full p-2.5 border border-zinc-200 rounded-xl bg-white text-zinc-900 focus:border-emerald-600 transition-colors"
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
              <label className="block font-semibold mb-1 text-zinc-800">القيمة المصححة الجديدة:</label>
              <input
                type="text"
                value={correctionNewValue}
                onChange={(e) => setCorrectionNewValue(e.target.value)}
                placeholder="أدخل القيمة الجديدة المدققة"
                className="w-full p-2.5 border border-zinc-200 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-zinc-800">سبب التصحيح والمستند الثبوتي (إلزامي):</label>
              <textarea
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                placeholder="توضيح سبب التعديل ورقم الوثيقة الثبوتية المقدمة..."
                rows={3}
                className="w-full p-2.5 border border-zinc-200 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="py-2 px-4 border border-zinc-200 rounded-xl bg-white text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveCorrection}
                disabled={submittingCorrection || !correctionReason.trim()}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 text-white rounded-xl font-semibold cursor-pointer shadow-xs transition-colors"
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
