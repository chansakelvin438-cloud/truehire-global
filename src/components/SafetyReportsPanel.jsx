import { useEffect, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileWarning,
  Mail,
  Phone,
  ShieldAlert,
  User,
} from "lucide-react"
import {
  getAdminSafetyReports,
  updateSafetyReportStatus,
} from "../services/api"

function SafetyReportsPanel() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")

  useEffect(() => {
    loadReports()
  }, [])

  async function loadReports() {
    try {
      setLoading(true)
      setError("")

      const response = await getAdminSafetyReports()
      setReports(response.reports || [])
    } catch (error) {
      setError(error.message || "Failed to load safety reports")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(reportId, status) {
    try {
      setUpdatingId(reportId)

      const response = await updateSafetyReportStatus(reportId, status)

      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId ? response.report : report
        )
      )
    } catch (error) {
      alert(error.message || "Failed to update safety report")
    } finally {
      setUpdatingId("")
    }
  }

  function getStatusClass(status) {
    if (status === "Resolved") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Investigating") {
      return "bg-yellow-400/10 text-yellow-300"
    }

    return "bg-red-400/10 text-red-300"
  }

  const submittedCount = reports.filter(
    (report) => report.status === "Submitted"
  ).length

  const investigatingCount = reports.filter(
    (report) => report.status === "Investigating"
  ).length

  const resolvedCount = reports.filter(
    (report) => report.status === "Resolved"
  ).length

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-extrabold">
            <ShieldAlert size={26} className="text-red-300" />
            Safety Reports
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Review suspicious job reports submitted by users and visitors.
          </p>
        </div>

        <div className="rounded-full bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300">
          {reports.length} Reports
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <StatCard label="Submitted" value={submittedCount} colour="text-red-300" />
        <StatCard
          label="Investigating"
          value={investigatingCount}
          colour="text-yellow-300"
        />
        <StatCard label="Resolved" value={resolvedCount} colour="text-emerald-300" />
      </div>

      {loading && (
        <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <p className="text-sm font-bold text-teal-300">
            Loading safety reports...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
          <AlertTriangle size={34} className="mx-auto text-red-300" />

          <h3 className="mt-4 text-xl font-extrabold text-red-300">
            Could not load reports
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-300">{error}</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="mt-5 space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        report.status
                      )}`}
                    >
                      {report.status || "Submitted"}
                    </span>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                      {report.submittedAt || "Recently"}
                    </span>
                  </div>

                  <h3 className="mt-4 flex items-center gap-2 text-xl font-extrabold">
                    <FileWarning size={21} className="text-red-300" />
                    {report.jobTitle || "Suspicious job report"}
                  </h3>

                  <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
                    <InfoLine icon={User} label="Reporter" value={report.name} />
                    <InfoLine icon={Mail} label="Email" value={report.email} />
                    <InfoLine
                      icon={Phone}
                      label="Phone"
                      value={report.phone || "No phone added"}
                    />
                    <InfoLine
                      icon={Clock}
                      label="Submitted"
                      value={report.submittedAt}
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                    <h4 className="font-bold text-red-300">Report Message</h4>

                    <p className="mt-2 text-sm leading-7 text-zinc-300">
                      {report.message || "No message provided."}
                    </p>
                  </div>
                </div>

                <div className="w-full shrink-0 space-y-3 lg:w-48">
                  <button
                    type="button"
                    disabled={updatingId === report.id}
                    onClick={() => handleStatusUpdate(report.id, "Investigating")}
                    className="w-full rounded-2xl border border-yellow-400/40 px-5 py-3 text-sm font-bold text-yellow-300 hover:bg-yellow-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                  >
                    {updatingId === report.id ? "Updating..." : "Investigating"}
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === report.id}
                    onClick={() => handleStatusUpdate(report.id, "Resolved")}
                    className="w-full rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="mt-5 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <CheckCircle2 size={28} />
          </div>

          <h3 className="mt-5 text-xl font-extrabold">No safety reports yet</h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">
            Reports submitted through the contact page will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, colour }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className={`mt-2 text-2xl font-extrabold ${colour}`}>{value}</p>
    </div>
  )
}

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
        <Icon size={15} className="text-teal-300" />
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white">
        {value || "Not provided"}
      </p>
    </div>
  )
}

export default SafetyReportsPanel