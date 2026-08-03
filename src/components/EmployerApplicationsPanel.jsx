import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react"
import {
  getEmployerApplications,
  updateEmployerApplicationStatus,
} from "../services/api"

function EmployerApplicationsPanel() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")

  useEffect(() => {
    loadApplications()
  }, [])

  async function loadApplications() {
    try {
      setLoading(true)
      setError("")

      const response = await getEmployerApplications()
      setApplications(response.applications || [])
    } catch (error) {
      setError(error.message || "Failed to load employer applications")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(applicationId, status) {
    try {
      setUpdatingId(applicationId)

      const response = await updateEmployerApplicationStatus(applicationId, status)

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? response.application
            : application
        )
      )
    } catch (error) {
      alert(error.message || "Failed to update application status")
    } finally {
      setUpdatingId("")
    }
  }

  function getStatusClass(status) {
    if (status === "Shortlisted") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Interview Scheduled") {
      return "bg-teal-400/10 text-teal-300"
    }

    if (status === "Rejected") {
      return "bg-red-400/10 text-red-300"
    }

    if (status === "Reviewed") {
      return "bg-blue-400/10 text-blue-300"
    }

    return "bg-yellow-400/10 text-yellow-300"
  }

  function getStatusIcon(status) {
    if (status === "Shortlisted" || status === "Interview Scheduled") {
      return CheckCircle2
    }

    if (status === "Rejected") {
      return XCircle
    }

    if (status === "Reviewed") {
      return FileText
    }

    return Clock
  }

  const submittedCount = applications.filter(
    (application) => application.status === "Submitted"
  ).length

  const reviewedCount = applications.filter(
    (application) => application.status === "Reviewed"
  ).length

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length

  const interviewCount = applications.filter(
    (application) => application.status === "Interview Scheduled"
  ).length

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold">Employer Applications</h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Review real applications submitted by job seekers through the backend database.
          </p>
        </div>

        <div className="rounded-full bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
          {applications.length} Applications
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Submitted" value={submittedCount} colour="text-yellow-300" />
        <StatCard label="Reviewed" value={reviewedCount} colour="text-blue-300" />
        <StatCard label="Shortlisted" value={shortlistedCount} colour="text-emerald-300" />
        <StatCard label="Interviews" value={interviewCount} colour="text-teal-300" />
      </div>

      {loading && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <p className="text-sm font-bold text-teal-300">
            Loading employer applications...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-3xl border border-red-400/20 bg-red-400/10 p-8 text-center">
          <AlertTriangle size={36} className="mx-auto text-red-300" />

          <h3 className="mt-4 text-xl font-extrabold text-red-300">
            Could not load applications
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-300">{error}</p>
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="mt-6 space-y-5">
          {applications.map((application) => {
            const StatusIcon = getStatusIcon(application.status)
            const job = application.job || {}
            const applicant = application.applicant || {}

            return (
              <div
                key={application.id}
                className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
              >
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-bold text-teal-300">
                        {job.category || "General"}
                      </span>

                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                        {job.type || "Job"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          application.status
                        )}`}
                      >
                        <StatusIcon size={14} />
                        {application.status || "Submitted"}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-extrabold">
                      {job.title || "Job title unavailable"}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-zinc-300">
                      {job.company || "Company unavailable"}
                    </p>

                    <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
                      <InfoLine
                        icon={User}
                        label="Applicant"
                        value={application.fullName || applicant.name}
                      />

                      <InfoLine
                        icon={Mail}
                        label="Email"
                        value={application.email || applicant.email}
                      />

                      <InfoLine
                        icon={Phone}
                        label="Phone"
                        value={application.phone || applicant.phone || "No phone added"}
                      />

                      <InfoLine
                        icon={CalendarDays}
                        label="Applied"
                        value={application.submittedAt || "Not available"}
                      />
                    </div>

                    {application.coverNote && (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <h4 className="font-bold">Cover Note</h4>

                        <p className="mt-2 text-sm leading-7 text-zinc-300">
                          {application.coverNote}
                        </p>
                      </div>
                    )}

                    {application.cvFileName && (
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-zinc-300">
                        <FileText size={15} className="text-teal-300" />
                        CV: {application.cvFileName}
                      </p>
                    )}
                  </div>

                  <div className="w-full shrink-0 space-y-3 lg:w-56">
                    <button
                      type="button"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        handleStatusUpdate(application.id, "Reviewed")
                      }
                      className="w-full rounded-2xl border border-blue-400/40 px-5 py-3 text-sm font-bold text-blue-300 hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                    >
                      {updatingId === application.id ? "Updating..." : "Mark Reviewed"}
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        handleStatusUpdate(application.id, "Shortlisted")
                      }
                      className="w-full rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      Shortlist
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        handleStatusUpdate(application.id, "Interview Scheduled")
                      }
                      className="w-full rounded-2xl border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                    >
                      Schedule Interview
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === application.id}
                      onClick={() =>
                        handleStatusUpdate(application.id, "Rejected")
                      }
                      className="w-full rounded-2xl border border-red-400/40 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <BriefcaseBusiness size={32} />
          </div>

          <h3 className="mt-6 text-2xl font-extrabold">
            No applications received yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Applications submitted by job seekers for your jobs will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, colour }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className={`mt-2 text-3xl font-extrabold ${colour}`}>{value}</p>
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
        {value || "Not available"}
      </p>
    </div>
  )
}

export default EmployerApplicationsPanel