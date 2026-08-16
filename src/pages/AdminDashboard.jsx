import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BriefcaseBusiness,
  CheckCircle,
  Clock,
  Flag,
  RefreshCw,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react"

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AdminAnalyticsPanel from "../components/AdminAnalyticsPanel"
import AdminPaymentsPanel from "../components/AdminPaymentsPanel"
import SafetyReportsPanel from "../components/SafetyReportsPanel"
import AdminAuditLogPanel from "../components/AdminAuditLogPanel"
import EmployerVerificationPanel from "../components/EmployerVerificationPanel"

import { getAdminJobs, updateAdminJobStatus } from "../services/api"
import AdminLaunchChecklistPanel from "../components/AdminLaunchChecklistPanel"
import Seo from "../components/Seo"

const adminSections = [
  { id: "analytics", label: "Analytics" },
  { id: "launch", label: "Checklist" },
  { id: "payments", label: "Payment Confirmation" },
  { id: "jobs", label: "Job Review" },
  { id: "verification", label: "Employer Verification" },
  { id: "safety", label: "Safety Reports" },
  { id: "audit", label: "Audit Trail" },
]

const statusOptions = [
  { value: "ALL", label: "All Jobs" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "FLAGGED", label: "Flagged" },
  { value: "REJECTED", label: "Rejected" },
]

