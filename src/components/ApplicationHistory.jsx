import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  MapPin,
} from "lucide-react"

function ApplicationHistory() {
  const [applications, setApplications] = useState([])

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]")

    const userApplications = savedApplications.filter(
      (application) => application.email === currentUser.email
    )

    setApplications(userApplications)
  }, [currentUser.email])

  function getStatusClass(status) {
    if (status === "Shortlisted") {
      return "bg-emerald-400/10 text-emerald-300"
    }

    if (status === "Rejected") {
      return "bg-red-400/10 text-red-300"
    }

    if (status === "Interview Scheduled") {
      return "bg-purple-400/10 text-purple-300"
    }

    if (status === "Reviewed") {
      return "bg-blue-400/10 text-blue-300"
    }

    return "bg-yellow-400/10 text-yellow-300"
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold">Application History</h2>

          <p className="mt-2 text-sm text-zinc-400">
            Track jobs you have applied for and monitor employer status updates.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
        >
          Browse Jobs
          <ArrowRight size={17} />
        </Link>
      </div>

      {applications.length > 0 ? (
        <div className="mt-6 space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-bold text-teal-300">
                    {application.category || "Job Application"}
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold">
                    {application.jobTitle}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-zinc-400">
                    <p className="flex items-center gap-2">
                      <BriefcaseBusiness size={17} className="text-yellow-300" />
                      {application.company}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={17} className="text-teal-300" />
                      {application.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-emerald-300" />
                      Submitted: {application.submittedAt}
                    </p>

                    <p className="flex items-center gap-2">
                      <FileText size={17} className="text-zinc-300" />
                      CV: {application.cvFileName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-center text-xs font-bold ${getStatusClass(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>

                  <Link
                    to={`/jobs/${application.jobId}`}
                    className="rounded-full border border-teal-400/40 px-4 py-2 text-center text-xs font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
                  >
                    View Job
                  </Link>
                </div>
              </div>

              {application.coverNote && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h4 className="font-bold">Cover Note</h4>
                  <p className="mt-2 text-sm leading-7 text-zinc-300">
                    {application.coverNote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <BriefcaseBusiness size={28} />
          </div>

          <h3 className="mt-5 text-2xl font-extrabold">
            No applications yet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Jobs you apply for will appear here with their application status.
          </p>

          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
          >
            Find Jobs
            <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </div>
  )
}

export default ApplicationHistory