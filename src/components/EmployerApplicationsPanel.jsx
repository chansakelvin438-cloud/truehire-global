import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Mail,
  Phone,
  User,
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
      setError(error.message || "Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(applicationId, status) {
    try {
      setUpdatingId(applicationId)

      const response = await updateEmployerApplicationStatus(
        applicationId,
        status
      )

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

    if (status === "Reviewed") {
      return "bg-yellow-400/10 text-yellow-300"
    }

    if (status === "Rejected") {
      return "bg-red-400/10 text-red-300"
    }

    return "bg-white/10 text-zinc-300"
  }

  const submittedCount = applications.filter(
    (application) => application.status === "Submitted"
  ).length

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length

  const interviewCount = applications.filter(
    (application) => application.status === "Interview Scheduled"
  ).length

  const rejectedCount = applications.filter(
    (application) => application.status === "Rejected"
  ).length

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-extrabold">
            <BriefcaseBusiness size={28} className="text-teal-300" />
            Job Applications
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Review applicants, open CVs, and update application status.
          </p>
        </div>

        <div className="rounded-full bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
          {applications.length} Applications
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Submitted" value={submittedCount} colour="text-zinc-300" />
        <StatCard label="Shortlisted" value={shortlistedCount} colour="text-emerald-300" />
        <StatCard label="Interviews" value={interviewCount} colour="text-teal-300" />
        <StatCard label="Rejected" value={rejectedCount} colour="text-red-300" />
      </div>

      {loading && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <p className="text-sm font-bold text-teal-300">
            Loading applications...
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
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {application.status || "Submitted"}
                    </span>

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">
                      Applied: {application.appliedAt || application.createdAt || "Recently"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-extrabold">
                    {application.fullName || "Applicant name unavailable"}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Applied for:{" "}
                    <span className="font-bold text-white">
                      {application.job?.title ||
                        application.jobTitle ||
                        "Job title unavailable"}
                    </span>
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
                    <InfoLine icon={Mail} label="Email" value={application.email} />
                    <InfoLine
                      icon={Phone}
                      label="Phone"
                      value={application.phone || "No phone added"}
                    />
                    <InfoLine
                      icon={BriefcaseBusiness}
                      label="Job"
                      value={application.job?.title || application.jobTitle}
                    />
                    <InfoLine
                      icon={Calendar}
                      label="Deadline"
                      value={application.job?.deadline || application.deadline}
                    />
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                      <FileText size={15} className="text-yellow-300" />
                      Applicant CV
                    </p>

                    {application.cvFileUrl ? (
                      <a
                        href={application.cvFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                      >
                        <Download size={16} />
                        Open CV
                      </a>
                    ) : (
                      <p className="mt-2 text-sm font-bold text-zinc-300">
                        {application.cvFileName || "No CV attached"}
                      </p>
                    )}
                  </div>

                  {application.coverNote && (
                    <div className="mt-5 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
                      <h4 className="font-bold text-teal-300">Cover Note</h4>

                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        {application.coverNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full shrink-0 space-y-3 lg:w-56">
                  <button
                    type="button"
                    disabled={updatingId === application.id}
                    onClick={() =>
                      handleStatusUpdate(application.id, "Reviewed")
                    }
                    className="w-full rounded-2xl border border-yellow-400/40 px-5 py-3 text-sm font-bold text-yellow-300 hover:bg-yellow-400 hover:text-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-500"
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
          ))}
        </div>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <CheckCircle2 size={32} />
          </div>

          <h3 className="mt-6 text-2xl font-extrabold">
            No applications yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Applications for your posted jobs will appear here.
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
        {value || "Not provided"}
      </p>
    </div>
  )
}

export default EmployerApplicationsPanel