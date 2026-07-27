import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  UserCheck,
} from "lucide-react"

function EmployerApplicationsPanel() {
  const [applications, setApplications] = useState([])

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const employerJobs = JSON.parse(localStorage.getItem("employerJobs") || "[]")

  useEffect(() => {
    const savedApplications = JSON.parse(localStorage.getItem("applications") || "[]")
    setApplications(savedApplications)
  }, [])

  const employerJobIds = employerJobs
    .filter(
      (job) =>
        job.email === currentUser.email ||
        job.company === currentUser.companyName ||
        job.company === currentUser.displayName
    )
    .map((job) => String(job.id))

  const employerApplications = applications.filter(
    (application) =>
      employerJobIds.includes(String(application.jobId)) ||
      application.company === currentUser.companyName ||
      application.company === currentUser.displayName
  )

  function updateApplicationStatus(applicationId, newStatus) {
    const selectedApplication = applications.find(
      (application) => application.id === applicationId
    )

    if (!selectedApplication) return

    const updatedApplications = applications.map((application) =>
      application.id === applicationId
        ? { ...application, status: newStatus }
        : application
    )

    const newNotification = {
      id: Date.now(),
      email: selectedApplication.email,
      jobId: selectedApplication.jobId,
      title: selectedApplication.jobTitle,
      status: newStatus,
      message: `Your application for ${selectedApplication.jobTitle} at ${selectedApplication.company} has been updated to ${newStatus}.`,
      createdAt: new Date().toLocaleDateString("en-GB"),
      isRead: false,
    }

    const savedNotifications = JSON.parse(
      localStorage.getItem("jobSeekerNotifications") || "[]"
    )

    localStorage.setItem(
      "jobSeekerNotifications",
      JSON.stringify([newNotification, ...savedNotifications])
    )

    setApplications(updatedApplications)
    localStorage.setItem("applications", JSON.stringify(updatedApplications))
  }

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
          <h2 className="text-3xl font-extrabold">Job Applications Received</h2>

          <p className="mt-2 text-sm text-zinc-400">
            Review applicants who applied to your submitted job adverts.
          </p>
        </div>

        <Link
          to="/employers/post-job"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 px-5 py-3 text-sm font-bold text-teal-300 hover:bg-teal-500 hover:text-zinc-950"
        >
          Post Job
          <ArrowRight size={17} />
        </Link>
      </div>

      {employerApplications.length > 0 ? (
        <div className="mt-6 space-y-5">
          {employerApplications.map((application) => (
            <div
              key={application.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-bold text-teal-300">
                    {application.jobTitle}
                  </p>

                  <h3 className="mt-2 text-2xl font-extrabold">
                    {application.applicantName || "Applicant"}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm text-zinc-400">
                    <p className="flex items-center gap-2">
                      <Mail size={17} className="text-teal-300" />
                      {application.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone size={17} className="text-yellow-300" />
                      {application.phone}
                    </p>

                    <p className="flex items-center gap-2">
                      <FileText size={17} className="text-emerald-300" />
                      CV: {application.cvFileName}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-zinc-300" />
                      Submitted: {application.submittedAt}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-center text-xs font-bold ${getStatusClass(
                    application.status
                  )}`}
                >
                  {application.status}
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

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <StatusButton
                  label="Mark Reviewed"
                  colour="blue"
                  onClick={() => updateApplicationStatus(application.id, "Reviewed")}
                />

                <StatusButton
                  label="Shortlist"
                  colour="emerald"
                  onClick={() => updateApplicationStatus(application.id, "Shortlisted")}
                />

                <StatusButton
                  label="Interview"
                  colour="purple"
                  onClick={() =>
                    updateApplicationStatus(application.id, "Interview Scheduled")
                  }
                />

                <StatusButton
                  label="Reject"
                  colour="red"
                  onClick={() => updateApplicationStatus(application.id, "Rejected")}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
            <UserCheck size={28} />
          </div>

          <h3 className="mt-5 text-2xl font-extrabold">No applications yet</h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Applications from job seekers will appear here after they apply to your jobs.
          </p>
        </div>
      )}
    </div>
  )
}

function StatusButton({ label, colour, onClick }) {
  const classes = {
    blue: "border-blue-400/40 text-blue-300 hover:bg-blue-500 hover:text-white",
    emerald:
      "border-emerald-400/40 text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950",
    purple:
      "border-purple-400/40 text-purple-300 hover:bg-purple-500 hover:text-white",
    red: "border-red-400/40 text-red-300 hover:bg-red-500 hover:text-white",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-5 py-3 text-sm font-bold ${classes[colour]}`}
    >
      {label}
    </button>
  )
}

export default EmployerApplicationsPanel