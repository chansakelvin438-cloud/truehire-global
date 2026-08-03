import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  XCircle,
} from "lucide-react"
import { getMyApplications } from "../services/api"

function ApplicationHistory() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true)
        setError("")

        const response = await getMyApplications()
        setApplications(response.applications || [])
      } catch (error) {
        setError(error.message || "Failed to load applications")
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

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

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold">My Applications</h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Track jobs you have applied for through TrueHire Global.
          </p>
        </div>

        <div className="rounded-full bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
          {applications.length} Applications
        </div>
      </div>

      {loading && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <p className="text-sm font-bold text-teal-300">
            Loading your applications...
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

            return (
              <div
                key={application.id}
                className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
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
                      {job.company || "Employer unavailable"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={16} className="text-teal-300" />
                        {job.location || "Location not specified"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} className="text-teal-300" />
                        Applied: {application.submittedAt || "Not available"}
                      </span>
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

                  <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                    <BriefcaseBusiness
                      size={28}
                      className="mx-auto text-yellow-300"
                    />

                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-white">
                      {application.status || "Submitted"}
                    </p>
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
            No applications yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Once you apply for jobs, your applications will appear here from the backend database.
          </p>
        </div>
      )}
    </div>
  )
}

export default ApplicationHistory