import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { getPublicBackendJob, submitJobApplication } from "../services/api"

function Apply() {
  const { id } = useParams()
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  const profile = currentUser.jobSeekerProfile || {}

  const [job, setJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [jobError, setJobError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadJob() {
      try {
        setLoadingJob(true)
        setJobError("")

        const response = await getPublicBackendJob(id)
        setJob(response.job)
      } catch (error) {
        setJobError(error.message || "Failed to load job")
      } finally {
        setLoadingJob(false)
      }
    }

    loadJob()
  }, [id])

  const isClosed =
    job && (!job.canApply || job.isDeadlineReached || !job.isDeadlineValid)

  async function handleApplication(event) {
    event.preventDefault()

    if (isClosed) {
      setError("This job is no longer accepting applications.")
      return
    }

    const formData = new FormData(event.target)
    const cvFile = formData.get("cvFile")

    const applicationData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      cvFileName: cvFile?.name || "",
      coverNote: formData.get("coverNote"),
    }

    try {
      setLoading(true)
      setError("")

      await submitJobApplication(id, applicationData)

      setSubmitted(true)

      setTimeout(() => {
        navigate("/dashboard")
      }, 1400)
    } catch (error) {
      setError(error.message || "Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl">
          <Link
            to={`/jobs/${id}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-300 hover:text-teal-200"
          >
            ← Back to Job Details
          </Link>

          {loadingJob && (
            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-sm font-bold text-teal-300">
                Loading application page...
              </p>
            </div>
          )}

          {jobError && (
            <div className="mt-10 rounded-[2rem] border border-red-400/20 bg-red-400/10 p-10 text-center">
              <AlertTriangle size={40} className="mx-auto text-red-300" />

              <h1 className="mt-5 text-3xl font-extrabold text-red-300">
                Job not available
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-300">
                {jobError}
              </p>

              <Link
                to="/jobs"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
              >
                Browse Jobs
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {!loadingJob && !jobError && job && (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px] lg:items-start">
              <div>
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-teal-500/10 md:p-10">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <CompanyLogo logo={job.companyLogo} company={job.company} />

                    <div className="flex-1">
                      <p className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-bold text-teal-300">
                        <BriefcaseBusiness size={16} />
                        Job Application
                      </p>

                      <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
                        Apply for {job.title}
                      </h1>

                      <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
                        Submit your application for{" "}
                        <span className="font-bold text-white">{job.company}</span>.
                        The employer will review your application and update your status.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
                        <span className="inline-flex items-center gap-2">
                          <Building2 size={17} className="text-teal-300" />
                          {job.company || "Verified Employer"}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <MapPin size={17} className="text-teal-300" />
                          {job.location || "Location not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {isClosed && (
                  <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-8">
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold text-red-300">
                      <XCircle size={24} />
                      Applications Closed
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      This job is no longer accepting applications because the deadline
                      has been reached or the deadline date is invalid.
                    </p>

                    <Link
                      to="/jobs"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-3 text-sm font-extrabold text-zinc-950 hover:bg-yellow-300"
                    >
                      Browse Other Jobs
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                )}

                {submitted && (
                  <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold text-emerald-300">
                      <CheckCircle2 size={24} />
                      Application submitted successfully.
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      Your application has been submitted. You will be redirected to your
                      dashboard shortly.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-8 rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
                    <h2 className="font-extrabold text-red-300">
                      Application failed
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">{error}</p>
                  </div>
                )}

                {!isClosed && (
                  <form
                    onSubmit={handleApplication}
                    className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8"
                  >
                    <h2 className="text-3xl font-extrabold">
                      Applicant Information
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Please use accurate details. Employers will use these details to
                      contact you if shortlisted.
                    </p>

                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                      <InputField
                        icon={User}
                        label="Full Name"
                        name="fullName"
                        defaultValue={
                          profile.fullName ||
                          currentUser.displayName ||
                          currentUser.name ||
                          ""
                        }
                        placeholder="Enter your full name"
                        required
                      />

                      <InputField
                        icon={Mail}
                        label="Email Address"
                        name="email"
                        type="email"
                        defaultValue={currentUser.email || ""}
                        placeholder="Enter your email"
                        required
                      />

                      <div className="md:col-span-2">
                        <InputField
                          icon={Phone}
                          label="Phone Number"
                          name="phone"
                          defaultValue={profile.phone || currentUser.phone || ""}
                          placeholder="e.g. +260..."
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <label className="text-sm font-bold text-zinc-300">
                        Upload CV
                      </label>

                      <div className="mt-2 rounded-2xl border border-dashed border-white/20 bg-zinc-950 p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-zinc-950">
                            <FileText size={24} />
                          </div>

                          <div className="w-full">
                            <input
                              type="file"
                              name="cvFile"
                              accept=".pdf,.doc,.docx"
                              className="w-full text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-yellow-400 file:px-5 file:py-2 file:text-sm file:font-bold file:text-zinc-950 hover:file:bg-yellow-300"
                            />

                            <p className="mt-3 text-xs leading-5 text-zinc-500">
                              Your CV file name will be attached to the application.
                              Full file upload storage will be added later.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <label className="text-sm font-bold text-zinc-300">
                        Cover Note
                      </label>

                      <textarea
                        name="coverNote"
                        rows="7"
                        placeholder="Briefly explain why you are suitable for this role."
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-teal-400"
                      ></textarea>
                    </div>

                    <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
                      <h3 className="flex items-center gap-2 font-bold text-red-300">
                        <AlertTriangle size={20} />
                        Safety Reminder
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-300">
                        Do not pay any money for this application. TrueHire Global does
                        not support application fees, registration fees, interview fees,
                        medical fees, or recruitment payments.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitted || loading}
                      className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-extrabold ${
                        submitted || loading
                          ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                          : "bg-yellow-400 text-zinc-950 hover:bg-yellow-300"
                      }`}
                    >
                      {loading
                        ? "Submitting Application..."
                        : submitted
                        ? "Application Submitted"
                        : "Submit Application"}

                      {!submitted && !loading && <ArrowRight size={17} />}
                    </button>
                  </form>
                )}
              </div>

              <aside className="lg:sticky lg:top-28 lg:h-fit">
                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-teal-500/10">
                    <div
                      className={`rounded-[1.5rem] border p-6 ${
                        isClosed
                          ? "border-red-400/20 bg-red-400/10"
                          : "border-teal-400/20 bg-teal-400/10"
                      }`}
                    >
                      {isClosed ? (
                        <XCircle size={34} className="text-red-300" />
                      ) : (
                        <ShieldCheck size={34} className="text-teal-300" />
                      )}

                      <h2
                        className={`mt-5 text-2xl font-extrabold ${
                          isClosed ? "text-red-300" : "text-white"
                        }`}
                      >
                        {isClosed ? "Closed Advert" : "Approved Job"}
                      </h2>

                      <p className="mt-3 text-sm leading-7 text-zinc-300">
                        {isClosed
                          ? "Applications are currently closed for this job advert."
                          : "This job is visible because it was reviewed and approved."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                    <h2 className="text-2xl font-extrabold">Job Summary</h2>

                    <div className="mt-5 space-y-4 text-sm text-zinc-300">
                      <SummaryItem label="Title" value={job.title} />
                      <SummaryItem label="Company" value={job.company} />
                      <SummaryItem label="Location" value={job.location} />
                      <SummaryItem label="Type" value={job.type} />
                      <SummaryItem label="Category" value={job.category} />
                      <SummaryItem label="Deadline" value={job.deadline} />
                      <SummaryItem
                        label="Status"
                        value={isClosed ? job.deadlineStatus || "Closed" : "Open"}
                      />
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-6">
                    <h2 className="text-2xl font-extrabold text-yellow-300">
                      Application Status
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      After submission, your application status will start as:
                    </p>

                    <p className="mt-5 rounded-full bg-zinc-950 px-4 py-2 text-center text-sm font-bold text-yellow-300">
                      Submitted
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function CompanyLogo({ logo, company }) {
  const [hasError, setHasError] = useState(false)

  const initials = (company || "TH")
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  if (logo && !hasError) {
    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white">
        <img
          src={logo}
          alt={`${company || "Company"} logo`}
          className="h-full w-full object-contain p-3"
          onError={() => setHasError(true)}
        />
      </div>
    )
  }

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-teal-400/20 bg-teal-400/10 text-2xl font-extrabold text-teal-300">
      {initials}
    </div>
  )
}

function InputField({
  icon: Icon,
  label,
  name,
  type = "text",
  placeholder,
  defaultValue = "",
  required = false,
}) {
  return (
    <div>
      <label className="text-sm font-bold text-zinc-300">{label}</label>

      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4">
        <Icon size={19} className="text-teal-300" />

        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
        />
      </div>
    </div>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-white">
        {value || "Not specified"}
      </p>
    </div>
  )
}

export default Apply