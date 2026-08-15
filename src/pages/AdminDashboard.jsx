import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  FileWarning,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SafetyReportsPanel from "../components/SafetyReportsPanel"
import EmployerVerificationPanel from "../components/EmployerVerificationPanel"
import { getAdminJobs, updateAdminJobStatus } from "../services/api"
import AdminPaymentsPanel from "../components/AdminPaymentsPanel"
import AdminAuditLogPanel from "../components/AdminAuditLogPanel"

function AdminDashboard() {
  const [employerJobs, setEmployerJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [jobsError, setJobsError] = useState("")
  const [updatingJobId, setUpdatingJobId] = useState("")

  useEffect(() => {
    loadAdminJobs()
  }, [])

  async function loadAdminJobs() {
    try {
      setLoadingJobs(true)
      setJobsError("")

      const response = await getAdminJobs()
      setEmployerJobs(response.jobs || [])
    } catch (error) {
      setJobsError(error.message)
    } finally {
      setLoadingJobs(false)
    }
  }

  const pendingJobs = employerJobs.filter((job) => job.status === "Pending Review")
  const approvedJobs = employerJobs.filter((job) => job.status === "Approved")
  const flaggedJobs = employerJobs.filter((job) => job.status === "Flagged")
  const rejectedJobs = employerJobs.filter((job) => job.status === "Rejected")

  function getStatusClass(status) {
    if (status === "Approved") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Rejected") {
      return "bg-red-400/10 text-red-300"
    }

    if (status === "Flagged") {
      return "bg-orange-400/10 text-orange-300"
    }

    return "bg-yellow-400/10 text-yellow-300"
  }

  function getRiskClass(level) {
    if (level === "High Risk") {
      return "bg-red-400/10 text-red-300"
    }

    if (level === "Medium Risk") {
      return "bg-orange-400/10 text-orange-300"
    }

    return "bg-emerald-400/10 text-emerald-300"
  }

  function getRiskBoxClass(level) {
    if (level === "High Risk") {
      return "border-red-400/20 bg-red-400/10"
    }

    if (level === "Medium Risk") {
      return "border-orange-400/20 bg-orange-400/10"
    }

    return "border-emerald-400/20 bg-emerald-400/10"
  }

  async function updateJobStatus(jobId, newStatus) {
    try {
      setUpdatingJobId(jobId)

      const response = await updateAdminJobStatus(jobId, newStatus)

      setEmployerJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === jobId ? response.job : job
        )
      )
    } catch (error) {
      alert(error.message)
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
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:items-start">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                <ShieldCheck size={16} />
                Admin Dashboard
              </p>

              <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                Control job safety and employer trust.
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                Review real employer job adverts from the backend database, approve safe
                opportunities, flag suspicious posts, and protect job seekers.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
              <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-400 text-zinc-950">
                    <ShieldAlert size={30} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold text-red-300">
                      Backend scam protection active
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      High-risk jobs asking applicants to pay money are automatically
                      blocked from approval and moved to flagged status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <StatCard
              icon={Clock}
              label="Pending Jobs"
              value={pendingJobs.length}
              colour="text-yellow-300"
            />

            <StatCard
              icon={CheckCircle2}
              label="Approved Jobs"
              value={approvedJobs.length}
              colour="text-emerald-300"
            />

            <StatCard
              icon={AlertTriangle}
              label="Flagged Jobs"
              value={flaggedJobs.length}
              colour="text-orange-300"
            />

            <StatCard
              icon={XCircle}
              label="Rejected Jobs"
              value={rejectedJobs.length}
              colour="text-red-300"
            />
          </div>

          <div className="mt-12">
            <EmployerVerificationPanel />
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:col-span-2">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-3xl font-extrabold">
                    Backend Job Approval Queue
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    These jobs are now coming from the Prisma database, not localStorage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearLocalOnlyQueue}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={17} />
                  Clear Old Local Jobs
                </button>
              </div>

              {loadingJobs && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
                  <p className="text-sm font-bold text-teal-300">
                    Loading backend job queue...
                  </p>
                </div>
              )}

              {jobsError && (
                <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
                  <p className="text-sm font-bold text-red-300">{jobsError}</p>
                </div>
              )}

              {!loadingJobs && !jobsError && employerJobs.length > 0 ? (
                <div className="mt-6 space-y-6">
                  {employerJobs.map((job) => {
                    const riskLevel = job.scamRiskLevel || "Low Risk"
                    const riskScore = job.scamRiskScore || 0
                    const riskReasons =
                      Array.isArray(job.scamRiskReasons) && job.scamRiskReasons.length > 0
                        ? job.scamRiskReasons
                        : ["No major scam indicators detected"]

                    return (
                      <div
                        key={job.id}
                        className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
                      >
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                          <div>
                            <p className="text-sm font-bold text-teal-300">
                              {job.category || "General"}
                            </p>

                            <h3 className="mt-2 text-2xl font-extrabold">
                              {job.title || "Untitled Job"}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-400">
                              {job.company || "Employer"} •{" "}
                              {job.location || "Location not specified"}
                            </p>

                            <p className="mt-2 text-sm text-zinc-500">
                              Employer email: {job.email || "No email added"}
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                              Deadline: {job.deadline || "Not specified"}
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                              Submitted: {job.submittedAt || "Not available"}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                  job.status
                                )}`}
                              >
                                {job.status || "Pending Review"}
                              </span>

                              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                                {job.paymentStatus || "Manual payment active"}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getRiskClass(
                                  riskLevel
                                )}`}
                              >
                                Scam Check: {riskLevel}
                              </span>
                            </div>

                            {job.adminNote && (
                              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                                <h4 className="font-bold text-red-300">
                                  Admin Safety Note
                                </h4>

                                <p className="mt-2 text-sm leading-7 text-zinc-300">
                                  {job.adminNote}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <button
                              type="button"
                              disabled={updatingJobId === job.id}
                              onClick={() => updateJobStatus(job.id, "Approved")}
                              className="rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                            >
                              {updatingJobId === job.id ? "Updating..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={updatingJobId === job.id}
                              onClick={() => updateJobStatus(job.id, "Flagged")}
                              className="rounded-2xl border border-orange-400/40 px-5 py-3 text-sm font-bold text-orange-300 hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                            >
                              Flag
                            </button>

                            <button
                              type="button"
                              disabled={updatingJobId === job.id}
                              onClick={() => updateJobStatus(job.id, "Rejected")}
                              className="rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                            >
                              Reject
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h4 className="font-bold">Job Description</h4>

                          <p className="mt-2 text-sm leading-7 text-zinc-300">
                            {job.description || "No description added."}
                          </p>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                          <h4 className="font-bold">Requirements</h4>

                          <p className="mt-2 text-sm leading-7 text-zinc-300">
                            {job.requirements || "No requirements added."}
                          </p>
                        </div>

                        <div
                          className={`mt-4 rounded-2xl border p-5 ${getRiskBoxClass(
                            riskLevel
                          )}`}
                        >
                          <h4 className="flex items-center gap-2 font-bold">
                            <FileWarning size={20} />
                            Scam Risk Analysis
                          </h4>

                          <p className="mt-3 text-sm text-zinc-300">
                            Risk Level:{" "}
                            <span className="font-bold text-white">{riskLevel}</span>
                          </p>

                          <p className="mt-1 text-sm text-zinc-300">
                            Risk Score:{" "}
                            <span className="font-bold text-white">{riskScore}</span>
                          </p>

                          <div className="mt-3 space-y-2 text-sm text-zinc-300">
                            {riskReasons.map((reason, index) => (
                              <p key={index}>• {reason}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : null}

              {!loadingJobs && !jobsError && employerJobs.length === 0 && (
                <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                    <BriefcaseBusiness size={32} />
                  </div>

                  <h3 className="mt-6 text-2xl font-extrabold">
                    No submitted jobs yet
                  </h3>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
                    Employer job submissions from the backend database will appear here.
                  </p>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-teal-400/20 bg-teal-400/10 p-6">
                <h2 className="text-2xl font-extrabold text-teal-300">
                  Approval Rules
                </h2>

                <div className="mt-5 space-y-3 text-sm text-zinc-300">
                  <ChecklistItem text="Check company name and contact details" />
                  <ChecklistItem text="Review job description and requirements" />
                  <ChecklistItem text="Reject jobs asking applicants for money" />
                  <ChecklistItem text="Flag suspicious employer details" />
                </div>
              </div>

              <AdminPaymentsPanel />
              <SafetyReportsPanel />
              <div className="mt-12">
                <AdminAuditLogPanel />
              </div>

              <div className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
                <h2 className="text-2xl font-extrabold text-red-300">
                  Scam Warning
                </h2>

                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Any advert asking for application fees, registration fees, interview
                  fees, medical fees, transport fees, or recruitment payments should be
                  rejected or flagged.
                </p>
              </div>

              <div className="rounded-[2rem] border border-yellow-400/20 bg-white/5 p-6">
                <h2 className="text-2xl font-extrabold text-white">Manual Payment Control</h2>

                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  Manual payment confirmation is active. Employers can submit mobile money or
                  bank transaction references, and admin must confirm or reject each payment
                  before the job moves to review.
                </p>

                <p className="mt-5 rounded-full bg-yellow-400/10 px-4 py-2 text-center text-sm font-bold text-yellow-300">
                  Manual Payment Active
                </p>

                <p className="mt-3 text-xs leading-6 text-zinc-500">
                  Automatic online checkout remains disabled until payment gateway access is
                  available.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function StatCard({ icon: Icon, label, value, colour }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <Icon size={26} className={colour} />

      <p className="mt-4 text-sm text-zinc-400">{label}</p>

      <h2 className={`mt-2 text-3xl font-extrabold ${colour}`}>{value}</h2>
    </div>
  )
}

function ChecklistItem({ text }) {
  return (
    <p className="flex items-center gap-2">
      <CheckCircle2 size={17} className="text-teal-300" />
      <span>{text}</span>
    </p>
  )
}

export default AdminDashboard