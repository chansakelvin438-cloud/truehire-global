import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle,
  CreditCard,
  FileCheck,
  FileText,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react"
import { getAdminAnalytics } from "../services/api"

function StatCard({ title, value, subtitle, icon: Icon, tone = "teal" }) {
  const tones = {
    teal: "border-teal-400/20 bg-teal-400/10 text-teal-300",
    yellow: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    red: "border-red-400/20 bg-red-400/10 text-red-300",
    zinc: "border-white/10 bg-white/5 text-zinc-300",
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-zinc-400">{title}</p>
          <p className="mt-3 text-4xl font-black text-white">{value}</p>
          {subtitle && (
            <p className="mt-2 text-xs leading-5 text-zinc-500">{subtitle}</p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}

function SmallMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  )
}

export default function AdminAnalyticsPanel() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadAnalytics() {
    try {
      setLoading(true)
      setError("")

      const data = await getAdminAnalytics()
      setAnalytics(data.analytics)
    } catch (err) {
      setError(err.message || "Could not load analytics.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm text-zinc-400">Loading admin analytics...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-red-400/30 bg-red-400/10 p-6">
        <div className="flex gap-3 text-red-300">
          <AlertTriangle className="shrink-0" size={20} />
          <p className="text-sm">{error}</p>
        </div>
      </section>
    )
  }

  if (!analytics) return null

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
            <BarChart3 size={16} />
            Admin Analytics
          </p>

          <h2 className="text-2xl font-black text-white">
            Platform performance overview
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Monitor users, jobs, applications, manual payments, verification
            activity, safety reports, and audit logs from one place.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAnalytics}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total users"
          value={analytics.users.total}
          subtitle={`${analytics.users.jobSeekers} job seekers · ${analytics.users.employers} employers`}
          icon={Users}
          tone="teal"
        />

        <StatCard
          title="Total jobs"
          value={analytics.jobs.total}
          subtitle={`${analytics.jobs.approved} approved · ${analytics.jobs.pendingReview} pending review`}
          icon={BriefcaseBusiness}
          tone="yellow"
        />

        <StatCard
          title="Applications"
          value={analytics.applications.total}
          subtitle={`${analytics.applications.shortlisted} shortlisted · ${analytics.applications.interviewScheduled} interviews`}
          icon={FileText}
          tone="teal"
        />

        <StatCard
          title="Confirmed revenue"
          value={`${analytics.payments.currency} ${analytics.payments.confirmedAmount}`}
          subtitle={`${analytics.payments.confirmed} confirmed payments`}
          icon={CreditCard}
          tone="yellow"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="text-yellow-300" size={24} />
            <h3 className="text-xl font-black text-white">Job pipeline</h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SmallMetric label="Pending payment" value={analytics.jobs.pendingPayment} />
            <SmallMetric label="Pending review" value={analytics.jobs.pendingReview} />
            <SmallMetric label="Approved" value={analytics.jobs.approved} />
            <SmallMetric label="Flagged" value={analytics.jobs.flagged} />
            <SmallMetric label="Rejected" value={analytics.jobs.rejected} />
            <SmallMetric label="Total jobs" value={analytics.jobs.total} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
          <div className="flex items-center gap-3">
            <CreditCard className="text-yellow-300" size={24} />
            <h3 className="text-xl font-black text-white">Payment activity</h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SmallMetric label="Submitted" value={analytics.payments.submitted} />
            <SmallMetric label="Confirmed" value={analytics.payments.confirmed} />
            <SmallMetric label="Rejected" value={analytics.payments.rejected} />
            <SmallMetric label="Total submissions" value={analytics.payments.total} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-teal-300" size={24} />
            <h3 className="text-xl font-black text-white">
              Employer verification
            </h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SmallMetric label="Submitted" value={analytics.verifications.submitted} />
            <SmallMetric label="Verified" value={analytics.verifications.verified} />
            <SmallMetric label="Flagged" value={analytics.verifications.flagged} />
            <SmallMetric label="Rejected" value={analytics.verifications.rejected} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5">
          <div className="flex items-center gap-3">
            <FileCheck className="text-teal-300" size={24} />
            <h3 className="text-xl font-black text-white">
              Safety and audit
            </h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <SmallMetric label="Safety reports" value={analytics.safetyReports.total} />
            <SmallMetric label="Investigating" value={analytics.safetyReports.investigating} />
            <SmallMetric label="Resolved" value={analytics.safetyReports.resolved} />
            <SmallMetric label="Audit logs" value={analytics.auditLogs.total} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-teal-400/20 bg-teal-400/10 p-5">
        <div className="flex gap-3">
          <CheckCircle className="mt-1 shrink-0 text-teal-300" size={20} />
          <p className="text-sm leading-7 text-zinc-300">
            Use this dashboard to monitor platform health before and after
            launch. If pending payments, flagged jobs, unresolved reports, or
            rejected verifications rise quickly, review the audit trail and take
            action.
          </p>
        </div>
      </div>
    </section>
  )
}