function formatDate(value) {
  if (!value) return "Not available"

  return new Date(value).toLocaleString("en-ZM", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function statusBadgeClass(status) {
  if (status === "APPROVED") {
    return "border-teal-400/30 bg-teal-400/10 text-teal-300"
  }

  if (status === "PENDING_REVIEW") {
    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
  }

  if (status === "PENDING_PAYMENT") {
    return "border-orange-400/30 bg-orange-400/10 text-orange-300"
  }

  if (status === "FLAGGED" || status === "REJECTED") {
    return "border-red-400/30 bg-red-400/10 text-red-300"
  }

  return "border-white/10 bg-white/5 text-zinc-300"
}

function riskBadgeClass(level) {
  const risk = String(level || "").toLowerCase()

  if (risk.includes("high")) {
    return "border-red-400/30 bg-red-400/10 text-red-300"
  }

  if (risk.includes("medium")) {
    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
  }

  return "border-teal-400/30 bg-teal-400/10 text-teal-300"
}

function cleanStatusLabel(status) {
  return String(status || "UNKNOWN").replaceAll("_", " ")
}

function JobDetailBox({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <div className="mt-2 break-words text-sm leading-7 text-zinc-200">
        {children}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeAdminSection, setActiveAdminSection] = useState("analytics")
  const [jobs, setJobs] = useState([])
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [jobError, setJobError] = useState("")
  const [updatingJobId, setUpdatingJobId] = useState("")
  const [adminNotes, setAdminNotes] = useState({})

  async function loadJobs() {
    try {
      setLoadingJobs(true)
      setJobError("")

      const data = await getAdminJobs()
      setJobs(data.jobs || [])
    } catch (error) {
      setJobError(error.message || "Failed to load admin jobs.")
    } finally {
      setLoadingJobs(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const filteredJobs = useMemo(() => {
    if (statusFilter === "ALL") return jobs

    return jobs.filter((job) => job.status === statusFilter)
  }, [jobs, statusFilter])

  const jobStats = useMemo(() => {
    return {
      total: jobs.length,
      pendingPayment: jobs.filter((job) => job.status === "PENDING_PAYMENT")
        .length,
      pendingReview: jobs.filter((job) => job.status === "PENDING_REVIEW")
        .length,
      approved: jobs.filter((job) => job.status === "APPROVED").length,
      flagged: jobs.filter((job) => job.status === "FLAGGED").length,
      rejected: jobs.filter((job) => job.status === "REJECTED").length,
    }
  }, [jobs])

  function updateAdminNote(jobId, value) {
    setAdminNotes((current) => ({
      ...current,
      [jobId]: value,
    }))
  }

  async function handleJobStatusUpdate(jobId, newStatus) {
    try {
      setUpdatingJobId(jobId)
      setJobError("")

      await updateAdminJobStatus(jobId, {
        status: newStatus,
        adminNote: adminNotes[jobId] || "",
      })

      await loadJobs()
    } catch (error) {
      setJobError(error.message || "Could not update job status.")
    } finally {
      setUpdatingJobId("")
    }
  }

  function clearLocalOnlyQueue() {
    localStorage.removeItem("employerJobs")
    alert("Old localStorage employer jobs cleared. Backend database jobs remain safe.")
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Seo title="Admin Dashboard" path="/admin-dashboard" noIndex />
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-black text-teal-300">
              <ShieldCheck size={16} />
              Admin Dashboard
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-6xl">
              Control job safety and employer trust.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              Review jobs, confirm payments, verify employers, monitor safety
              reports, and track important platform actions from one clean admin
              workspace.
            </p>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {adminSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveAdminSection(section.id)}
                  className={`rounded-2xl px-5 py-4 text-sm font-black transition ${
                    activeAdminSection === section.id
                      ? "bg-teal-400 text-zinc-950"
                      : "border border-white/10 bg-zinc-950 text-zinc-300 hover:border-teal-400/40 hover:text-teal-300"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {activeAdminSection === "analytics" && <AdminAnalyticsPanel />}

            {activeAdminSection === "launch" && <AdminLaunchChecklistPanel />}

            {activeAdminSection === "payments" && <AdminPaymentsPanel />}

            {activeAdminSection === "verification" && (
              <EmployerVerificationPanel />
            )}

            {activeAdminSection === "safety" && <SafetyReportsPanel />}

            {activeAdminSection === "audit" && <AdminAuditLogPanel />}

            {activeAdminSection === "jobs" && (
              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-black text-yellow-300">
                      <BriefcaseBusiness size={16} />
                      Job Review
                    </p>

                    <h2 className="mt-4 text-3xl font-black text-white">
                      Review employer job adverts
                    </h2>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                      Approve safe job adverts, reject unsuitable adverts, or
                      flag suspicious ones before they appear publicly.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={loadJobs}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                    >
                      <RefreshCw size={16} />
                      Refresh
                    </button>

                    <button
                      type="button"
                      onClick={clearLocalOnlyQueue}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-400/20"
                    >
                      <Trash2 size={16} />
                      Clear Local Data
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
                      Total
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {jobStats.total}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-orange-300">
                      Pending Payment
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {jobStats.pendingPayment}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-yellow-300">
                      Pending Review
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {jobStats.pendingReview}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-teal-300">
                      Approved
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {jobStats.approved}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-red-300">
                      Flagged
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {jobStats.flagged}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-red-300">
                      Rejected
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {jobStats.rejected}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm font-bold text-white outline-none focus:border-teal-400 sm:max-w-xs"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {jobError && (
                  <div className="mt-6 flex gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                    <AlertTriangle className="shrink-0" size={18} />
                    <span>{jobError}</span>
                  </div>
                )}

                {loadingJobs ? (
                  <p className="mt-8 text-sm text-zinc-400">
                    Loading jobs for review...
                  </p>
                ) : filteredJobs.length === 0 ? (
                  <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 text-center">
                    <CheckCircle className="mx-auto text-teal-300" size={42} />
                    <h3 className="mt-4 text-2xl font-black text-white">
                      No jobs found
                    </h3>
                    <p className="mt-2 text-sm text-zinc-400">
                      Jobs matching this filter will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-8 grid gap-6">
                    {filteredJobs.map((job) => {
                      const isUpdating = updatingJobId === job.id
                      const canApprove = job.paymentStatus === "PAID"

                      return (
                        <article
                          key={job.id}
                          className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-6"
                        >
                          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-3">
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-black ${statusBadgeClass(
                                    job.status
                                  )}`}
                                >
                                  {cleanStatusLabel(job.status)}
                                </span>

                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">
                                  Payment:{" "}
                                  {cleanStatusLabel(job.paymentStatus)}
                                </span>

                                {job.scamRiskLevel && (
                                  <span
                                    className={`rounded-full border px-3 py-1 text-xs font-black ${riskBadgeClass(
                                      job.scamRiskLevel
                                    )}`}
                                  >
                                    Scam risk: {job.scamRiskLevel}
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-4 text-3xl font-black text-white">
                                {job.title}
                              </h3>

                              <p className="mt-2 text-sm text-zinc-400">
                                {job.company} · {job.location} · {job.type}
                              </p>
                            </div>

                            <div className="w-full xl:max-w-sm">
                              <label className="text-sm font-black text-white">
                                Admin note
                              </label>

                              <textarea
                                value={adminNotes[job.id] || ""}
                                onChange={(event) =>
                                  updateAdminNote(job.id, event.target.value)
                                }
                                placeholder="Optional note for employer or audit trail"
                                className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none focus:border-teal-400"
                              />
                            </div>
                          </div>

                          <div className="mt-6 grid gap-4 lg:grid-cols-2">
                            <JobDetailBox title="Employer email">
                              {job.email || "Not available"}
                            </JobDetailBox>

                            <JobDetailBox title="Category">
                              {job.category || "Not available"}
                            </JobDetailBox>

                            <JobDetailBox title="Deadline">
                              {job.deadline || "Not available"}
                            </JobDetailBox>

                            <JobDetailBox title="Submitted">
                              {formatDate(job.createdAt)}
                            </JobDetailBox>
                          </div>

                          <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <JobDetailBox title="Description">
                              {job.description || "No description provided."}
                            </JobDetailBox>

                            <JobDetailBox title="Requirements">
                              {job.requirements || "No requirements provided."}
                            </JobDetailBox>
                          </div>

                          <div className="mt-5 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
                            <p className="text-sm font-black text-teal-300">
                              Scam Risk Analysis
                            </p>

                            <p className="mt-2 text-sm text-zinc-300">
                              Risk Level: {job.scamRiskLevel || "Low Risk"}
                            </p>

                            <p className="mt-1 text-sm text-zinc-300">
                              Risk Score: {job.scamRiskScore || 0}
                            </p>

                            <p className="mt-2 text-sm leading-7 text-zinc-400">
                              {job.scamRiskReasons ||
                                "No major scam indicators detected."}
                            </p>
                          </div>

                          {!canApprove && job.status !== "APPROVED" && (
                            <div className="mt-5 flex gap-3 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-300">
                              <Clock className="shrink-0" size={18} />
                              <span>
                                This job cannot be approved until payment is
                                confirmed.
                              </span>
                            </div>
                          )}

                          <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <button
                              type="button"
                              disabled={isUpdating || !canApprove}
                              onClick={() =>
                                handleJobStatusUpdate(job.id, "APPROVED")
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-black text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCircle size={18} />
                              Approve
                            </button>

                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleJobStatusUpdate(job.id, "FLAGGED")
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm font-black text-red-300 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Flag size={18} />
                              Flag
                            </button>

                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                handleJobStatusUpdate(job.id, "REJECTED")
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm font-black text-red-300 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={18} />
                              Reject
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}