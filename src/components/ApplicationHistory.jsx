import { useEffect, useState } from "react"
import {
  AlertTriangle,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Mail,
  MapPin,
} from "lucide-react"
import { getMyApplications } from "../services/api"
import ProtectedFileButton from "./ProtectedFileButton"

function ApplicationHistory() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadApplications()
  }, [])

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

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-extrabold">
            <BriefcaseBusiness size={28} className="text-teal-300" />
            My Applications
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Track the jobs you have applied for and view your application status.
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
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
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
                    {application.job?.title ||
                      application.jobTitle ||
                      "Job title unavailable"}
                  </h3>

                  <div className="mt-4 grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
                    <InfoLine
                      icon={Building2}
                      label="Company"
                      value={
                        application.job?.company ||
                        application.company ||
                        "Company unavailable"
                      }
                    />

                    <InfoLine
                      icon={MapPin}
                      label="Location"
                      value={
                        application.job?.location ||
                        application.location ||
                        "Location unavailable"
                      }
                    />

                    <InfoLine
                      icon={Mail}
                      label="Application Email"
                      value={application.email}
                    />

                    <InfoLine
                      icon={Calendar}
                      label="Deadline"
                      value={application.job?.deadline || application.deadline}
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                      <FileText size={15} className="text-yellow-300" />
                      Submitted CV
                    </p>

                    {application.cvFileUrl ? (
                      <ProtectedFileButton
                      fileUrl={application.cvFileUrl}
                      label="Open CV" />
                    ) : (
                      <p className="mt-2 text-sm font-bold text-zinc-300">
                        {application.cvFileName || "No CV attached"}
                      </p>
                    )}
                  </div>

                  {application.coverNote && (
                    <div className="mt-4 rounded-2xl border border-teal-400/20 bg-teal-400/10 p-4">
                      <h4 className="font-bold text-teal-300">Cover Note</h4>

                      <p className="mt-2 text-sm leading-7 text-zinc-300">
                        {application.coverNote}
                      </p>
                    </div>
                  )}
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
            Jobs you apply for will appear here with their latest application status.
          </p>
        </div>
      )}
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

export default ApplicationHistory