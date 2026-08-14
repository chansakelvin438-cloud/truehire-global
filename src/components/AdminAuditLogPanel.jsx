import { useEffect, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react"
import { getAdminAuditLogs } from "../services/api"

const actionOptions = [
  { value: "", label: "All actions" },
  { value: "EMPLOYER_SUBMITTED_PAYMENT", label: "Employer submitted payment" },
  { value: "ADMIN_CONFIRMED_PAYMENT", label: "Admin confirmed payment" },
  { value: "ADMIN_REJECTED_PAYMENT", label: "Admin rejected payment" },
  { value: "ADMIN_APPROVED_JOB", label: "Admin approved job" },
  { value: "ADMIN_REJECTED_JOB", label: "Admin rejected job" },
  { value: "ADMIN_FLAGGED_JOB", label: "Admin flagged job" },
  {
    value: "EMPLOYER_UPDATED_APPLICATION_STATUS",
    label: "Employer updated application",
  },
  {
    value: "EMPLOYER_SUBMITTED_VERIFICATION",
    label: "Employer submitted verification",
  },
  {
    value: "ADMIN_APPROVED_EMPLOYER_VERIFICATION",
    label: "Admin approved verification",
  },
  {
    value: "ADMIN_REJECTED_EMPLOYER_VERIFICATION",
    label: "Admin rejected verification",
  },
  {
    value: "ADMIN_FLAGGED_EMPLOYER_VERIFICATION",
    label: "Admin flagged verification",
  },
]

const targetOptions = [
  { value: "", label: "All targets" },
  { value: "PaymentSubmission", label: "Payments" },
  { value: "Job", label: "Jobs" },
  { value: "Application", label: "Applications" },
  { value: "EmployerVerification", label: "Employer Verification" },
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

function actionBadgeClass(action) {
  if (action.includes("REJECTED") || action.includes("FLAGGED")) {
    return "border-red-400/30 bg-red-400/10 text-red-300"
  }

  if (action.includes("APPROVED") || action.includes("CONFIRMED")) {
    return "border-teal-400/30 bg-teal-400/10 text-teal-300"
  }

  if (action.includes("PAYMENT")) {
    return "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
  }

  return "border-white/10 bg-white/5 text-zinc-300"
}

export default function AdminAuditLogPanel() {
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 1,
  })
  const [search, setSearch] = useState("")
  const [action, setAction] = useState("")
  const [targetType, setTargetType] = useState("")
  const [expandedLogId, setExpandedLogId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadLogs(nextPage = 1) {
    try {
      setLoading(true)
      setError("")

      const data = await getAdminAuditLogs({
        page: nextPage,
        limit: 25,
        search,
        action,
        targetType,
      })

      setLogs(data.logs || [])
      setPagination(
        data.pagination || {
          page: nextPage,
          limit: 25,
          total: 0,
          totalPages: 1,
        }
      )
    } catch (err) {
      setError(err.message || "Could not load audit logs.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, targetType])

  function handleSearchSubmit(event) {
    event.preventDefault()
    loadLogs(1)
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
            <ShieldCheck size={16} />
            Admin Audit Trail
          </p>

          <h2 className="text-2xl font-black text-white">
            Platform action logs
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Review important actions such as payment confirmations, job approval
            decisions, application status changes, and employer verification
            decisions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadLogs(pagination.page)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="mt-6 flex flex-col gap-4"
      >
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search action, actor, target, or description"
            className="w-full rounded-2xl border border-white/10 bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-teal-400"
          />
        </div>

        <select
          value={action}
          onChange={(event) => setAction(event.target.value)}
          className="w-full min-w-0 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-teal-400"
        >
          {actionOptions.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={targetType}
          onChange={(event) => setTargetType(event.target.value)}
          className="w-full min-w-0 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-teal-400"
        >
          {targetOptions.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 hover:bg-yellow-300"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
          <AlertTriangle className="shrink-0" size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-zinc-400">Loading audit logs...</p>
      ) : logs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-5 text-sm text-zinc-400">
          No audit logs found.
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-3xl border border-white/10 bg-zinc-950/70 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${actionBadgeClass(
                        log.action
                      )}`}
                    >
                      <Activity size={14} />
                      {log.action}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">
                      {log.targetType}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-200">
                    {log.description}
                  </p>

                  <div className="mt-4 grid gap-2 text-xs text-zinc-400 md:grid-cols-2">
                    <p>
                      <span className="font-bold text-zinc-200">Actor:</span>{" "}
                      {log.actorName || "Unknown"}{" "}
                      {log.actorEmail ? `(${log.actorEmail})` : ""}
                    </p>

                    <p>
                      <span className="font-bold text-zinc-200">Role:</span>{" "}
                      {log.actorRole || "Unknown"}
                    </p>

                    <p>
                      <span className="font-bold text-zinc-200">Date:</span>{" "}
                      {formatDate(log.createdAt)}
                    </p>

                    <p>
                      <span className="font-bold text-zinc-200">Target ID:</span>{" "}
                      {log.targetId || "Not available"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedLogId((current) =>
                      current === log.id ? "" : log.id
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  <Eye size={16} />
                  {expandedLogId === log.id ? "Hide details" : "View details"}
                </button>
              </div>

              {expandedLogId === log.id && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="mb-2 text-sm font-black text-white">
                    Metadata
                  </p>

                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs leading-6 text-zinc-300">
                    {JSON.stringify(log.metadata || {}, null, 2)}
                  </pre>

                  <div className="mt-4 grid gap-2 text-xs text-zinc-500 md:grid-cols-2">
                    <p>IP: {log.ipAddress || "Not available"}</p>
                    <p>User Agent: {log.userAgent || "Not available"}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-zinc-400">
          Showing page {pagination.page} of {pagination.totalPages || 1} —{" "}
          {pagination.total} total logs
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => loadLogs(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <button
            type="button"
            onClick={() => loadLogs(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}